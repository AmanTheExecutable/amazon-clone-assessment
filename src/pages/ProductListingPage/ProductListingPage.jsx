import { useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchCategories, fetchByCategory } from '../../api/products';
import { useFilters } from '../../context/FilterContext';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import './ProductListingPage.scss';

const ITEMS_PER_PAGE = 12;

export default function ProductListingPage() {
  const { filters } = useFilters();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories(),
          filters.category ? fetchByCategory(filters.category) : fetchProducts(100),
        ]);
        setCategories(catRes.data);
        setAllProducts(prodRes.data.products);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters.category]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (filters.minPrice !== '') {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }
    return result;
  }, [allProducts, filters.minPrice, filters.maxPrice, filters.brands]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  );

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
            <span className="listing-page__count">
              {filteredProducts.length} results
            </span>
          </div>
          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <>
              <ProductGrid products={paginatedProducts} />
              <Pagination totalPages={totalPages} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
