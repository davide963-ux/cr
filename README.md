# Piattaforma Crypto — Homepage (v0.1)

Homepage in italiano per una piattaforma crypto/fintech.
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4.

> ⚠️ **Versione dimostrativa.** Prezzi, statistiche e recensioni sono dati di esempio,
> etichettati come tali nell'interfaccia. Vanno sostituiti con dati verificati prima della pubblicazione.

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
    ENV[".env.local (solo server)"] --> SVC
    subgraph Server["Solo server — import 'server-only'"]
        SVC["marketDataService.getMarketSnapshot()<br/>React cache(): una fetch per richiesta"]
        SVC -->|MARKET_DATA_PROVIDER=mock| MOCK["mockProvider"]
        SVC -->|MARKET_DATA_PROVIDER=http| HTTP["httpProvider (template)"]
        REV["reviewsService"]
        STA["statsService"]
    end
    SVC -->|"MarketResult ok / error"| BLK["FeaturedMarket / MarketBoard<br/>(Server Components async)"]
    BLK -->|ok| UI["BitcoinCard / CryptoMarketGrid"]
    BLK -->|error| ERR["MarketError"]
    PAGE["app/page.tsx"] -->|Suspense| SK["MarketSkeleton"]
    PAGE --> BLK
    SVC --> API["GET /api/market"]
```

La UI dipende solo dai tipi in `src/services/market/types.ts`, mai dai dati mock.

### Rendering della pagina

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next (build / ISR)
    participant S as marketDataService
    N->>S: getMarketSnapshot()
    S-->>N: { featured, assets, isDemo }
    N->>B: HTML statico (prezzi e grafici SVG già disegnati)
    B->>B: Idratazione delle sole parti client:<br/>Navbar, Reveal, AnimatedCounter
    B->>B: IntersectionObserver → animazione contatori<br/>(textContent via rAF, nessun re-render)
```

## Collegare un provider di mercato reale

```mermaid
flowchart LR
    A["Scegliere il provider"] --> B["Adattare normalizeAsset()<br/>in httpProvider.ts"]
    B --> C["Allineare providerId<br/>in data/assets.ts"]
    C --> D["MARKET_DATA_PROVIDER=http<br/>+ URL e API key"]
    D --> E["siteConfig.demoMode = false<br/>quando TUTTI i dati sono verificati"]
```

- La chiave API resta sul server (niente prefisso `NEXT_PUBLIC_`).
- `MARKET_DATA_REVALIDATE_SECONDS` controlla la cache (ISR).
- Per aggiornamenti lato client: interrogare `/api/market` (polling o SWR), mai il provider direttamente.
- Se il provider fallisce, la pagina mostra uno stato d'errore (testato con `MARKET_DATA_PROVIDER=http` senza URL).

## Dove modificare i contenuti

| Cosa | File |
| --- | --- |
| Nome azienda, URL, modalità demo | `src/data/site.ts` |
| Testi di tutte le sezioni, disclaimer | `src/data/content.ts` |
| Menu e footer, pagine segnaposto | `src/data/navigation.ts` |
| Asset in homepage | `src/data/assets.ts` |
| Quotazioni demo | `src/data/market.mock.ts` |
| Blockchain (il diagramma si adatta da solo) | `src/data/chains.ts` |
| Funzionalità, passaggi | `src/data/features.ts`, `src/data/steps.ts` |
| Statistiche (`isDemo`, `source`) | `src/data/stats.mock.ts` |
| Recensioni | `src/data/reviews.mock.ts` → `src/services/content/reviewsService.ts` |

## Punti da verificare prima dell'audit

1. **"Tasso di successo comprovato."** (`content.ts`): "comprovato" afferma una prova. La metrica si mostra solo se `verifiedMetric` include una fonte.
2. **"Regolamento rapido"** (`features.ts`): sostituisce "istantaneo" finché non è tecnicamente verificato.
3. **Statistiche e recensioni**: tutte marcate come dimostrative, tranne "Blockchain supportate" (derivata dalla configurazione).
4. **Indicizzazione**: con `demoMode: true` il sito è `noindex` e `robots.txt` blocca tutto.
5. **Autenticazione**: `/accedi` e `/registrati` sono pagine informative, senza form finti. Integrare un sistema reale lato server (sessioni sicure, cookie httpOnly).
6. **Testi legali e disclaimer**: segnaposto da far redigere al consulente legale (quadro MiCA / autorità italiane).
7. **Sicurezza**: header di base in `next.config.ts`. Aggiungere una Content-Security-Policy con nonce quando verranno integrati servizi esterni.
8. **Loghi di crypto e chain**: sono monogrammi neutri. Per i loghi ufficiali servono asset con licenza.

## Scelte tecniche

- **Grafici**: SVG puro renderizzato sul server, nessuna libreria di charting, zero JS nel client.
- **Serie mock**: PRNG deterministico, quindi server e client producono lo stesso output (nessun hydration mismatch).
- **Contatori**: il server rende il valore finale (SEO e no-JS); il client anima via `requestAnimationFrame` scrivendo `textContent`.
- **Animazioni**: rispettano `prefers-reduced-motion`. I reveal nascondono il contenuto solo se JS è attivo (`@media (scripting: enabled)`).
- **Font**: Mona Sans Variable auto-ospitato via npm, nessuna richiesta a Google Fonts.
- **Dipendenze runtime**: `next`, `react`, `react-dom`, `@fontsource-variable/mona-sans`, `server-only`.
