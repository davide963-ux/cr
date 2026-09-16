import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/services/market/marketDataService";

/**
 * GET /api/market — proxy server-side per futuri aggiornamenti dal client
 * (polling / SWR). Le credenziali del provider restano sul server.
 */
export async function GET() {
  const result = await getMarketSnapshot();
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: 503 });
  }
  return NextResponse.json(result.data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
