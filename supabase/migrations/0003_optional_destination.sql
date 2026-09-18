-- ============================================================================
-- La destinazione del prelievo diventa facoltativa.
--
-- Da eseguire una volta sola in Supabase → SQL Editor → New query → Run,
-- DOPO 0002_withdrawals.sql.
--
-- Chi ha un IBAN o un indirizzo può ancora indicarlo, e resta salvato come
-- prima; chi non ce l'ha sotto mano apre comunque la richiesta e lo concorda
-- con l'operatore. Le righe già esistenti non cambiano.
--
-- Conseguenza da tenere presente: una richiesta senza destinazione non dice
-- dove mandare il denaro. Il pannello lo scrive a chiare lettere, invece di
-- mostrare una riga vuota che sembra un dato perso.
-- ============================================================================

alter table public.withdrawals
  alter column destination drop not null;

-- Il vincolo esistente resta valido: un CHECK respinge solo ciò che è FALSE,
-- e `length(btrim(null))` vale NULL, quindi lascia passare. Viene comunque
-- riscritto per dire a voce alta che il valore assente è ammesso.
alter table public.withdrawals
  drop constraint if exists withdrawals_destination_check;

alter table public.withdrawals
  add constraint withdrawals_destination_check
  check (destination is null or length(btrim(destination)) between 1 and 200);

/**
 * Stessa funzione della 0002, con la destinazione facoltativa.
 *
 * Una stringa vuota viene salvata come NULL: così "non indicata" è un solo
 * valore nel database invece di due che significano la stessa cosa.
 */
create or replace function public.request_withdrawal(
  amount_cents bigint,
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

  -- La destinazione non è più obbligatoria, ma se c'è deve starci dentro.
  if clean_destination is not null and length(clean_destination) > 200 then
    raise exception 'destinazione troppo lunga' using errcode = '22023';
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

revoke all on function public.request_withdrawal(bigint, text, text) from public, anon;
grant execute on function public.request_withdrawal(bigint, text, text) to authenticated;
