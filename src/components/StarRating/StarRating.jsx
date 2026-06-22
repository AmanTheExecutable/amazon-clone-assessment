import './StarRating.scss';

export default function StarRating({ rating, count }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return 'full';
    if (rating >= i + 0.5) return 'half';
    return 'empty';
  });

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {stars.map((type, i) => (
          <span key={i} className={`star-rating__star star-rating__star--${type}`}>
            {type === 'empty' ? '☆' : '★'}
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="star-rating__count">({count})</span>
      )}
    </div>
  );
}
