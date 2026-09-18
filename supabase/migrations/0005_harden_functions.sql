-- ============================================================================
-- Due strette di sicurezza segnalate dal linter di Supabase.
--
-- Da eseguire una volta sola in Supabase → SQL Editor → New query → Run,
-- DOPO 0004_satoshi_balances.sql. Non tocca alcun dato.
-- ============================================================================

do $$
begin
  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'profiles' and column_name = 'balance_sats'
  ) then
    raise exception 'Manca un passaggio precedente: esegui prima 0004_satoshi_balances.sql (e le precedenti). Esegui STATO.sql per l''elenco completo, in ordine.'
      using errcode = '55000';
  end if;
end
$$;

-- ─────────────── search_path fissato ───────────────
/*
 * Queste due erano le uniche funzioni del progetto senza `set search_path`.
 * Tutte le altre ce l'hanno fin dalla prima migrazione, per il motivo che
 * quella spiegava: senza, uno schema creato ad arte e messo davanti nel
 * percorso di ricerca può far risolvere `round` a qualcosa che non è `round`.
 *
 * Non sono security definer, quindi il danno possibile era limitato ai
 * privilegi di chi chiama — ma sono le funzioni che convertono denaro, e non
 * c'è motivo di lasciarle diverse dalle altre.
 */
create or replace function public.check_btc_rate(rate_eur_cents bigint)
returns void
language plpgsql
immutable
set search_path = pg_catalog, pg_temp
as $$
begin
  if rate_eur_cents is null or rate_eur_cents < 100000 or rate_eur_cents > 100000000 then
    raise exception 'tasso non plausibile' using errcode = '22003';
  end if;
end;
$$;

create or replace function public.eur_cents_to_sats(amount_cents bigint, rate_eur_cents bigint)
returns bigint
language sql
immutable
set search_path = pg_catalog, pg_temp
as $$
  select round(amount_cents::numeric * 100000000 / rate_eur_cents::numeric)::bigint;
$$;

-- ─────────────── handle_new_user non è una API ───────────────
/*
 * È la funzione del trigger che crea il profilo alla registrazione, e finiva
 * esposta come /rest/v1/rpc/handle_new_user. Chiamarla da lì falliva già da
 * sé — «trigger functions can only be called as triggers» — quindi non era
 * sfruttabile, ma non ha alcuna ragione di essere raggiungibile.
 *
 * Il trigger continua a funzionare: si attiva come parte dell'inserimento in
 * auth.users, non attraverso un permesso di chi registra l'utente.
 */
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ─────────────── is_admin() resta com'è, di proposito ───────────────
/*
 * Il linter segnala anche `is_admin()` come eseguibile da chi ha effettuato
 * l'accesso, e la tentazione è revocarla. NON va fatto: la funzione è chiamata
 * DENTRO le policy RLS di profiles, ledger_entries e withdrawals, e chi
 * interroga quelle tabelle deve poterla eseguire. Revocandola, ogni lettura
 * risponde «permission denied for function is_admin» e l'area riservata
 * smette di funzionare — verificato.
 *
 * L'esposizione in sé non dice nulla: per chi non è amministratore la
 * funzione restituisce false, che è esattamente ciò che il chiamante già sa
 * di sé. Le altre funzioni security definer segnalate (request_withdrawal,
 * cancel_withdrawal, admin_*) sono l'interfaccia prevista dell'applicazione,
 * e ognuna verifica da sé chi la sta chiamando.
 */
