import type { DashboardReport, ReportFilters } from '../types';
import { formatMoney } from '../../../shared/utils/format';
import { CsvExportButton } from './CsvExportButton';

const WIDTH = 900;
const HEIGHT = 290;
const PAD = { top: 18, right: 20, bottom: 42, left: 76 };

function compactCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', notation: 'compact', maximumFractionDigits: 0,
  }).format(value);
}

export function SalesByMonthChart({ data, filters }: { data: DashboardReport['sales_by_month']; filters: ReportFilters }) {
  const values = data.map((row) => Number(row.sales_total));
  const max = Math.max(...values, 1);
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  const points = data.map((row, index) => {
    const x = PAD.left + (data.length <= 1 ? innerWidth / 2 : (innerWidth * index) / (data.length - 1));
    const y = PAD.top + innerHeight - (Number(row.sales_total) / max) * innerHeight;
    return { x, y, row };
  });
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${path} L ${points.at(-1)?.x ?? PAD.left} ${HEIGHT - PAD.bottom} L ${points[0]?.x ?? PAD.left} ${HEIGHT - PAD.bottom} Z`;

  return (
    <section className="report-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Ventas por mes</h2>
          <p className="mt-1 text-xs text-slate-500">Importes con IVA · últimos 12 meses</p>
        </div>
        <CsvExportButton filters={filters} section="sales_by_month" label="Exportar CSV" />
      </div>

      {data.length === 0 ? (
        <div className="grid h-64 place-items-center text-sm text-slate-400">Sin datos para graficar.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <svg className="sales-chart min-w-[650px]" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Gráfica de ventas mensuales de los últimos doce meses">
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = PAD.top + innerHeight * fraction;
              const amount = max * (1 - fraction);
              return (
                <g key={fraction}>
                  <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} className="chart-grid-line" />
                  <text x={PAD.left - 10} y={y + 4} textAnchor="end" className="chart-axis-label">{compactCurrency(amount)}</text>
                </g>
              );
            })}
            <path d={area} className="chart-area" />
            <path d={path} className="chart-line" />
            {points.map(({ x, y, row }) => (
              <g key={row.period}>
                <circle cx={x} cy={y} r="5" className="chart-point"><title>{`${row.label}: ${formatMoney(row.sales_total)} · ${row.transactions} operaciones`}</title></circle>
                <text x={x} y={HEIGHT - 12} textAnchor="middle" className="chart-axis-label">{row.label}</text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
