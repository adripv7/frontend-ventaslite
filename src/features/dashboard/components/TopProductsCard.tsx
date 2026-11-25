import { useState } from 'react';
import type { DashboardReport } from '../types';
import type { ReportProduct, ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

type Mode = 'amount' | 'units';

export function TopProductsCard({ products, filters }: { products: DashboardReport['top_products']; filters: ReportFilters }) {
  const [mode, setMode] = useState<Mode>('amount');
  const rows: ReportProduct[] = products[mode === 'amount' ? 'by_amount' : 'by_units'];

  return (
    <section className="report-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Top 10 productos</h2>
          <p className="mt-1 text-xs text-slate-500">Ordenados por {mode === 'amount' ? 'importe neto' : 'unidades vendidas'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="segmented-control" aria-label="Métrica para ordenar productos">
            <button aria-pressed={mode === 'amount'} onClick={() => setMode('amount')} type="button">Importe</button>
            <button aria-pressed={mode === 'units'} onClick={() => setMode('units')} type="button">Unidades</button>
          </div>
          <CsvExportButton filters={filters} section="top_products" topProductsBy={mode} label="CSV" />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-report-state mt-5">No hay productos vendidos en este periodo.</div>
      ) : (
        <ol className="mt-4 divide-y divide-slate-100">
          {rows.map((product, index) => (
            <li className="flex items-center gap-3 py-3" key={product.id}>
              <span className={`rank-badge ${index < 3 ? 'rank-badge-top' : ''}`}>{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700">{product.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{product.sku} · {product.units.toLocaleString('es-MX')} uds</p>
              </div>
              <strong className="whitespace-nowrap text-sm text-slate-900">
                {mode === 'amount' ? formatMoney(product.amount) : `${product.units.toLocaleString('es-MX')} uds`}
              </strong>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-2 text-[11px] text-slate-400">Importes de productos antes de IVA.</p>
    </section>
  );
}
