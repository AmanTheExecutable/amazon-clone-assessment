import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProducts, fetchCategories, fetchByCategory } from '../../api/products';
import { useFilters } from '../../context/FilterContext';
import { USE_API_PAGINATION, PAGE_SIZE } from '../../config/featureFlags';
import { parseError } from '../../utils/parseError';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import './ProductListingPage.scss';

export default function ProductListingPage() {
  const { filters } = useFilters();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalFromApi, setTotalFromApi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasClientSideFilters = filters.minPrice !== '' || filters.maxPrice !== '' || filters.brands.length > 0;
  const useApiPaging = USE_API_PAGINATION && !hasClientSideFilters;
  const pageForApi = useApiPaging ? filters.page : 1;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAllProducts([]);
    try {
      const skip = useApiPaging ? (pageForApi - 1) * PAGE_SIZE : 0;
      const limit = useApiPaging ? PAGE_SIZE : 100;

      const [catRes, prodRes] = await Promise.all([
        fetchCategories(),
        filters.category
          ? fetchByCategory(filters.category, limit, skip)
          : fetchProducts(limit, skip),
      ]);

      setCategories(catRes.data);
      setAllProducts(prodRes.data.products);
      setTotalFromApi(prodRes.data.total);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, [filters.category, pageForApi, useApiPaging]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    if (useApiPaging) return allProducts;
    let result = [...allProducts];
    if (filters.minPrice !== '') result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice !== '') result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.brands.length > 0) result = result.filter(p => filters.brands.includes(p.brand));
    return result;
  }, [allProducts, filters.minPrice, filters.maxPrice, filters.brands, useApiPaging]);

  const totalPages = useApiPaging
    ? Math.ceil(totalFromApi / PAGE_SIZE)
    : Math.ceil(filteredProducts.length / PAGE_SIZE);

  const displayedProducts = useApiPaging
    ? filteredProducts
    : filteredProducts.slice((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE);

  const resultCount = useApiPaging ? totalFromApi : filteredProducts.length;

  return (
    <div className="listing-page">
      <div className="listing-page__inner">
        <FilterPanel categories={categories} allProducts={allProducts} />
        <main className="listing-page__main">
          <div className="listing-page__header">
            <h1 className="listing-page__heading">
              {filters.category
                ? categories.find(c => c.slug === filters.category)?.name || filters.category
                : 'All Products'}
            </h1>
            {!loading && !error && (
              <span className="listing-page__count">{resultCount} results</span>
            )}
          </div>
          {loading && <Loader />}
          {error && <ErrorMessage message={error} onRetry={loadData} />}
          {!loading && !error && (
            <>
              <ProductGrid products={displayedProducts} />
              <Pagination totalPages={totalPages} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
