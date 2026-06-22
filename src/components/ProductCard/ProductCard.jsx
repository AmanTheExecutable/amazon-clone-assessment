import { useNavigate } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import './ProductCard.scss';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card__image-wrapper">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card__image"
        />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__price">${product.price.toFixed(2)}</div>
        <div className="product-card__rating">
          <StarRating rating={product.rating} count={product.reviews?.length} />
        </div>
      </div>
    </div>
  );
}
