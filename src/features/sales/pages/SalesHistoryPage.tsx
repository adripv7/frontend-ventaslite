import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../app/providers/AuthProvider';
import { catalogApi } from '../../catalog/api/catalogApi';
import type { Branch } from '../../catalog/types';
import { getApiErrorMessage } from '../../auth/utils/apiError';
import { salesApi } from '../api/salesApi';
import { CancelSaleModal } from '../components/CancelSaleModal';
import { SaleDetailModal } from '../components/SaleDetailModal';
import { SalesHistoryFilters } from '../components/SalesHistoryFilters';
import { SalesHistoryTable } from '../components/SalesHistoryTable';
import { SalesPagination } from '../components/SalesPagination';
import type { SaleDetail, SaleFilters, SalePage, SaleSummary } from '../types';
import './sales-history.css';

const emptyPage: SalePage = { current_page: 1, data: [], from: null, last_page: 1, per_page: 20, to: null, total: 0 };

export function SalesHistoryPage() {
  const { user } = useAuth();
  const isAdmin = user?.permissions.includes('sales.view_all') ?? false;
  const canCancel = user?.permissions.includes('sales.cancel') ?? false;
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filters, setFilters] = useState<SaleFilters>({ page: 1, per_page: 20, search: '', status: '', branch_id: '', from: '', to: '' });
  const [page, setPage] = useState<SalePage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<SaleDetail | null>(null);
  const [cancelTarget, setCancelTarget] = useState<SaleSummary | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    catalogApi.branches(controller.signal).then(setBranches).catch((error: unknown) => {
      if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    salesApi.list(filters, controller.signal).then(setPage).catch((error: unknown) => {
      if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters]);

  function updateFilter<K extends keyof SaleFilters>(key: K, value: SaleFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  async function showDetail(id: number) {
    setBusy(true);
    try { setSelectedSale(await salesApi.detail(id)); }
    catch (error) { toast.error(getApiErrorMessage(error)); }
    finally { setBusy(false); }
  }

  async function cancelSale() {
    if (!cancelTarget) return;
    setBusy(true);
    try {
      await salesApi.cancel(cancelTarget.id, cancelReason.trim() || undefined);
      toast.success(`La venta ${cancelTarget.folio} fue cancelada.`);
      setCancelTarget(null);
      setCancelReason('');
      setFilters((current) => ({ ...current }));
      if (selectedSale?.id === cancelTarget.id) setSelectedSale(null);
    } catch (error) { toast.error(getApiErrorMessage(error)); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      <section className="report-card overflow-hidden">
        <SalesHistoryFilters filters={filters} branches={branches} isAdmin={isAdmin} onChange={updateFilter} />
        <SalesHistoryTable sales={page.data} loading={loading} canCancel={canCancel} onView={(id) => void showDetail(id)} onCancel={setCancelTarget} />
        <SalesPagination page={page} loading={loading} onPageChange={(nextPage) => setFilters((current) => ({ ...current, page: nextPage }))} />
      </section>

      {selectedSale && <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}
      {cancelTarget && <CancelSaleModal sale={cancelTarget} reason={cancelReason} busy={busy} onReasonChange={setCancelReason} onClose={() => setCancelTarget(null)} onConfirm={() => void cancelSale()} />}
      {busy && !selectedSale && !cancelTarget && <span className="sr-only" role="status">Procesando solicitud</span>}
    </div>
  );
}
