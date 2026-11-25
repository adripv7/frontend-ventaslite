import type { DashboardReport, ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

export function BranchCategoryMatrix({ matrix, filters, onShowAllBranches }: { matrix: DashboardReport['branch_category_matrix']; filters: ReportFilters; onShowAllBranches: () => void }) {
  return (
    <section className="report-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Ventas por sucursal y categoría</h2>
          <p className="mt-1 text-xs text-slate-500">Importes netos antes de IVA · tabla desplazable</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.branch_id !== '' && <button className="report-outline-button" onClick={onShowAllBranches} type="button">Ver todas las sucursales</button>}
          <CsvExportButton filters={filters} section="branch_category_matrix" label="Exportar matriz CSV" />
        </div>
      </div>
      {matrix.branches.length === 0 ? (
        <div className="empty-report-state mt-5">No hay sucursales para mostrar.</div>
      ) : (
        <div className="matrix-scroll mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="matrix-sticky">Sucursal / Plaza</th>
                {matrix.categories.map((category) => <th key={category.id}>{category.name}</th>)}
                <th className="text-right">Total sucursal</th>
              </tr>
            </thead>
            <tbody>
              {matrix.branches.map((branch) => (
                <tr key={branch.branch.id}>
                  <th className="matrix-sticky text-left">
                    <span className="block font-semibold text-slate-800">{branch.branch.name}</span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-400">{branch.branch.city}</span>
                  </th>
                  {branch.categories.map((category) => <td key={category.id}>{formatMoney(category.amount)}</td>)}
                  <td className="text-right font-bold text-indigo-700">{formatMoney(branch.total)}</td>
                </tr>
              ))}
              <tr className="matrix-total-row">
                <th className="matrix-sticky text-left">Total por categoría</th>
                {matrix.categories.map((category) => <td key={category.id}>{formatMoney(category.total)}</td>)}
                <td className="text-right text-emerald-700">{formatMoney(matrix.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
