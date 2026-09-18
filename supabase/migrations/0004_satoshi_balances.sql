-- ============================================================================
-- Il saldo passa da euro a satoshi.
--
-- Da eseguire una volta sola in Supabase → SQL Editor → New query → Run,
-- DOPO 0003_optional_destination.sql.
--
-- ⚠️  AZZERA saldi, registro e richieste di prelievo esistenti.
--
-- Perché
-- ------
-- Finora l'euro era il dato di verità e il bitcoin la visualizzazione: chi
-- aveva 200 € continuava ad avere 200 € qualunque cosa facesse il mercato.
-- Da qui in poi è l'opposto — il conto è in bitcoin, e l'importo in euro è
-- una moltiplicazione fatta al momento di mostrarlo. Se il prezzo sale del
-- 5%, il controvalore sale del 5% perché è la stessa quantità di bitcoin,
-- non perché qualcuno applica una percentuale da qualche parte.
--
-- I satoshi sono interi (1 BTC = 100.000.000 sat), quindi resta valida la
-- regola di sempre: il denaro non tocca mai un numero in virgola mobile.
--
-- Il tasso arriva dal browser
-- ---------------------------
-- Il server non può chiedere il prezzo a CoinGecko: rifiuta gli IP dei
-- datacenter, Vercel compreso. Lo manda quindi la pagina, che ce l'ha già.
-- Ma un tasso sbagliato è denaro sbagliato, quindi non viene creduto sulla
-- parola: le funzioni qui sotto lo rifiutano se è fuori scala, e i satoshi
-- li calcolano da sé invece di accettare la moltiplicazione di qualcun altro.
-- ============================================================================

-- ─────────────── Vecchie firme, da togliere ───────────────
-- Cambia il numero di parametri: senza il drop resterebbero affiancate alla
-- nuova, e PostgREST non saprebbe quale scegliere (PGRST203).
drop function if exists public.admin_adjust_balance(uuid, bigint, text);
drop function if exists public.request_withdrawal(bigint, text, text);

-- ─────────────── Colonne ───────────────

alter table public.profiles
  add column if not exists balance_sats bigint not null default 0;

alter table public.ledger_entries
  add column if not exists amount_sats bigint,
  add column if not exists balance_after_sats bigint,
  /** Prezzo di 1 BTC in centesimi di euro al momento del movimento. */
  add column if not exists rate_eur_cents bigint;

alter table public.withdrawals
  add column if not exists amount_sats bigint,
  add column if not exists requested_rate_eur_cents bigint;

-- ─────────────── Azzeramento ───────────────
-- Dati di prova: si riparte puliti invece di convertire con un tasso storico
-- che non abbiamo mai salvato e che sarebbe solo un'ipotesi.
truncate table public.withdrawals;
delete from public.ledger_entries;
update public.profiles set balance_sats = 0, balance_cents = 0;

-- Ora che sono vuote, le colonne in satoshi possono diventare obbligatorie.
alter table public.ledger_entries
  alter column amount_sats set not null,
  alter column balance_after_sats set not null,
  alter column amount_cents drop not null,
  alter column balance_after_cents drop not null;

alter table public.withdrawals
  alter column amount_sats set not null,
  alter column amount_cents drop not null;

alter table public.withdrawals
  drop constraint if exists withdrawals_amount_cents_check;

alter table public.withdrawals
  add constraint withdrawals_amount_sats_check check (amount_sats > 0);

-- ─────────────── Conversione, in un posto solo ───────────────

/**
 * Limiti di plausibilità del tasso, in centesimi di euro per bitcoin.
 *
 * Servono a fermare la classe di guasti che fa davvero danno: una risposta
 * malformata che vale 0, 1 o null. Con un tasso di 1 € un accredito di 200 €
 * diventerebbe venti miliardi di satoshi. Da 1.000 € a 1.000.000 € per
 * bitcoin c'è tutto lo spazio che serve al mercato; fuori di lì è un errore,
 * non un prezzo.
 */
create or replace function public.check_btc_rate(rate_eur_cents bigint)
returns void
language plpgsql
immutable
as $$
begin
  if rate_eur_cents is null or rate_eur_cents < 100000 or rate_eur_cents > 100000000 then
    raise exception 'tasso non plausibile' using errcode = '22003';
  end if;
end;
$$;

/**
 * Da centesimi di euro a satoshi, al tasso dato.
 *
 * Il passaggio per numeric non è pignoleria: centesimi × 100.000.000 supera
 * il bigint già sotto il miliardo di euro, e il risultato tornerebbe indietro
 * silenziosamente sbagliato.
 */
create or replace function public.eur_cents_to_sats(amount_cents bigint, rate_eur_cents bigint)
returns bigint
language sql
immutable
as $$
  select round(amount_cents::numeric * 100000000 / rate_eur_cents::numeric)::bigint;
$$;

-- ─────────────── Movimenti di saldo ───────────────

/**
 * Accredita o addebita. L'amministratore ragiona in euro, il conto vive in
 * satoshi: la conversione avviene QUI, con il tasso che la pagina ha appena
 * letto, e resta scritta nel registro insieme al movimento. Fra sei mesi si
 * potrà rileggere non solo quanto, ma a che prezzo.
 */
create or replace function public.admin_adjust_balance(
  target_user uuid,
  delta_cents bigint,
  rate_eur_cents bigint,
  adjust_reason text
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_balance bigint;
  delta_sats bigint;
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

  perform public.check_btc_rate(rate_eur_cents);
  delta_sats := public.eur_cents_to_sats(delta_cents, rate_eur_cents);

  -- Un importo così piccolo da sparire nell'arrotondamento non è un movimento.
  if delta_sats = 0 then
    raise exception 'importo non valido' using errcode = '22023';
  end if;

  update public.profiles
     set balance_sats = balance_sats + delta_sats
   where id = target_user
  returning balance_sats into new_balance;

  if new_balance is null then
    raise exception 'utente inesistente' using errcode = 'P0002';
  end if;

  -- L'intera funzione è una transazione: sollevare qui annulla l'update.
  if new_balance < 0 then
    raise exception 'il saldo non può diventare negativo' using errcode = '23514';
  end if;

  insert into public.ledger_entries
    (user_id, amount_sats, balance_after_sats, rate_eur_cents, reason, created_by)
  values (target_user, delta_sats, new_balance, rate_eur_cents, clean_reason, auth.uid());

  return new_balance;
end;
$$;

-- ─────────────── Richiesta di prelievo ───────────────

/**
 * Apre una richiesta e trattiene subito i satoshi.
 *
 * L'utente scrive un importo in euro, ma ciò che viene trattenuto — e ciò che
 * riceverà — è una quantità di bitcoin, fissata adesso. Se il prezzo sale fra
 * la richiesta e l'approvazione riceverà più euro di quelli scritti; se scende,
 * meno. È la conseguenza diretta di avere il conto in bitcoin, e il modulo lo
 * mostra prima dell'invio invece di lasciarlo scoprire dopo.
 *
 * `for update` sulla riga del profilo serializza le richieste concorrenti:
 * senza, due invii simultanei leggerebbero lo stesso saldo e passerebbero
 * entrambi i controlli, addebitando il doppio di quanto disponibile.
 */
create or replace function public.request_withdrawal(
  amount_cents bigint,
  rate_eur_cents bigint,
  destination text default null,
  user_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller uuid := auth.uid();
  clean_destination text := nullif(btrim(coalesce(destination, '')), '');
  clean_note text := nullif(btrim(coalesce(user_note, '')), '');
  amount_sats bigint;
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

  if amount_cents > 100000000000 then
    raise exception 'importo fuori scala' using errcode = '22003';
  end if;

  perform public.check_btc_rate(rate_eur_cents);
  amount_sats := public.eur_cents_to_sats(amount_cents, rate_eur_cents);

  if amount_sats <= 0 then
    raise exception 'importo non valido' using errcode = '22023';
  end if;

  if clean_destination is not null and length(clean_destination) > 200 then
    raise exception 'destinazione troppo lunga' using errcode = '22023';
  end if;

  if clean_note is not null and length(clean_note) > 500 then
    raise exception 'nota troppo lunga' using errcode = '22023';
  end if;

  select count(*) into pending_count
    from public.withdrawals
   where user_id = caller and status = 'pending';

  if pending_count >= 5 then
    raise exception 'troppe richieste in attesa' using errcode = '54000';
  end if;

  select p.balance_sats into available
    from public.profiles p
   where p.id = caller
     for update;

  if available is null then
    raise exception 'utente inesistente' using errcode = 'P0002';
  end if;

  if available < amount_sats then
    raise exception 'fondi insufficienti' using errcode = '23514';
  end if;

  update public.profiles
     set balance_sats = balance_sats - amount_sats
   where id = caller
  returning balance_sats into new_balance;

  insert into public.withdrawals
    (user_id, amount_sats, requested_rate_eur_cents, destination, note)
  values (caller, amount_sats, rate_eur_cents, clean_destination, clean_note)
  returning id into withdrawal_id;

  insert into public.ledger_entries
    (user_id, amount_sats, balance_after_sats, rate_eur_cents, reason, created_by)
  values (
    caller, -amount_sats, new_balance, rate_eur_cents,
    'Richiesta di prelievo in attesa di approvazione', caller
  );

  return withdrawal_id;
end;
$$;

-- ─────────────── Decisione e annullamento ───────────────

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

  -- Il rifiuto restituisce gli STESSI satoshi trattenuti, non il loro
  -- controvalore di oggi: l'utente ritrova il conto com'era.
  if not approve then
    update public.profiles
       set balance_sats = balance_sats + target.amount_sats
     where id = target.user_id
    returning balance_sats into new_balance;

    insert into public.ledger_entries
      (user_id, amount_sats, balance_after_sats, reason, created_by)
    values (
      target.user_id, target.amount_sats, new_balance,
      'Prelievo rifiutato: ' || clean_decision, auth.uid()
    );
  end if;

  return final_status::text;
end;
$$;

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
     set balance_sats = balance_sats + target.amount_sats
   where id = caller
  returning balance_sats into new_balance;

  insert into public.ledger_entries
    (user_id, amount_sats, balance_after_sats, reason, created_by)
  values (caller, target.amount_sats, new_balance, 'Richiesta di prelievo annullata', caller);

  return 'cancelled';
end;
$$;

-- ─────────────── Permessi ───────────────

revoke all on function public.admin_adjust_balance(uuid, bigint, bigint, text) from public, anon;
revoke all on function public.request_withdrawal(bigint, bigint, text, text) from public, anon;
revoke all on function public.admin_decide_withdrawal(uuid, boolean, text) from public, anon;
revoke all on function public.cancel_withdrawal(uuid) from public, anon;
grant execute on function public.admin_adjust_balance(uuid, bigint, bigint, text) to authenticated;
grant execute on function public.request_withdrawal(bigint, bigint, text, text) to authenticated;
grant execute on function public.admin_decide_withdrawal(uuid, boolean, text) to authenticated;
grant execute on function public.cancel_withdrawal(uuid) to authenticated;
