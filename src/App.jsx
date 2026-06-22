import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import Header from './components/Header/Header';
import ProductListingPage from './pages/ProductListingPage/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
