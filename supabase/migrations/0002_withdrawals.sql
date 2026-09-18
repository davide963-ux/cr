-- ============================================================================
-- Richieste di prelievo e loro approvazione.
--
-- Da eseguire una volta sola in Supabase → SQL Editor → New query → Run,
-- DOPO 0001_profiles_and_ledger.sql.
--
-- Scelta di fondo: la richiesta TRATTIENE SUBITO il denaro.
--
-- Il saldo viene addebitato nel momento in cui l'utente chiede il prelievo,
-- non quando l'amministratore approva. Altrimenti chi ha 1.000 € potrebbe
-- aprire cinque richieste da 1.000 € ciascuna, e approvandole tutte si
-- creerebbe un buco di 4.000 €. Trattenendo subito, chiedere più di quanto si
-- ha diventa impossibile per costruzione, non una corsa che l'amministratore
-- deve accorgersi di perdere.
--
-- Di conseguenza `profiles.balance_cents` è il saldo DISPONIBILE: quanto è in
-- attesa si legge sommando le richieste in stato 'pending'.
--
-- Se la richiesta viene rifiutata o annullata, il denaro torna indietro con un
-- movimento di segno opposto: il registro conserva entrambi i passaggi.
-- ============================================================================


do $$
begin
  if not (to_regclass('public.profiles') is not null) then
    raise exception 'Manca un passaggio precedente: esegui prima 0001_profiles_and_ledger.sql. Esegui STATO.sql per l''elenco completo, in ordine.'
      using errcode = '55000';
  end if;
end
$$;

-- ─────────────── Protezione ───────────────
/*
 * Rieseguire una migrazione dopo che una successiva è già passata non è un
 * ritocco innocuo: ricrea la versione vecchia delle funzioni accanto a quella
 * nuova. PostgREST si trova due firme con lo stesso nome, non sa quale
 * chiamare, e l'applicazione smette di funzionare con PGRST203 — senza che
 * nulla, qui, sia sembrato andare storto.
 *
 * Meglio fermarsi con un messaggio che dice cosa fare.
 */
do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'profiles' and column_name = 'balance_sats'
  ) then
    raise exception 'Questo file è già superato: la 0004 è stata eseguita. Non rieseguire le migrazioni precedenti. Esegui STATO.sql per vedere cosa manca davvero.'
      using errcode = '55000';
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'withdrawals'
       and column_name = 'destination' and is_nullable = 'YES'
  ) then
    raise exception 'Questo file è già superato: la 0003 è stata eseguita. Non rieseguire le migrazioni precedenti. Esegui STATO.sql per vedere cosa manca davvero.'
      using errcode = '55000';
  end if;
end
$$;

-- ─────────────────────────── Stato ───────────────────────────

-- `create type` non ammette "if not exists": serve il giro dal catalogo.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'withdrawal_status') then
    create type public.withdrawal_status as enum ('pending', 'approved', 'rejected', 'cancelled');
  end if;
end
$$;

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  /*
   * Punta a `profiles`, non ad `auth.users`, per due motivi: il saldo che la
   * richiesta muove sta lì, e PostgREST sa costruire la join solo se esiste un
   * vincolo fra le due tabelle — senza, il pannello mostrerebbe un UUID al
   * posto dell'utente. `profiles` cascata già da auth.users, quindi la
   * cancellazione di un utente continua ad arrivare fin qui.
   */
  user_id uuid not null references public.profiles (id) on delete cascade,
  /** Sempre positivo: il verso lo dice lo stato, non il segno. */
  amount_cents bigint not null check (amount_cents > 0),
  /** IBAN o indirizzo del portafoglio indicato da chi richiede. */
  destination text not null check (length(btrim(destination)) between 1 and 200),
  note text check (note is null or length(note) <= 500),
  status public.withdrawal_status not null default 'pending',
  decided_by uuid references auth.users (id),
  decided_at timestamptz,
  /** Obbligatorio quando si rifiuta: è ciò che l'utente legge. */
  decision_reason text check (decision_reason is null or length(decision_reason) <= 500),
  created_at timestamptz not null default now(),

  -- Una decisione senza autore e senza data non è tracciabile.
  constraint withdrawals_decision_complete check (
    (status = 'pending' and decided_by is null and decided_at is null)
    or (status = 'cancelled')
    or (status in ('approved', 'rejected') and decided_by is not null and decided_at is not null)
  ),
  -- Un rifiuto senza motivo lascerebbe l'utente senza sapere cosa fare.
  constraint withdrawals_rejection_has_reason check (
    status <> 'rejected' or length(btrim(coalesce(decision_reason, ''))) > 0
  )
);

create index if not exists withdrawals_user_created_idx
  on public.withdrawals (user_id, created_at desc);

-- Coda dell'amministratore: le richieste da evadere, prima le più vecchie.
create index if not exists withdrawals_pending_idx
  on public.withdrawals (created_at) where status = 'pending';

-- ─────────────────────────── Permessi ───────────────────────────

alter table public.withdrawals enable row level security;

-- Nessuna scrittura diretta: si passa solo dalle funzioni più sotto, che
-- verificano chi chiama e muovono il saldo nella stessa transazione.
revoke all on public.withdrawals from anon, authenticated;
grant select on public.withdrawals to authenticated;

drop policy if exists withdrawals_select_own on public.withdrawals;
create policy withdrawals_select_own on public.withdrawals
  for select using (user_id = auth.uid());

drop policy if exists withdrawals_select_admin on public.withdrawals;
create policy withdrawals_select_admin on public.withdrawals
  for select using (public.is_admin());

-- ──────────────────── Richiesta ────────────────────

/**
 * Apre una richiesta di prelievo e trattiene subito l'importo.
 *
 * `for update` sulla riga del profilo serializza le richieste concorrenti:
 * senza, due invii simultanei leggerebbero lo stesso saldo e passerebbero
 * entrambi i controlli, addebitando il doppio di quanto disponibile.
 */
create or replace function public.request_withdrawal(
  amount_cents bigint,
  destination text,
  user_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller uuid := auth.uid();
  clean_destination text := btrim(coalesce(destination, ''));
  clean_note text := nullif(btrim(coalesce(user_note, '')), '');
  available bigint;
  new_balance bigint;
  pending_count int;
  withdrawal_id uuid;
begin
  if caller is null then
    raise exception 'non autorizzato' using errcode = '42501';
  end if;

  if amount_cents is null or amount_cents <= 0 then
    raise exception 'importo non valido' using errcode = '22023';
  end if;

  -- Un miliardo di euro: limite di sanità contro gli errori di battitura.
  if amount_cents > 100000000000 then
    raise exception 'importo fuori scala' using errcode = '22003';
  end if;

  if clean_destination = '' or length(clean_destination) > 200 then
    raise exception 'destinazione obbligatoria' using errcode = '22023';
  end if;

  if clean_note is not null and length(clean_note) > 500 then
    raise exception 'nota troppo lunga' using errcode = '22023';
  end if;

  -- Una coda infinita di richieste non è utile a nessuno, né a chi le evade.
  select count(*) into pending_count
    from public.withdrawals
   where user_id = caller and status = 'pending';

  if pending_count >= 5 then
    raise exception 'troppe richieste in attesa' using errcode = '54000';
  end if;

  select p.balance_cents into available
    from public.profiles p
   where p.id = caller
     for update;

  if available is null then
    raise exception 'utente inesistente' using errcode = 'P0002';
  end if;

  if available < amount_cents then
    raise exception 'fondi insufficienti' using errcode = '23514';
  end if;

  update public.profiles
     set balance_cents = balance_cents - amount_cents
   where id = caller
  returning balance_cents into new_balance;

  insert into public.withdrawals (user_id, amount_cents, destination, note)
  values (caller, amount_cents, clean_destination, clean_note)
  returning id into withdrawal_id;

  insert into public.ledger_entries (user_id, amount_cents, balance_after_cents, reason, created_by)
  values (caller, -amount_cents, new_balance, 'Richiesta di prelievo in attesa di approvazione', caller);

  return withdrawal_id;
end;
$$;

-- ──────────────────── Decisione dell'amministratore ────────────────────

/**
 * Approva o rifiuta una richiesta.
 *
 * Approvare non tocca il saldo: il denaro è già stato trattenuto alla
 * richiesta. Rifiutare lo restituisce, con un movimento di segno opposto che
 * cita il motivo.
 *
 * `for update` sulla richiesta impedisce la doppia decisione: due schede
 * aperte sulla stessa riga si mettono in fila, e la seconda trova uno stato
 * che non è più 'pending' e viene respinta.
 */
create or replace function public.admin_decide_withdrawal(
  withdrawal_id uuid,
  approve boolean,
  decision text default null
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  clean_decision text := nullif(btrim(coalesce(decision, '')), '');
  target public.withdrawals%rowtype;
  new_balance bigint;
  final_status public.withdrawal_status;
begin
  if not public.is_admin() then
    raise exception 'non autorizzato' using errcode = '42501';
  end if;

  if clean_decision is not null and length(clean_decision) > 500 then
    raise exception 'motivo troppo lungo' using errcode = '22023';
  end if;

  -- Un rifiuto senza motivo lascerebbe l'utente senza sapere cosa allegare.
  if not approve and clean_decision is null then
    raise exception 'motivo obbligatorio per il rifiuto' using errcode = '22023';
  end if;

  select * into target
    from public.withdrawals
   where id = withdrawal_id
     for update;

  if not found then
    raise exception 'richiesta inesistente' using errcode = 'P0002';
  end if;

  if target.status <> 'pending' then
    raise exception 'richiesta già evasa' using errcode = '55000';
  end if;

  final_status := case when approve then 'approved' else 'rejected' end;

  update public.withdrawals
     set status = final_status,
         decided_by = auth.uid(),
         decided_at = now(),
         decision_reason = clean_decision
   where id = withdrawal_id;

  if not approve then
    update public.profiles
       set balance_cents = balance_cents + target.amount_cents
     where id = target.user_id
    returning balance_cents into new_balance;

    insert into public.ledger_entries (user_id, amount_cents, balance_after_cents, reason, created_by)
    values (
      target.user_id,
      target.amount_cents,
      new_balance,
      'Prelievo rifiutato: ' || clean_decision,
      auth.uid()
    );
  end if;

  return final_status::text;
end;
$$;

-- ──────────────────── Ripensamento dell'utente ────────────────────

/**
 * Annulla una propria richiesta ancora in attesa e si riprende il denaro.
 *
 * Senza questa via d'uscita un importo sbagliato resterebbe bloccato finché
 * qualcuno non se ne occupa. Vale solo sulle proprie richieste: il filtro su
 * user_id è dentro la query, non solo nella policy.
 */
create or replace function public.cancel_withdrawal(withdrawal_id uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller uuid := auth.uid();
  target public.withdrawals%rowtype;
  new_balance bigint;
begin
  if caller is null then
    raise exception 'non autorizzato' using errcode = '42501';
  end if;

  select * into target
    from public.withdrawals
   where id = withdrawal_id and user_id = caller
     for update;

  if not found then
    raise exception 'richiesta inesistente' using errcode = 'P0002';
  end if;

  if target.status <> 'pending' then
    raise exception 'richiesta già evasa' using errcode = '55000';
  end if;

  update public.withdrawals
     set status = 'cancelled', decided_at = now()
   where id = withdrawal_id;

  update public.profiles
     set balance_cents = balance_cents + target.amount_cents
   where id = caller
  returning balance_cents into new_balance;

  insert into public.ledger_entries (user_id, amount_cents, balance_after_cents, reason, created_by)
  values (caller, target.amount_cents, new_balance, 'Richiesta di prelievo annullata', caller);

  return 'cancelled';
end;
$$;

revoke all on function public.request_withdrawal(bigint, text, text) from public, anon;
revoke all on function public.admin_decide_withdrawal(uuid, boolean, text) from public, anon;
revoke all on function public.cancel_withdrawal(uuid) from public, anon;
grant execute on function public.request_withdrawal(bigint, text, text) to authenticated;
grant execute on function public.admin_decide_withdrawal(uuid, boolean, text) to authenticated;
grant execute on function public.cancel_withdrawal(uuid) to authenticated;
