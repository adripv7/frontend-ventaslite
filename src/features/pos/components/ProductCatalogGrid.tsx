import { LoaderCircle, Package, Plus, Search } from 'lucide-react';
import type { Branch, Category, CatalogProduct } from '../../catalog/types';
import { formatMoney } from '../../../shared/utils/format';

interface Props {
  products: CatalogProduct[];
  branches: Branch[];
  categories: Category[];
  branchId: number | null;
  search: string;
  categoryId: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBranchChange: (value: number) => void;
  onAdd: (product: CatalogProduct) => void;
}

export function ProductCatalogGrid({
  products, branches, categories, branchId, search, categoryId, loading,
  onSearchChange, onCategoryChange, onBranchChange, onAdd,
}: Props) {
  return (
    <section className="min-w-0 space-y-4">
      <div className="pos-filter-bar">
        <label className="pos-search-field">
          <Search aria-hidden="true" size={19} />
          <span className="sr-only">Buscar producto</span>
          <input maxLength={100} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar producto por nombre o SKU…" value={search} />
        </label>
        <label className="sr-only" htmlFor="pos-category">Categoría</label>
        <select className="pos-select" id="pos-category" onChange={(event) => onCategoryChange(event.target.value)} value={categoryId}>
          <option value="">Todas las categorías</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        {branches.length > 1 ? (
          <>
            <label className="sr-only" htmlFor="pos-branch">Sucursal</label>
            <select className="pos-select" id="pos-branch" onChange={(event) => onBranchChange(Number(event.target.value))} value={branchId ?? ''}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </>
        ) : branchId && <div className="pos-branch-label">{branches[0]?.name}</div>}
      </div>

      {loading ? (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
          <span className="flex items-center gap-2"><LoaderCircle className="animate-spin text-indigo-600" size={18} /> Cargando catálogo…</span>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-report-state min-h-56">
          <Package className="mb-2 text-slate-300" size={34} />
          No encontramos productos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="flex items-start justify-between gap-2">
                <span className="product-sku">{product.sku}</span>
                <span className={`stock-badge ${product.stock <= 5 ? 'stock-badge-low' : ''}`}>
                  Stock: {product.stock} uds
                </span>
              </div>
              <h2 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-800">{product.name}</h2>
              <p className="mt-1 truncate text-xs text-slate-400">{product.category.name}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <strong className="text-sm font-bold text-slate-900">{formatMoney(product.price)}</strong>
                <button className="pos-add-button" disabled={product.stock <= 0} onClick={() => onAdd(product)} type="button">
                  <Plus size={16} /> Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
