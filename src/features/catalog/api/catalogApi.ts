import { http } from '../../../shared/api/http';
import type { Branch, Category, CatalogProduct, Paginated } from '../types';

export const catalogApi = {
  async branches(signal?: AbortSignal): Promise<Branch[]> {
    const { data } = await http.get<{ data: Branch[] }>('/branches', { signal });
    return data.data;
  },

  async categories(signal?: AbortSignal): Promise<Category[]> {
    const { data } = await http.get<{ data: Category[] }>('/categories', { signal });
    return data.data;
  },

  async products(params: { branch_id: number; search?: string; category_id?: number; per_page?: number; page?: number }, signal?: AbortSignal) {
    const { data } = await http.get<Paginated<CatalogProduct>>('/products', { params, signal });
    return data;
  },
};
