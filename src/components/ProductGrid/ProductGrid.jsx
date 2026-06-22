import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.scss';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <div className="product-grid__empty">No products found.</div>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
