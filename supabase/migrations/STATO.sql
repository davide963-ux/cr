-- ============================================================================
-- Quali migrazioni mancano.
--
-- Da incollare nell'SQL Editor di Supabase PRIMA di eseguire qualunque altra
-- cosa. Non modifica nulla: guarda soltanto com'è fatto il database e dice
-- quali file servono ancora.
-- ============================================================================

select
  m.file,
  case when m.applicata then 'già fatta' else '➜ DA ESEGUIRE' end as stato
from (
  values
    (1, '0001_profiles_and_ledger.sql', to_regclass('public.profiles') is not null),

    (2, '0002_withdrawals.sql',         to_regclass('public.withdrawals') is not null),

    -- La 0003 rende facoltativa la destinazione: si riconosce dal fatto che
    -- la colonna ha smesso di essere obbligatoria.
    (3, '0003_optional_destination.sql',
        exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'withdrawals'
                   and column_name = 'destination' and is_nullable = 'YES')),

    -- La 0004 porta il saldo in satoshi: si riconosce dalla nuova colonna.
    (4, '0004_satoshi_balances.sql',
        exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'profiles'
                   and column_name = 'balance_sats'))
) as m(ordine, file, applicata)
order by m.ordine;
