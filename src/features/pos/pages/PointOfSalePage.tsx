import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { catalogApi } from '../../catalog/api/catalogApi';
import type { Branch, CatalogProduct, Category } from '../../catalog/types';
import { getApiErrorMessage } from '../../auth/utils/apiError';
import { salesApi } from '../../sales/api/salesApi';
import type { CartLine, PaymentMethod } from '../../sales/types';
import { ProductCatalogGrid } from '../components/ProductCatalogGrid';
import { SaleCartPanel } from '../components/SaleCartPanel';
import '../pos.css';

function priceToCents(value: string): number {
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2));
}

export function PointOfSalePage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [catalogPage, setCatalogPage] = useState(1);
  const [lastCatalogPage, setLastCatalogPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([catalogApi.branches(controller.signal), catalogApi.categories(controller.signal)])
      .then(([branchRows, categoryRows]) => {
        setBranches(branchRows);
        setCategories(categoryRows);
        if (branchRows.length > 0) setBranchId((current) => current ?? branchRows[0].id);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (branchId === null) return;
    const controller = new AbortController();
    setLoadingCatalog(true);
    catalogApi.products({
      branch_id: branchId,
      per_page: 30,
      page: catalogPage,
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
    }, controller.signal)
      .then((result) => {
        setProducts((current) => catalogPage === 1 ? result.data : [...current, ...result.data]);
        setLastCatalogPage(result.last_page);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCatalog(false);
      });
    return () => controller.abort();
  }, [branchId, searchQuery, categoryId, refreshKey, catalogPage]);

  useEffect(() => { setCatalogPage(1); }, [searchQuery, categoryId, branchId]);

  const subtotalCents = useMemo(
    () => cart.reduce((sum, line) => sum + priceToCents(line.product.price) * line.quantity, 0),
    [cart],
  );
  const taxCents = Math.round(subtotalCents * 0.16);
  const totalCents = subtotalCents + taxCents;

  function addProduct(product: CatalogProduct) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (!existing && current.length >= 6) {
        toast.error('El ticket admite hasta 6 productos distintos por venta.');
        return current;
      }
      if (existing && existing.quantity >= product.stock) {
        toast.error(`Existencia disponible: ${product.stock} unidades.`);
        return current;
      }
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      if (product.stock <= 0) {
        toast.error('Este producto no tiene existencias en la sucursal.');
        return current;
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      setCart((current) => current.filter((line) => line.product.id !== productId));
      return;
    }
    setCart((current) => current.map((line) => {
      if (line.product.id !== productId) return line;
      if (quantity > line.product.stock) {
        toast.error(`Existencia disponible: ${line.product.stock} unidades.`);
        return line;
      }
      return { ...line, quantity };
    }));
  }

  async function completeSale() {
    if (!branchId || cart.length === 0) return;
    setSubmitting(true);
    try {
      const sale = await salesApi.create({
        branch_id: branchId,
        customer_name: customer.trim() || 'Público en General',
        payment_method: paymentMethod,
        items: cart.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
      });
      setCart([]);
      setCustomer('');
      setProducts([]);
      setCatalogPage(1);
      toast.success(`Venta ${sale.folio} registrada correctamente.`);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <ProductCatalogGrid
          products={products}
          branches={branches}
          categories={categories}
          branchId={branchId}
          search={search}
          categoryId={categoryId}
          loading={loadingCatalog}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryId}
          onBranchChange={(nextBranch) => { setProducts([]); setCatalogPage(1); setBranchId(nextBranch); setCart([]); }}
          onAdd={addProduct}
        />
        <SaleCartPanel
          cart={cart}
          customer={customer}
          paymentMethod={paymentMethod}
          subtotalCents={subtotalCents}
          taxCents={taxCents}
          totalCents={totalCents}
          submitting={submitting}
          onCustomerChange={setCustomer}
          onPaymentChange={setPaymentMethod}
          onQuantityChange={updateQuantity}
          onRemove={(productId) => setCart((current) => current.filter((line) => line.product.id !== productId))}
          onSubmit={() => void completeSale()}
        />
      </div>
      {catalogPage < lastCatalogPage && <div className="text-center"><button className="report-outline-button" disabled={loadingCatalog} onClick={() => setCatalogPage((current) => current + 1)} type="button">{loadingCatalog ? 'Cargando…' : 'Cargar más productos'}</button></div>}
      {products.length > 0 && <p className="text-right text-xs text-slate-400">Precios y existencias confirmados por el servidor al cobrar.</p>}
    </div>
  );
}
