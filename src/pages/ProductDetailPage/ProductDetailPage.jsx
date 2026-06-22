import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../api/products';
import StarRating from '../../components/StarRating/StarRating';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import './ProductDetailPage.scss';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
        setActiveImage(0);
      } catch (err) {
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="detail-page">
      <div className="detail-page__inner">
        <button className="detail-page__back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="detail-page__content">
          <div className="detail-page__images">
            <div className="detail-page__main-image">
              <img src={images[activeImage]} alt={product.title} />
            </div>
            {images.length > 1 && (
              <div className="detail-page__thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className={`detail-page__thumb${activeImage === idx ? ' detail-page__thumb--active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="detail-page__info">
            <h1 className="detail-page__title">{product.title}</h1>
            <div className="detail-page__price">${product.price.toFixed(2)}</div>
            <div className="detail-page__rating">
              <StarRating rating={product.rating} count={product.reviews?.length} />
            </div>
            <div className="detail-page__meta">
              <div className="detail-page__meta-item">
                <span className="detail-page__meta-label">Brand:</span>
                <span>{product.brand}</span>
              </div>
              <div className="detail-page__meta-item">
                <span className="detail-page__meta-label">Category:</span>
                <span className="detail-page__meta-category">{product.category}</span>
              </div>
              {product.stock !== undefined && (
                <div className="detail-page__meta-item">
                  <span className="detail-page__meta-label">Stock:</span>
                  <span className={product.stock > 0 ? 'detail-page__in-stock' : 'detail-page__out-stock'}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </div>
              )}
            </div>
            <p className="detail-page__description">{product.description}</p>
            <button className="detail-page__add-to-cart">Add to Cart</button>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="detail-page__reviews">
            <h2 className="detail-page__reviews-title">Customer Reviews</h2>
            <div className="detail-page__reviews-list">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="detail-page__review">
                  <div className="detail-page__review-header">
                    <span className="detail-page__reviewer">{review.reviewerName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="detail-page__review-comment">{review.comment}</p>
                  <span className="detail-page__review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
