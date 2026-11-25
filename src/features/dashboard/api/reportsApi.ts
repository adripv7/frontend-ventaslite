import { http } from '../../../shared/api/http';
import type { AssistantAnswer, AssistantStatus, DashboardReport, ReportFilters } from '../types';

function toParams(filters: ReportFilters) {
  return {
    from: filters.from,
    to: filters.to,
    ...(filters.branch_id ? { branch_id: filters.branch_id } : {}),
  };
}

export const reportsApi = {
  async dashboard(filters: ReportFilters, signal?: AbortSignal): Promise<DashboardReport> {
    const { data } = await http.get<{ data: DashboardReport }>('/reports/dashboard', {
      params: toParams(filters),
      signal,
    });
    return data.data;
  },

  async assistant(question: string, filters: ReportFilters): Promise<AssistantAnswer> {
    const { data } = await http.post<{ data: AssistantAnswer }>('/reports/assistant', {
      question,
      ...toParams(filters),
    });
    return data.data;
  },

  async assistantStatus(signal?: AbortSignal): Promise<AssistantStatus> {
    const { data } = await http.get<{ data: AssistantStatus }>('/reports/assistant/status', { signal });
    return data.data;
  },

  async exportCsv(section: string, filters: ReportFilters, topProductsBy?: 'amount' | 'units'): Promise<Blob> {
    const { data } = await http.get<Blob>('/reports/dashboard/export', {
      params: {
        section,
        ...toParams(filters),
        ...(topProductsBy ? { top_products_by: topProductsBy } : {}),
      },
      responseType: 'blob',
    });
    return data;
  },
};
