import "server-only";
import { mockStats, type PlatformStat } from "@/data/stats.mock";

/** Punto d'integrazione per statistiche verificate (CMS, database, report). */
export async function getPlatformStats(): Promise<PlatformStat[]> {
  return mockStats;
}
