import type { Branch } from '../catalog/types';

export interface ReportFilters {
  from: string;
  to: string;
  branch_id: number | '';
}

export interface DashboardReport {
  filters: { from: string; to: string; branch_id: number | null };
  summary: {
    sales_total: string;
    sales_before_tax: string;
    tax_collected: string;
    transactions: number;
    average_ticket: string;
    previous_period: { from: string; to: string; sales_total: string; transactions: number };
    sales_change_percent: number | null;
  };
  sales_by_month: Array<{ period: string; label: string; sales_total: string; transactions: number }>;
  top_products: { by_amount: ReportProduct[]; by_units: ReportProduct[] };
  seller_ranking: Array<{
    seller: { id: number; name: string };
    branch: Branch;
    transactions: number;
    sales_total: string;
    average_ticket: string;
  }>;
  branch_category_matrix: {
    categories: Array<{ id: number; name: string; total: string }>;
    branches: Array<{ branch: Branch; categories: Array<{ id: number; name: string; amount: string }>; total: string }>;
    total: string;
  };
  gross_margin_by_category: Array<{
    category: { id: number; name: string };
    units: number;
    revenue: string;
    cost: string;
    gross_profit: string;
    margin_percent: number;
  }>;
}

export interface ReportProduct {
  id: number;
  sku: string;
  name: string;
  amount: string;
  units: number;
}

export interface AssistantAnswer {
  answer: string;
  model: string;
  filters: { from: string; to: string; branch_id: number | null };
  usage: { input_tokens: number; output_tokens: number; total_tokens: number } | null;
}

export interface AssistantStatus {
  provider: 'ollama' | 'groq' | 'unknown';
  model: string;
  configured: boolean;
  connected: boolean;
  usage_period: string;
  usage: { input_tokens: number; output_tokens: number; total_tokens: number };
  last_request_at: string | null;
}
