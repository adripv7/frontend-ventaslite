import { Building2, CalendarDays, Filter } from 'lucide-react';
import type { Branch } from '../../catalog/types';
import type { ReportFilters as Filters } from '../types';

interface Props {
  filters: Filters;
  branches: Branch[];
  range: string;
  onRangeChange: (range: string) => void;
  onFilterChange: (filters: Filters) => void;
}

export function ReportFilters({ filters, branches, range, onRangeChange, onFilterChange }: Props) {
  return (
    <section className="report-filter-bar" aria-label="Filtros de reportes">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Filter aria-hidden="true" className="text-indigo-600" size={17} />
        <span>Filtros de reportes</span>
      </div>

      <label className="report-filter-control">
        <Building2 aria-hidden="true" size={16} />
        <span className="sr-only">Sucursal</span>
        <select
          aria-label="Filtrar por sucursal"
          value={filters.branch_id}
          onChange={(event) => onFilterChange({ ...filters, branch_id: event.target.value ? Number(event.target.value) : '' })}
        >
          <option value="">Todas las sucursales</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
      </label>

      <label className="report-filter-control">
        <CalendarDays aria-hidden="true" size={16} />
        <span className="sr-only">Periodo</span>
        <select aria-label="Seleccionar periodo" value={range} onChange={(event) => onRangeChange(event.target.value)}>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
          <option value="custom">Periodo personalizado</option>
        </select>
      </label>

      {range === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-1">
          <label className="sr-only" htmlFor="report-from">Desde</label>
          <input
            id="report-from"
            className="report-date-input"
            type="date"
            value={filters.from}
            max={filters.to}
            onChange={(event) => onFilterChange({ ...filters, from: event.target.value })}
          />
          <span className="text-xs text-slate-400">a</span>
          <label className="sr-only" htmlFor="report-to">Hasta</label>
          <input
            id="report-to"
            className="report-date-input"
            type="date"
            value={filters.to}
            min={filters.from}
            onChange={(event) => onFilterChange({ ...filters, to: event.target.value })}
          />
        </div>
      )}
    </section>
  );
}
