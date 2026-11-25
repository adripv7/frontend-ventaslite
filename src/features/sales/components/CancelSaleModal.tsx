import { X } from 'lucide-react';
import type { SaleSummary } from '../types';

interface Props {
  sale: SaleSummary;
  reason: string;
  busy: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSaleModal({ sale, reason, busy, onReasonChange, onClose, onConfirm }: Props) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-labelledby="cancel-title" aria-modal="true" className="modal-card max-w-md" role="dialog">
        <div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 className="font-bold text-slate-900" id="cancel-title">Cancelar {sale.folio}</h2><button aria-label="Cerrar" className="history-action" onClick={onClose} type="button"><X size={18} /></button></div>
        <div className="space-y-4 p-5"><p className="text-sm text-slate-600">Se restaurará el inventario de esta venta. Esta acción queda registrada en auditoría.</p><label className="block text-xs font-semibold text-slate-600" htmlFor="cancel-reason">Motivo (opcional)</label><textarea className="field-control min-h-24 w-full resize-y py-2" id="cancel-reason" maxLength={500} onChange={(event) => onReasonChange(event.target.value)} value={reason} /><div className="flex justify-end gap-2"><button className="report-outline-button" onClick={onClose} type="button">Volver</button><button className="cancel-confirm-button" disabled={busy} onClick={onConfirm} type="button">{busy ? 'Cancelando…' : 'Confirmar cancelación'}</button></div></div>
      </section>
    </div>
  );
}
