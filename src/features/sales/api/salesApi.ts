import { http } from '../../../shared/api/http';
import type { CreateSaleInput, SaleDetail, SaleFilters, SalePage } from '../types';

export const salesApi = {
  async list(filters: SaleFilters, signal?: AbortSignal): Promise<SalePage> {
    const { data } = await http.get<SalePage>('/sales', { params: filters, signal });
    return data;
  },

  async detail(id: number, signal?: AbortSignal): Promise<SaleDetail> {
    const { data } = await http.get<{ data: SaleDetail }>(`/sales/${id}`, { signal });
    return data.data;
  },

  async create(payload: CreateSaleInput): Promise<SaleDetail> {
    const { data } = await http.post<{ sale: SaleDetail }>('/sales', payload);
    return data.sale;
  },

  async cancel(id: number, reason?: string): Promise<SaleDetail> {
    const { data } = await http.patch<{ sale: SaleDetail }>(`/sales/${id}/cancel`, { reason });
    return data.sale;
  },
};
