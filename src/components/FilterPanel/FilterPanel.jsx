import { useState, useEffect } from 'react';
import { useFilters } from '../../context/FilterContext';
import './FilterPanel.scss';

export default function FilterPanel({ categories, allProducts, isOpen, onClose }) {
  const { filters, updateFilter, resetFilters } = useFilters();
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort();

  useEffect(() => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (slug) => {
    const newCategory = filters.category === slug ? '' : slug;
    updateFilter('category', newCategory);
    updateFilter('brands', []);
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    updateFilter('brands', newBrands);
  };

  const handleApplyPrice = () => {
    updateFilter('minPrice', minPrice);
    updateFilter('maxPrice', maxPrice);
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    resetFilters();
  };

  return (
    <>
      {isOpen && <div className="filter-panel__overlay" onClick={onClose} />}
      <aside className={`filter-panel${isOpen ? ' filter-panel--open' : ''}`}>
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">Filters</h2>
        <div className="filter-panel__header-actions">
          <button className="filter-panel__reset" onClick={handleReset}>Clear All</button>
          <button className="filter-panel__close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Categories</h3>
        <ul className="filter-panel__list">
          {categories.map(cat => (
            <li key={cat.slug} className="filter-panel__item">
              <label className="filter-panel__label">
                <input
                  type="checkbox"
                  className="filter-panel__checkbox"
                  checked={filters.category === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                />
                <span>{cat.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Price Range</h3>
        <div className="filter-panel__price">
          <input
            type="number"
            className="filter-panel__price-input"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            min="0"
          />
          <span className="filter-panel__price-sep">—</span>
          <input
            type="number"
            className="filter-panel__price-input"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
        <button className="filter-panel__apply" onClick={handleApplyPrice}>Apply</button>
      </div>

      {brands.length > 0 && (
        <div className="filter-panel__section">
          <h3 className="filter-panel__section-title">Brands</h3>
          <ul className="filter-panel__list">
            {brands.map(brand => (
              <li key={brand} className="filter-panel__item">
                <label className="filter-panel__label">
                  <input
                    type="checkbox"
                    className="filter-panel__checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
    </>
  );
}
