import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../api/products';
import { parseError } from '../../utils/parseError';
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

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProduct(null);
    try {
      const res = await fetchProductById(id);
      setProduct(res.data);
      setActiveImage(0);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) return <Loader />;

  if (error) {
    const is404 = error === 'Product not found.';
    return (
      <div className="detail-page">
        <div className="detail-page__inner">
          <button className="detail-page__back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <ErrorMessage
            message={error}
            onRetry={is404 ? undefined : loadProduct}
          />
        </div>
      </div>
    );
  }

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

            <div className="detail-page__price-row">
              <span className="detail-page__price">${product.price.toFixed(2)}</span>
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
            </div>

            <div className="detail-page__section">
              <h2 className="detail-page__section-title">Description</h2>
              <p className="detail-page__description">{product.description}</p>
            </div>

            {product.reviews && product.reviews.length > 0 && (
              <div className="detail-page__section">
                <h2 className="detail-page__section-title">Reviews</h2>
                <div className="detail-page__reviews-list">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="detail-page__review">
                      <div className="detail-page__review-header">
                        <span className="detail-page__reviewer">{review.reviewerName}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="detail-page__review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
