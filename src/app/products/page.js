"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelect from "@/components/SortSelect";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductOverrides } from "@/context/ProductOverridesContext";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/productService";
import { sortProducts } from "@/utils/sortProducts";
import {
  buildProductsQuery,
  clampPage,
  parseSearchParams,
} from "@/utils/urlParams";

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    addedProducts,
    deletedIds,
    applyOverridesToList,
  } = useProductOverrides();

  const parsed = parseSearchParams(searchParams);
  const { page, limit, search, category, sort, order } = parsed;

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const requestIdRef = useRef(0);

  const updateUrl = useCallback(
    (overrides) => {
      const next = {
        page,
        limit,
        search,
        category,
        sort,
        order,
        ...overrides,
      };
      const query = buildProductsQuery(next);
      router.push(`${pathname}?${query}`);
    },
    [page, limit, search, category, sort, order, pathname, router]
  );

  // Keep local search input in sync when URL changes (back/forward)
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setSearchInput(search);
    });
    return () => {
      cancelled = true;
    };
  }, [search]);

  // Write debounced search into the URL (resets page to 1)
  useEffect(() => {
    const normalized = debouncedSearch.trim();
    if (normalized === search) return;
    updateUrl({ search: normalized, page: 1 });
  }, [debouncedSearch, search, updateUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const skip = (page - 1) * limit;
        let response;

        // Search takes priority when both search and category are set
        if (search) {
          response = await searchProducts({
            q: search,
            limit,
            skip,
            signal: controller.signal,
          });
        } else if (category) {
          response = await getProductsByCategory({
            category,
            limit,
            skip,
            signal: controller.signal,
          });
        } else {
          response = await getProducts({
            limit,
            skip,
            signal: controller.signal,
          });
        }

        if (currentRequestId !== requestIdRef.current) return;

        let list = applyOverridesToList(response.products || []);
        let nextTotal = Number(response.total) || 0;

        // Session-only additions: show on first page of the unfiltered list
        if (!search && !category) {
          const visibleAdded = addedProducts.filter(
            (item) => !deletedIds.includes(String(item.id))
          );
          nextTotal += visibleAdded.length;

          if (page === 1 && visibleAdded.length > 0) {
            const existingIds = new Set(list.map((item) => String(item.id)));
            const fresh = visibleAdded.filter(
              (item) => !existingIds.has(String(item.id))
            );
            list = [...fresh, ...list].slice(0, limit);
          }
        } else {
          nextTotal = Math.max(0, nextTotal - deletedIds.length);
        }

        list = sortProducts(list, sort, order);

        const safePage = clampPage(page, nextTotal, limit);
        if (safePage !== page) {
          updateUrl({ page: safePage });
          return;
        }

        setProducts(list);
        setTotal(nextTotal);
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
          return;
        }
        if (currentRequestId !== requestIdRef.current) return;
        setError(err.friendlyMessage || "Failed to load products.");
        setProducts([]);
        setTotal(0);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [
    page,
    limit,
    search,
    category,
    sort,
    order,
    reloadKey,
    addedProducts,
    deletedIds,
    applyOverridesToList,
    updateUrl,
  ]);

  function clearFilters() {
    setSearchInput("");
    updateUrl({
      search: "",
      category: "",
      sort: "",
      order: "asc",
      page: 1,
    });
  }

  const searchPriorityHint =
    search && category
      ? "Search is active, so the category filter is ignored until search is cleared."
      : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-600">
            Manage products from the DummyJSON API
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            hint={searchPriorityHint}
          />
          <CategoryFilter
            categories={categories}
            value={category}
            loading={categoriesLoading}
            disabled={Boolean(search)}
            onChange={(value) => updateUrl({ category: value, page: 1 })}
          />
          <SortSelect
            sort={sort}
            order={order}
            onChange={({ sort: nextSort, order: nextOrder }) =>
              updateUrl({ sort: nextSort, order: nextOrder, page: 1 })
            }
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {loading && <LoadingState message="Loading products..." />}

        {!loading && error && (
          <div className="p-4">
            <ErrorState
              message={error}
              onRetry={() => setReloadKey((value) => value + 1)}
            />
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="p-4">
            <EmptyState onClear={clearFilters} />
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable products={products} />
            <div className="grid gap-4 p-4 md:hidden">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={(nextPage) => updateUrl({ page: nextPage })}
              onLimitChange={(nextLimit) =>
                updateUrl({ limit: nextLimit, page: 1 })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading products..." />}>
      <ProductsPageContent />
    </Suspense>
  );
}
