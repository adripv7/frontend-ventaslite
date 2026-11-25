import { useState } from 'react';
import type { DashboardReport, ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

const WIDTH = 900;
const HEIGHT = 310;
const PAD = { top: 20, right: 22, bottom: 48, left: 78 };
type Metric = 'sales' | 'transactions';

function compactCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function SalesByMonthChart({ data, filters }: { data: DashboardReport['sales_by_month']; filters: ReportFilters }) {
  const [metric, setMetric] = useState<Metric>('sales');
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const values = data.map((row) => metric === 'sales' ? Number(row.sales_total) : row.transactions);
  const max = Math.max(...values, 1);
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const points = data.map((row, index) => {
    const value = metric === 'sales' ? Number(row.sales_total) : row.transactions;
    const x = PAD.left + (data.length <= 1 ? innerWidth / 2 : (innerWidth * index) / (data.length - 1));
    const y = PAD.top + innerHeight - (value / max) * innerHeight;
    return { x, y, value, row };
  });
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = points.length ? `${path} L ${points.at(-1)!.x} ${HEIGHT - PAD.bottom} L ${points[0].x} ${HEIGHT - PAD.bottom} Z` : '';
  const selected = points[activePeriod ?? points.length - 1];

  return (
    <section className="report-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-base font-bold text-slate-800">Ventas por mes</h2><p className="mt-1 text-xs text-slate-500">{metric === 'sales' ? 'Importe cobrado con IVA · MXN' : 'Número de operaciones pagadas'} · últimos 12 meses</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="segmented-control" aria-label="Métrica de la gráfica">
            <button aria-pressed={metric === 'sales'} onClick={() => { setMetric('sales'); setActivePeriod(null); }} type="button">Ventas (MXN)</button>
            <button aria-pressed={metric === 'transactions'} onClick={() => { setMetric('transactions'); setActivePeriod(null); }} type="button">Operaciones</button>
          </div>
          <CsvExportButton filters={filters} section="sales_by_month" label="Exportar CSV" />
        </div>
      </div>

      {data.length === 0 ? <div className="empty-report-state h-64">No hay ventas para graficar en este periodo.</div> : (
        <>
          <div className="chart-selected-value" aria-live="polite">
            <span>{selected?.row.label ?? 'Selecciona un punto'}</span>
            <strong>{selected ? metric === 'sales' ? formatMoney(selected.row.sales_total) : `${selected.row.transactions.toLocaleString('es-MX')} operaciones` : ''}</strong>
          </div>
          <div className="w-full overflow-x-auto">
            <svg className="sales-chart min-w-[650px]" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={metric === 'sales' ? 'Ventas cobradas en MXN por mes' : 'Operaciones pagadas por mes'}>
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                const y = PAD.top + innerHeight * fraction;
                const amount = max * (1 - fraction);
                const label = metric === 'sales' ? compactCurrency(amount) : Math.round(amount).toLocaleString('es-MX');
                return <g key={fraction}><line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} className="chart-grid-line" /><text x={PAD.left - 10} y={y + 4} textAnchor="end" className="chart-axis-label">{label}</text></g>;
              })}
              <path d={area} className="chart-area" />
              <path d={path} className="chart-line" />
              {points.map(({ x, y, row }, index) => (
                <g key={row.period} className="chart-interactive-point" onMouseEnter={() => setActivePeriod(index)} onFocus={() => setActivePeriod(index)}>
                  <circle cx={x} cy={y} r={activePeriod === index ? 8 : 5} className={`chart-point ${activePeriod === index ? 'chart-point-active' : ''}`} tabIndex={0} aria-label={`${row.label}: ${formatMoney(row.sales_total)}, ${row.transactions} operaciones`}>
                    <title>{`${row.label}: ${formatMoney(row.sales_total)} · ${row.transactions} operaciones`}</title>
                  </circle>
                  <text x={x} y={HEIGHT - 13} textAnchor="middle" className="chart-axis-label">{row.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>Ventas incluyen IVA · datos de operaciones pagadas</span><span>Apunta o enfoca un punto para ver el dato exacto</span></div>
        </>
      )}
    </section>
  );
}
