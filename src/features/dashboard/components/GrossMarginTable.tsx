import type { DashboardReport, ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

export function GrossMarginTable({ rows, filters }: { rows: DashboardReport['gross_margin_by_category']; filters: ReportFilters }) {
  return (
    <section className="report-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Margen y utilidad bruta por categoría</h2>
          <p className="mt-1 text-xs text-slate-500">Utilidad = (precio de venta − costo histórico) × unidades</p>
        </div>
        <CsvExportButton filters={filters} section="gross_margin_by_category" label="Exportar margen CSV" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="report-table min-w-[760px]">
          <thead><tr><th>Categoría</th><th className="text-right">Unidades</th><th className="text-right">Ingresos netos</th><th className="text-right">Costo mercancía</th><th className="text-right">Utilidad bruta</th><th className="text-right">Margen</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.category.id}>
                <td className="font-semibold text-slate-700">{row.category.name}</td>
                <td className="text-right">{row.units.toLocaleString('es-MX')}</td>
                <td className="text-right">{formatMoney(row.revenue)}</td>
                <td className="text-right text-slate-500">{formatMoney(row.cost)}</td>
                <td className="text-right font-bold text-emerald-700">{formatMoney(row.gross_profit)}</td>
                <td className="text-right"><span className="margin-pill">{row.margin_percent.toLocaleString('es-MX', { maximumFractionDigits: 1 })}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
