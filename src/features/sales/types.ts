import type { Branch, CatalogProduct } from '../catalog/types';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';
export type SaleStatus = 'pagada' | 'cancelada';

export interface SaleSummary {
  id: number;
  folio: string;
  sold_at: string;
  customer_name: string | null;
  branch: Pick<Branch, 'id' | 'name'>;
  seller: { id: number; name: string };
  total: string;
  status: SaleStatus;
}

export interface SaleDetail extends SaleSummary {
  payment_method: PaymentMethod;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  subtotal: string;
  tax: string;
  items: Array<{
    product: { id: number; sku: string; name: string };
    quantity: number;
    unit_price: string;
    line_total: string;
  }>;
}

export interface SaleFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: SaleStatus | '';
  branch_id?: number | '';
  from?: string;
  to?: string;
}

export interface SalePage {
  current_page: number;
  data: SaleSummary[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface CreateSaleInput {
  branch_id: number;
  customer_name?: string;
  payment_method: PaymentMethod;
  items: Array<{ product_id: number; quantity: number }>;
}

export interface CartLine {
  product: CatalogProduct;
  quantity: number;
}
