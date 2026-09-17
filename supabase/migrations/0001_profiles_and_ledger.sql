-- ============================================================================
-- Profili, saldi e registro dei movimenti.
--
-- Da eseguire una volta sola in Supabase → SQL Editor → New query → Run.
--
-- Il saldo NON può stare in user_metadata: quel campo è modificabile
-- dall'utente stesso tramite le API di Supabase, quindi chiunque potrebbe
-- assegnarsi il denaro che vuole. Vive qui, in una tabella su cui l'utente
-- non ha alcun permesso di scrittura.
--
-- Gli importi sono in CENTESIMI, come bigint: i numeri in virgola mobile
-- non vanno mai usati per il denaro (0.1 + 0.2 ≠ 0.3).
-- ============================================================================

-- ─────────────────────────── Tabelle ───────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  city text,
  /** Somma dichiarata in fase di registrazione: un'intenzione, non un saldo. */
  declared_amount_cents bigint,
  balance_cents bigint not null default 0,
  currency text not null default 'EUR',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Registro in sola aggiunta: ogni movimento resta, con chi lo ha fatto e perché.
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  /** Positivo = accredito, negativo = addebito. */
  amount_cents bigint not null,
  balance_after_cents bigint not null,
  reason text not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists ledger_entries_user_created_idx
  on public.ledger_entries (user_id, created_at desc);

-- ─────────────────────────── Permessi ───────────────────────────

alter table public.profiles enable row level security;
alter table public.ledger_entries enable row level security;

-- Nessuna scrittura diretta per chi usa l'app: saldo e ruolo cambiano solo
-- attraverso le funzioni più sotto, che verificano chi sta chiamando.
revoke all on public.profiles from anon, authenticated;
revoke all on public.ledger_entries from anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.ledger_entries to authenticated;

/**
 * Chi chiama è un amministratore?
 *
 * security definer è obbligatorio: la funzione legge `profiles`, e viene usata
 * dentro le policy di `profiles` stessa. Senza definer si avrebbe ricorsione.
 * `set search_path` impedisce che uno schema creato ad arte dirotti la query.
 */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles
  for select using (public.is_admin());

drop policy if exists ledger_select_own on public.ledger_entries;
create policy ledger_select_own on public.ledger_entries
  for select using (user_id = auth.uid());

drop policy if exists ledger_select_admin on public.ledger_entries;
create policy ledger_select_admin on public.ledger_entries
  for select using (public.is_admin());

-- ──────────────────── Profilo alla registrazione ────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone, city, declared_amount_cents)
  values (
    new.id,
    new.email,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'city', '')), ''),
    case
      when (new.raw_user_meta_data ->> 'amount') ~ '^[0-9]+(\.[0-9]+)?$'
        then round((new.raw_user_meta_data ->> 'amount')::numeric * 100)::bigint
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────── Movimenti di saldo ────────────────────

/**
 * Accredita o addebita, e scrive il registro, in un'unica transazione: se il
 * registro fallisse, anche il saldo tornerebbe indietro. Il controllo sul
 * ruolo è QUI, nel database, non solo nell'interfaccia: è l'unico punto che
 * un client non può aggirare.
 */
create or replace function public.admin_adjust_balance(
  target_user uuid,
  delta_cents bigint,
  adjust_reason text
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_balance bigint;
  clean_reason text := btrim(coalesce(adjust_reason, ''));
begin
  if not public.is_admin() then
    raise exception 'non autorizzato' using errcode = '42501';
  end if;

  if delta_cents is null or delta_cents = 0 then
    raise exception 'importo non valido' using errcode = '22023';
  end if;

  -- Un miliardo di euro: limite di sanità contro gli errori di battitura.
  if abs(delta_cents) > 100000000000 then
    raise exception 'importo fuori scala' using errcode = '22003';
  end if;

  if clean_reason = '' or length(clean_reason) > 500 then
    raise exception 'motivo obbligatorio' using errcode = '22023';
  end if;

  update public.profiles
     set balance_cents = balance_cents + delta_cents
   where id = target_user
  returning balance_cents into new_balance;

  if new_balance is null then
    raise exception 'utente inesistente' using errcode = 'P0002';
  end if;

  -- L'intera funzione è una transazione: sollevare qui annulla l'update.
  if new_balance < 0 then
    raise exception 'il saldo non può diventare negativo' using errcode = '23514';
  end if;

  insert into public.ledger_entries (user_id, amount_cents, balance_after_cents, reason, created_by)
  values (target_user, delta_cents, new_balance, clean_reason, auth.uid());

  return new_balance;
end;
$$;

/** Promuove o revoca un amministratore. Non ci si può revocare da soli. */
create or replace function public.admin_set_admin(target_user uuid, make_admin boolean)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'non autorizzato' using errcode = '42501';
  end if;

  if target_user = auth.uid() and make_admin is false then
    raise exception 'non puoi revocare i tuoi permessi' using errcode = '23514';
  end if;

  update public.profiles set is_admin = make_admin where id = target_user;
  if not found then
    raise exception 'utente inesistente' using errcode = 'P0002';
  end if;

  return make_admin;
end;
$$;

revoke all on function public.admin_adjust_balance(uuid, bigint, text) from public, anon;
revoke all on function public.admin_set_admin(uuid, boolean) from public, anon;
grant execute on function public.admin_adjust_balance(uuid, bigint, text) to authenticated;
grant execute on function public.admin_set_admin(uuid, boolean) to authenticated;

-- ──────────────────── Utenti già registrati ────────────────────

-- Il trigger vale solo per le registrazioni future: qui si recupera chi c'era già.
insert into public.profiles (id, email, first_name, last_name, phone, city, declared_amount_cents)
select
  u.id,
  u.email,
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'first_name', '')), ''),
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'last_name', '')), ''),
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'phone', '')), ''),
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'city', '')), ''),
  case
    when (u.raw_user_meta_data ->> 'amount') ~ '^[0-9]+(\.[0-9]+)?$'
      then round((u.raw_user_meta_data ->> 'amount')::numeric * 100)::bigint
    else null
  end
from auth.users u
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────────
-- ULTIMO PASSO, da fare a mano una volta sola: nominare il primo
-- amministratore. Sostituire l'indirizzo con il proprio.
--
--   update public.profiles set is_admin = true where email = 'tua@email.it';
--
-- Da quel momento i successivi si nominano dal pannello.
-- ────────────────────────────────────────────────────────────────
