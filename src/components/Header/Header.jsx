import { Link } from 'react-router-dom';
import './Header.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <button className="header__hamburger">☰</button>
          <Link to="/" className="header__logo">
            Home
          </Link>
        </div>
        <div className="header__search">
          <input
            type="text"
            className="header__search-input"
            placeholder="Search products..."
          />
          <button className="header__search-btn">🔍</button>
        </div>
        <div className="header__right">
          <button className="header__icon-btn">♡</button>
          <button className="header__icon-btn">👤</button>
          <button className="header__icon-btn">🛒</button>
        </div>
      </div>
    </header>
  );
}
