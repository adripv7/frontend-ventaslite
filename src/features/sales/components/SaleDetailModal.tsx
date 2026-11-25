import { X } from 'lucide-react';
import { formatDate, formatMoney } from '../../../shared/utils/format';
import type { SaleDetail } from '../types';

export function SaleDetailModal({ sale, onClose }: { sale: SaleDetail; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-labelledby="sale-detail-title" aria-modal="true" className="modal-card" role="dialog">
        <div className="flex items-start justify-between border-b border-slate-200 p-5"><div><h2 className="font-bold text-slate-900" id="sale-detail-title">Detalle de {sale.folio}</h2><p className="mt-1 text-xs text-slate-500">{formatDate(sale.sold_at)} · {sale.customer_name || 'Público en General'}</p></div><button aria-label="Cerrar detalle" className="history-action" onClick={onClose} type="button"><X size={18} /></button></div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3 text-sm"><p><span className="block text-xs text-slate-500">Sucursal</span>{sale.branch.name}</p><p><span className="block text-xs text-slate-500">Vendedor</span>{sale.seller.name}</p><p><span className="block text-xs text-slate-500">Pago</span>{sale.payment_method}</p><p><span className="block text-xs text-slate-500">Estatus</span>{sale.status}</p></div>
          <div className="overflow-x-auto"><table className="history-table min-w-[480px]"><thead><tr><th>Producto</th><th>Unidades</th><th>Precio</th><th>Total</th></tr></thead><tbody>{sale.items.map((item, index) => <tr key={`${item.product.id}-${index}`}><td><span className="block font-medium">{item.product.name}</span><span className="text-xs text-slate-400">{item.product.sku}</span></td><td>{item.quantity}</td><td>{formatMoney(item.unit_price)}</td><td>{formatMoney(item.line_total)}</td></tr>)}</tbody></table></div>
          <div className="ml-auto max-w-xs space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{formatMoney(sale.subtotal)}</span></p><p className="flex justify-between"><span>IVA</span><span>{formatMoney(sale.tax)}</span></p><p className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{formatMoney(sale.total)}</span></p></div>
          {sale.cancellation_reason && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Motivo de cancelación: {sale.cancellation_reason}</p>}
        </div>
      </section>
    </div>
  );
}
