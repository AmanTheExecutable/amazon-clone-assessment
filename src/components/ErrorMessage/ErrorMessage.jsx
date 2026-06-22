import './ErrorMessage.scss';

export default function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <p className="error-message__text">{message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}
