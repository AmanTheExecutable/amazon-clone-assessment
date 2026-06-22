import { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

const initialFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  brands: [],
  page: 1,
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters(prev => {
      if (key === 'page') {
        return { ...prev, page: value };
      }
      return { ...prev, [key]: value, page: 1 };
    });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
