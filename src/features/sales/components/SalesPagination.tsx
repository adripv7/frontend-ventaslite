import type { SalePage } from '../types';

export function SalesPagination({ page, loading, onPageChange }: { page: SalePage; loading: boolean; onPageChange: (page: number) => void }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>{page.total} ventas · Página {page.current_page} de {page.last_page}</span>
      <div className="flex gap-2">
        <button className="report-outline-button" disabled={page.current_page <= 1 || loading} onClick={() => onPageChange(page.current_page - 1)} type="button">Anterior</button>
        <button className="report-outline-button" disabled={page.current_page >= page.last_page || loading} onClick={() => onPageChange(page.current_page + 1)} type="button">Siguiente</button>
      </div>
    </div>
  );
}
