import type { DashboardReport } from '../types';
import type { ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

export function SellerRankingCard({ ranking, filters }: { ranking: DashboardReport['seller_ranking']; filters: ReportFilters }) {
  return (
    <section className="report-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Ranking de vendedores</h2>
          <p className="mt-1 text-xs text-slate-500">Ventas cobradas, operaciones y ticket promedio</p>
        </div>
        <CsvExportButton filters={filters} section="seller_ranking" />
      </div>
      {ranking.length === 0 ? (
        <div className="empty-report-state mt-5">No hay vendedores con ventas en este periodo.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="report-table min-w-[620px]">
            <thead><tr><th>Vendedor</th><th className="text-right">Ventas</th><th className="text-right">Ticket prom.</th><th className="text-right">Total vendido</th></tr></thead>
            <tbody>
              {ranking.map((row) => (
                <tr key={`${row.seller.id}-${row.branch.id}`}>
                  <td>
                    <span className="font-semibold text-slate-700">{row.seller.name}</span>
                    <span className="ml-1.5 text-xs text-slate-400">({row.branch.city})</span>
                  </td>
                  <td className="text-right">{row.transactions.toLocaleString('es-MX')}</td>
                  <td className="text-right">{formatMoney(row.average_ticket)}</td>
                  <td className="text-right font-bold text-slate-900">{formatMoney(row.sales_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
