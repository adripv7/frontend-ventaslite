import { Ban, Eye } from 'lucide-react';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import type { SaleSummary } from '../types';

interface Props {
  sales: SaleSummary[];
  loading: boolean;
  canCancel: boolean;
  onView: (saleId: number) => void;
  onCancel: (sale: SaleSummary) => void;
}

export function SalesHistoryTable({ sales, loading, canCancel, onView, onCancel }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="history-table min-w-[900px]">
        <thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Sucursal</th><th>Vendedor</th><th className="text-right">Total</th><th>Estatus</th><th className="text-right">Acciones</th></tr></thead>
        <tbody>
          {loading ? Array.from({ length: 5 }, (_, row) => <tr aria-label="Cargando venta" className="animate-pulse" key={`skeleton-${row}`}>{Array.from({ length: 8 }, (_, col) => <td key={col}><span className="block h-4 rounded bg-slate-100" style={{ width: `${55 + ((row + col) % 4) * 10}%` }} /></td>)}</tr>) : sales.length === 0 ? <tr><td colSpan={8} className="py-12 text-center text-slate-500">No hay ventas que coincidan con los filtros.</td></tr> : sales.map((sale) => (
            <tr key={sale.id}><td className="font-semibold text-indigo-600">{sale.folio}</td><td>{formatDate(sale.sold_at)}</td><td className="font-medium text-slate-800">{sale.customer_name || 'Público en General'}</td><td>{sale.branch.name}</td><td>{sale.seller.name}</td><td className="text-right font-bold text-slate-900">{formatMoney(sale.total)}</td><td><span className={`status-pill ${sale.status === 'pagada' ? 'status-paid' : 'status-cancelled'}`}>{sale.status}</span></td><td><div className="flex justify-end gap-1"><button aria-label={`Ver venta ${sale.folio}`} className="history-action" onClick={() => onView(sale.id)} type="button"><Eye size={17} /></button>{canCancel && sale.status === 'pagada' && <button aria-label={`Cancelar venta ${sale.folio}`} className="history-action history-action-danger" onClick={() => onCancel(sale)} type="button"><Ban size={16} /></button>}</div></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
