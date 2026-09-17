import { documentsPage } from "@/data/content";
import { EmptyState } from "./Card";

/**
 * Documenti legati ai pagamenti.
 *
 * Non esistendo ancora pagamenti, l'elenco è vuoto: le colonne sono già
 * definite (ID pagamento, documento, data, stato, verifica) così la tabella
 * potrà essere riempita senza ridisegnarla.
 */
export function DocumentList() {
  const rows: never[] = [];

  if (rows.length === 0) {
    return <EmptyState message={documentsPage.paymentsEmpty} icon="document" />;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-line">
          {documentsPage.paymentsColumns.map((col) => (
            <th key={col} scope="col" className="pb-3 font-medium text-mist">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody />
    </table>
  );
}
