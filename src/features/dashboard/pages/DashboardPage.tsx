import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { catalogApi } from '../../catalog/api/catalogApi';
import type { Branch } from '../../catalog/types';
import { getApiErrorMessage } from '../../auth/utils/apiError';
import { initialReportDates, localDateInput } from '../../../shared/utils/format';
import { reportsApi } from '../api/reportsApi';
import { BranchCategoryMatrix } from '../components/BranchCategoryMatrix';
import { GrossMarginTable } from '../components/GrossMarginTable';
import { ReportAssistantPanel } from '../components/ReportAssistantPanel';
import { ReportFilters } from '../components/ReportFilters';
import { SalesByMonthChart } from '../components/SalesByMonthChart';
import { SellerRankingCard } from '../components/SellerRankingCard';
import { SummaryCards } from '../components/SummaryCards';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { TopProductsCard } from '../components/TopProductsCard';
import type { DashboardReport, ReportFilters as FilterValues } from '../types';
import '../dashboard.css';

function dateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - (days - 1));
  return { from: localDateInput(from), to: localDateInput(to) };
}

export function DashboardPage() {
  const [filters, setFilters] = useState<FilterValues>(() => ({ ...initialReportDates(), branch_id: '' }));
  const [range, setRange] = useState('30');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    catalogApi.branches(controller.signal)
      .then(setBranches)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) toast.error(getApiErrorMessage(requestError));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setReport(null);
    setError('');
    reportsApi.dashboard(filters, controller.signal)
      .then(setReport)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filters]);

  const updateRange = useCallback((nextRange: string) => {
    setRange(nextRange);
    if (nextRange !== 'custom') {
      const dates = dateRange(Number(nextRange));
      setFilters((current) => ({ ...current, ...dates }));
    }
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      <ReportFilters filters={filters} branches={branches} range={range} onRangeChange={updateRange} onFilterChange={setFilters} />
      <ReportAssistantPanel filters={filters} />

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span>
          <button className="report-outline-button self-start" onClick={() => setFilters((current) => ({ ...current }))} type="button">
            <RefreshCw size={15} /> Reintentar
          </button>
        </div>
      )}

      {loading && !report && <DashboardSkeleton />}

      {report && (
        <>
          <SummaryCards summary={report.summary} />
          <SalesByMonthChart data={report.sales_by_month} filters={filters} />
          <div className="grid items-start gap-5 xl:grid-cols-2">
            <TopProductsCard products={report.top_products} filters={filters} />
            <SellerRankingCard ranking={report.seller_ranking} filters={filters} />
          </div>
          <BranchCategoryMatrix matrix={report.branch_category_matrix} filters={filters} onShowAllBranches={() => setFilters((current) => ({ ...current, branch_id: '' }))} />
          <GrossMarginTable rows={report.gross_margin_by_category} filters={filters} />
        </>
      )}
    </div>
  );
}
