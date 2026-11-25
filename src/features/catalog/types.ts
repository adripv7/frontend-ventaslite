export interface Branch {
  id: number;
  name: string;
  city: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CatalogProduct {
  id: number;
  sku: string;
  name: string;
  category: Category;
  price: string;
  stock: number;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}
