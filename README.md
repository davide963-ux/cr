# Piattaforma Crypto — Homepage (v0.1)

Homepage in italiano per una piattaforma crypto/fintech.
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4.

> ⚠️ **Versione dimostrativa.** Statistiche e recensioni sono dati di esempio, etichettati
> come tali nell'interfaccia. I **prezzi crypto sono reali e in tempo reale** (widget
> TradingView), vedi [Prezzi in tempo reale](#prezzi-crypto-in-tempo-reale). Il resto va
> sostituito con dati verificati prima della pubblicazione.

## Avvio

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

| Script | Cosa fa |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia la build |
| `npm run lint` | ESLint (config Next core-web-vitals + TypeScript) |
| `npm run typecheck` | Genera i tipi delle route e lancia `tsc --noEmit` |

Requisiti: Node.js 20.9 o superiore.

## Deploy su Vercel

1. Importare il repository su Vercel (framework rilevato automaticamente).
2. Impostare le variabili d'ambiente (vedi `.env.example`), almeno `NEXT_PUBLIC_SITE_URL`.
3. Deploy. Non serve configurazione aggiuntiva.

## Architettura

```mermaid
flowchart TD
    REG["data/assets.ts<br/>assetRegistry: symbol, name, tint, tvSymbol"]
    REG --> FM["FeaturedMarket → BitcoinCard"]
    REG --> MB["MarketBoard → CryptoMarketGrid"]
    FM --> TVW["TradingViewWidget (Client Component)"]
    MB --> TVW
    TVW -->|"script embed-widget-*.js"| TV[("TradingView<br/>quotazioni in tempo reale")]
    PAGE["app/page.tsx (statica)"] --> FM
    PAGE --> MB

    subgraph Server["Solo server — import 'server-only'"]
        SVC["marketDataService.getMarketSnapshot()"]
        SVC --> CG["coingeckoProvider"]
        SVC --> MOCK["mockProvider"]
        SVC --> HTTP["httpProvider (template)"]
        REV["reviewsService"]
        STA["statsService"]
    end
    SVC --> API["GET /api/market<br/>(endpoint disponibile, non usato dalla homepage)"]
```

I prezzi della homepage non passano più dal server: nessuna chiave API, nessun rate
limit, nessuna chiamata che possa fallire in produzione. Il layer
`src/services/market/` resta disponibile dietro `/api/market` per chi volesse tornare a
card disegnate in casa (vedi [Tornare alle card con dati propri](#tornare-alle-card-con-dati-propri)).

### Prezzi crypto in tempo reale

Le card (scheda BTC in evidenza e griglia asset) mostrano quotazioni **reali** servite
dai widget TradingView, che girano nel browser del visitatore:

1. **Un solo componente di embed.** `TradingViewWidget`
   (`src/components/ui/TradingViewWidget.tsx`) riceve il nome dell'embed e la config
   nel formato ufficiale TradingView. Lo `<script>` va creato via DOM e non reso da
   React (React non esegue gli script resi come figli, e l'embed legge la config dal
   contenuto testuale del proprio tag); il container resta vuoto lato React, così il
   cleanup lo svuota senza toccare nodi gestiti da React — necessario con
   `reactStrictMode`, che in sviluppo monta gli effetti due volte.
2. **Un simbolo per asset, in un posto solo.** `tvSymbol` in `src/data/assets.ts`
   (`BINANCE:BTCUSDT`, `BINANCE:ETHUSDT`, …). Cambiare exchange o coppia significa
   modificare quella riga e basta.
3. **Due widget.** Scheda in evidenza → `symbol-overview` (prezzo, variazione, grafico
   ad area). Ogni card della griglia → `mini-symbol-overview` (prezzo, variazione, mini
   grafico). La cornice del sito (pannello, monogrammi, tipografia, header di sezione)
   resta quella di prima: TradingView riempie solo la parte dati.

```mermaid
sequenceDiagram
    participant N as Next (build)
    participant B as Browser
    participant TV as TradingView

    N->>B: HTML statico (cornice, monogrammi, header)
    Note over N: nessuna chiamata di rete lato server
    B->>B: useEffect monta <script> embed-widget-*.js<br/>con la config dell'asset
    B->>TV: lo script richiede il widget
    TV-->>B: iframe con prezzo, variazione e grafico
    Note over B,TV: da qui in poi TradingView aggiorna<br/>le quotazioni da solo, in streaming
```

Cambiare widget o config = sostituire l'oggetto `config` passato a `TradingViewWidget`
con quello generato dal [widget builder di TradingView](https://www.tradingview.com/widget/).

### Tornare alle card con dati propri

Il layer `src/services/market/` (provider CoinGecko / mock / HTTP, tipi, endpoint
`/api/market`) è intatto e funzionante: serve se un giorno si vuole tornare a card
disegnate in casa, con capitalizzazione e volumi che i widget non espongono. In quel
caso i componenti presentazionali originali (`Sparkline`, `PriceChart`, `ChangeBadge`,
`MarketState`) sono ancora nel repo, e le variabili `MARKET_DATA_*` / `COINGECKO_API_KEY`
tornano rilevanti. Attenzione: sul piano gratuito senza chiave, CoinGecko rifiuta spesso
le richieste dagli IP dei datacenter (Vercel incluso) — con quel percorso serve una
chiave API.

### Rendering della pagina

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next (build / ISR)
    participant S as marketDataService
    N->>S: getMarketSnapshot()
    S-->>N: { featured, assets, isDemo }
    N->>B: HTML statico (cornice delle card, nessun prezzo dal server)
    B->>B: Idratazione delle sole parti client:<br/>Navbar, Reveal, AnimatedCounter, TradingViewWidget
    B->>B: IntersectionObserver → animazione contatori<br/>(textContent via rAF, nessun re-render)
    B->>B: I widget TradingView caricano le quotazioni<br/>(vedi "Prezzi crypto in tempo reale")
```

## Accesso e registrazione

Email e password tramite Supabase. La sessione vive in cookie httpOnly gestiti
da `@supabase/ssr`; la password viaggia solo in una Server Action e non passa
mai dal JavaScript del client.

```mermaid
sequenceDiagram
    participant U as Utente
    participant S as Server Action
    participant SB as Supabase

    U->>S: modulo email + password
    S->>S: validazione (email, lunghezza password)
    alt registrazione
        S->>SB: signUp()
        SB-->>S: sessione, oppure "conferma l'email"
    else accesso
        S->>SB: signInWithPassword()
        SB-->>S: sessione, oppure errore
    end
    S-->>U: cookie httpOnly → /dashboard
```

- **`src/proxy.ts`** — in Next 16 il vecchio `middleware` si chiama `proxy`.
  Rinnova i cookie di sessione a ogni richiesta e blocca `/dashboard` agli anonimi.
- **Doppia serratura**: oltre al proxy, `/dashboard` verifica la sessione lato
  server con `getUser()`, che valida il token contro Supabase invece di fidarsi
  del cookie.
- **Errore unico per le credenziali sbagliate** ("Email o password non corretti"):
  un messaggio diverso per "utente inesistente" direbbe a chiunque quali indirizzi
  sono registrati.
- **Dati raccolti alla registrazione** (nome, cognome, telefono, città) finiscono
  in `user_metadata` sull'utente Supabase: nessuna tabella da creare, si vedono
  in Authentication → Users e l'area riservata li rilegge da lì.
  ⚠️ `user_metadata` è modificabile dall'utente stesso via API: va bene per
  mostrare un nome, non per decisioni di sicurezza. Quando serviranno dati
  affidabili — o interrogabili in SQL — vanno spostati in una tabella `profiles`
  con RLS, popolata da un trigger su `auth.users`.
- **Conferma dell'email**: se è attiva su Supabase, dopo la registrazione non
  parte la sessione e compare l'avviso di controllare la posta; il link di
  conferma rientra da `/auth/callback`. Disattivandola (Authentication →
  Sign In / Providers → Email → *Confirm email*) l'accesso è immediato.
- **Senza le chiavi configurate** il sito funziona lo stesso: `/accedi` e
  `/registrati` mostrano un avviso al posto del modulo, e la build non si rompe.

> ⚠️ Soluzione provvisoria: mancano ancora recupero password, limitazione dei
> tentativi e requisiti di robustezza oltre agli 8 caratteri minimi.

Configurazione: vedi `.env.example`.

## Dove modificare i contenuti

**Quasi tutti i testi del sito stanno in un unico file: [`src/data/content.ts`](src/data/content.ts).**
Le sezioni sono nell'ordine in cui compaiono nella pagina, dall'alto verso il basso:
nome azienda, menu, hero, titoli di ogni sezione, funzionalità, passaggi, footer e
testo legale. Per cambiare una scritta basta modificare quello che sta fra virgolette.

Il resto sono elenchi di dati, tenuti separati:

| Cosa | File |
| --- | --- |
| **Tutti i testi, menu e footer** | **`src/data/content.ts`** |
| Asset in homepage, simboli TradingView (`tvSymbol`) | `src/data/assets.ts` |
| Config dei widget di quotazione | `BitcoinCard.tsx`, `CryptoMarketGrid.tsx` |
| Componente di embed TradingView | `src/components/ui/TradingViewWidget.tsx` |
| Quotazioni demo (solo per `/api/market` con `MARKET_DATA_PROVIDER=mock`) | `src/data/market.mock.ts` |
| Blockchain (il diagramma si adatta da solo) | `src/data/chains.ts` |
| Statistiche (`isDemo`, `source`) | `src/data/stats.mock.ts` |
| Recensioni | `src/data/reviews.mock.ts` → `src/services/content/reviewsService.ts` |

## Punti da verificare prima dell'audit

1. **"Tasso di successo comprovato."** (`content.ts`): "comprovato" afferma una prova. La metrica si mostra solo se `verifiedMetric` include una fonte.
2. **"Regolamento rapido"** (`features.ts`): sostituisce "istantaneo" finché non è tecnicamente verificato.
3. **Statistiche e recensioni**: tutte marcate come dimostrative, tranne "Blockchain supportate" (derivata dalla configurazione) e i **prezzi crypto** (reali, via TradingView).
   I termini d'uso dei widget richiedono l'attribuzione visibile a TradingView: è il link `TradingViewCredit`, da non rimuovere.
4. **Indicizzazione**: con `demoMode: true` il sito è `noindex` e `robots.txt` blocca tutto.
5. **Autenticazione**: email e password via Supabase, sessione in cookie httpOnly. Provvisoria: manca il recupero password. Vedi [Accesso e registrazione](#accesso-e-registrazione). Prima di aprire le registrazioni al pubblico servono privacy policy e termini reali (oggi sono segnaposto).
6. **Testi legali e disclaimer**: segnaposto da far redigere al consulente legale (quadro MiCA / autorità italiane).
7. **Sicurezza**: header di base in `next.config.ts`. Aggiungere una Content-Security-Policy con nonce quando verranno integrati servizi esterni.
8. **Loghi di crypto e chain**: sono monogrammi neutri. Per i loghi ufficiali servono asset con licenza.

## Scelte tecniche

- **Prezzi in tempo reale**: widget TradingView lato client — nessuna chiave API, nessun rate limit, nessuna chiamata dal server che possa fallire. Vedi [Prezzi crypto in tempo reale](#prezzi-crypto-in-tempo-reale).
- **Grafici**: i grafici delle quotazioni arrivano dai widget. Gli altri grafici del sito restano SVG puro renderizzato sul server, senza librerie di charting.
- **Contatori**: il server rende il valore finale (SEO e no-JS); il client anima via `requestAnimationFrame` scrivendo `textContent`.
- **Animazioni**: rispettano `prefers-reduced-motion`. I reveal nascondono il contenuto solo se JS è attivo (`@media (scripting: enabled)`).
- **Font**: Mona Sans Variable auto-ospitato via npm, nessuna richiesta a Google Fonts.
- **Dipendenze runtime**: `next`, `react`, `react-dom`, `@fontsource-variable/mona-sans`, `server-only`.
