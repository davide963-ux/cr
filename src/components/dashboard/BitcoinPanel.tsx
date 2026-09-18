import { Icon } from "@/components/icons/Icon";
import { TradingViewCredit, TradingViewWidget } from "@/components/ui/TradingViewWidget";
import { FEATURED_ASSET } from "@/data/assets";
import { dashboardHome } from "@/data/content";

/**
 * Prezzo e andamento del bitcoin.
 *
 * Il grafico è il widget TradingView già usato in homepage: i dati arrivano
 * dal browser del visitatore, quindi nessuna chiave e nessun limite di
 * richieste, e le cifre sono quelle del mercato, non nostre.
 */
export function BitcoinPanel() {
  return (
    <section className="panel overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-card)] bg-mint/10 text-mint">
            <Icon name="chart" size={19} />
          </span>
          <div>
            <h2 className="font-wide font-semibold leading-tight text-paper">{dashboardHome.btcPanelTitle}</h2>
            <p className="text-sm text-mist">{dashboardHome.btcPanelSubtitle}</p>
          </div>
        </div>
        <TradingViewCredit />
      </header>

      <TradingViewWidget
        widget="symbol-overview"
        className="h-[340px] w-full p-2 sm:h-[380px] sm:p-4"
        config={{
          symbols: [[FEATURED_ASSET.name, `${FEATURED_ASSET.tvSymbol}|1D`]],
          chartOnly: false,
          locale: "it",
          colorTheme: "dark",
          isTransparent: true,
          autosize: true,
          showVolume: false,
          showMA: false,
          hideDateRanges: false,
          hideMarketStatus: false,
          hideSymbolLogo: false,
          scalePosition: "right",
          scaleMode: "Normal",
          fontFamily: "inherit",
          fontSize: "12",
          chartType: "area",
          lineWidth: 2,
          gridLineColor: "rgba(255, 255, 255, 0.06)",
        }}
      />
    </section>
  );
}
