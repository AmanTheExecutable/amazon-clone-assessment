import './ErrorMessage.scss';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <span className="error-message__icon">⚠</span>
      <p className="error-message__text">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button className="error-message__retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
