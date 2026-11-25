import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, ReceiptText, TicketPercent, Wallet } from 'lucide-react';
import type { DashboardReport } from '../types';
import { formatMoney } from '../../../shared/utils/format';

export function SummaryCards({ summary }: { summary: DashboardReport['summary'] }) {
  const change = summary.sales_change_percent;
  const cards = [
    {
      label: 'Ventas totales',
      value: formatMoney(summary.sales_total),
      detail: 'Importe cobrado con IVA · sin canceladas',
      icon: Wallet,
      tone: 'indigo',
    },
    {
      label: 'Número de ventas',
      value: `${summary.transactions.toLocaleString('es-MX')} operaciones`,
      detail: 'Tickets pagados en el periodo',
      icon: BadgeDollarSign,
      tone: 'emerald',
    },
    {
      label: 'Ticket promedio',
      value: formatMoney(summary.average_ticket),
      detail: 'Promedio por operación pagada',
      icon: TicketPercent,
      tone: 'violet',
    },
    {
      label: 'Vs. periodo anterior',
      value: change === null ? 'Sin base de comparación' : `${change > 0 ? '+' : ''}${change.toLocaleString('es-MX')}%`,
      detail: change === null
        ? `Periodo previo: ${formatMoney(summary.previous_period.sales_total)}`
        : `${summary.previous_period.transactions.toLocaleString('es-MX')} operaciones en el periodo previo`,
      icon: change !== null && change < 0 ? ArrowDownRight : ArrowUpRight,
      tone: change !== null && change < 0 ? 'rose' : 'emerald',
      valueClass: change !== null && change < 0 ? 'text-rose-600' : 'text-emerald-600',
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
      {cards.map(({ label, value, detail, icon: Icon, tone, valueClass }) => (
        <article className="report-card p-5" key={label}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <span className={`metric-icon metric-icon-${tone}`}><Icon aria-hidden="true" size={19} /></span>
          </div>
          <p className={`mt-4 break-words text-xl font-bold tracking-tight text-slate-900 ${valueClass ?? ''}`}>{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
        </article>
      ))}
    </section>
  );
}
