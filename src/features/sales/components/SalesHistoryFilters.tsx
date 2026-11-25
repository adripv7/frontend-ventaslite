import { Search } from 'lucide-react';
import type { Branch } from '../../catalog/types';
import type { SaleFilters, SaleStatus } from '../types';

interface Props {
  filters: SaleFilters;
  branches: Branch[];
  isAdmin: boolean;
  onChange: <K extends keyof SaleFilters>(key: K, value: SaleFilters[K]) => void;
}

export function SalesHistoryFilters({ filters, branches, isAdmin, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5">
      <div><h2 className="text-base font-bold text-slate-900">Registro histórico de ventas</h2><p className="mt-1 text-xs text-slate-500">{isAdmin ? 'Ventas de todas las sucursales y vendedores' : 'Ventas registradas por tu cuenta'}</p></div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <label className="history-search"><Search size={16} /><span className="sr-only">Buscar folio o cliente</span><input maxLength={100} onChange={(event) => onChange('search', event.target.value)} placeholder="Buscar folio o cliente…" value={filters.search ?? ''} /></label>
        <select aria-label="Filtrar por estatus" className="field-control" onChange={(event) => onChange('status', event.target.value as SaleStatus | '')} value={filters.status ?? ''}><option value="">Todos los estatus</option><option value="pagada">Pagadas</option><option value="cancelada">Canceladas</option></select>
        {isAdmin && <select aria-label="Filtrar por sucursal" className="field-control" onChange={(event) => onChange('branch_id', event.target.value ? Number(event.target.value) : '')} value={filters.branch_id ?? ''}><option value="">Todas las sucursales</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select>}
        <div className="flex gap-2"><label className="sr-only" htmlFor="sales-from">Desde</label><input className="field-control min-w-0 flex-1" id="sales-from" type="date" value={filters.from ?? ''} onChange={(event) => onChange('from', event.target.value)} /><label className="sr-only" htmlFor="sales-to">Hasta</label><input className="field-control min-w-0 flex-1" id="sales-to" type="date" value={filters.to ?? ''} onChange={(event) => onChange('to', event.target.value)} /></div>
      </div>
    </div>
  );
}
