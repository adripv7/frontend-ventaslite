import { Minus, Package, Plus, Trash2 } from 'lucide-react';
import type { CartLine, PaymentMethod } from '../../sales/types';
import { formatMoney } from '../../../shared/utils/format';

interface Props {
  cart: CartLine[];
  customer: string;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  submitting: boolean;
  onCustomerChange: (value: string) => void;
  onPaymentChange: (value: PaymentMethod) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onSubmit: () => void;
}

function moneyFromCents(cents: number): string {
  return formatMoney(cents / 100);
}

export function SaleCartPanel({
  cart, customer, paymentMethod, subtotalCents, taxCents, totalCents, submitting,
  onCustomerChange, onPaymentChange, onQuantityChange, onRemove, onSubmit,
}: Props) {
  return (
    <aside className="sale-cart-panel">
      <div className="border-b border-slate-200 px-4 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800"><Package className="text-indigo-600" size={18} /> Ticket de venta actual</h2>
      </div>

      <div className="space-y-4 border-b border-slate-200 p-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="sale-customer">Cliente</label>
          <input className="field-control" id="sale-customer" maxLength={180} onChange={(event) => onCustomerChange(event.target.value)} placeholder="Público en General" value={customer} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="sale-payment">Método de pago</label>
          <select className="field-control" id="sale-payment" onChange={(event) => onPaymentChange(event.target.value as PaymentMethod)} value={paymentMethod}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta de crédito / débito</option>
            <option value="transferencia">Transferencia SPEI</option>
          </select>
        </div>
      </div>

      <div className="min-h-48 flex-1 divide-y divide-slate-100 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="grid min-h-44 place-items-center text-center text-sm text-slate-400">
            <div><Package className="mx-auto mb-2 text-slate-300" size={34} />Agrega productos para iniciar la venta.</div>
          </div>
        ) : (
          <div className="space-y-1">
            {cart.map(({ product, quantity }) => (
              <div className="flex items-center gap-2 py-3" key={product.id}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{product.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatMoney(product.price)} c/u</p>
                </div>
                <div className="flex items-center gap-1">
                  <button aria-label={`Restar ${product.name}`} className="quantity-button" onClick={() => onQuantityChange(product.id, quantity - 1)} type="button"><Minus size={13} /></button>
                  <span className="min-w-6 text-center text-xs font-bold">{quantity}</span>
                  <button aria-label={`Sumar ${product.name}`} className="quantity-button" disabled={quantity >= product.stock} onClick={() => onQuantityChange(product.id, quantity + 1)} type="button"><Plus size={13} /></button>
                </div>
                <strong className="w-24 text-right text-xs text-slate-800">{formatMoney((Number(product.price) * quantity).toFixed(2))}</strong>
                <button aria-label={`Quitar ${product.name}`} className="text-slate-400 transition hover:text-rose-600" onClick={() => onRemove(product.id)} type="button"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-b-2xl border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex justify-between text-xs text-slate-500"><span>Subtotal:</span><span>{moneyFromCents(subtotalCents)}</span></div>
        <div className="flex justify-between text-xs text-slate-500"><span>IVA (16%):</span><span>{moneyFromCents(taxCents)}</span></div>
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900"><span>Total a cobrar:</span><span className="text-indigo-600">{moneyFromCents(totalCents)}</span></div>
        <button className="pos-checkout-button" disabled={cart.length === 0 || submitting} onClick={onSubmit} type="button">
          {submitting ? 'Registrando venta…' : 'Confirmar y cobrar venta'}
        </button>
        <p className="text-center text-[10px] text-slate-400">El servidor valida precios, existencias e impuestos.</p>
      </div>
    </aside>
  );
}
