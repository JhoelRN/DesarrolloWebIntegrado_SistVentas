import React from 'react';

function Header({ onLoginClick }) {
  return (
    <header className="main-header">
      <div className="header-top">
        <div className="logo">
          <span className="logo-text">R.com</span>
          <button className="menu-btn">≡ Menú</button>
        </div>
        <div className="location-section">
          <span className="location-icon">📍</span>
          <a href="#">Ingresa tu ubicación</a>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar Productos" />
          <button>🔍</button>
        </div>
        <div className="user-actions">
          <span className="user-text">¡Hola!</span>
          <button className="login-btn" onClick={onLoginClick}>
            Iniciar sesión
          </button>
          <button className="cart-btn">🛒</button>
        </div>
      </div>
      <div className="header-bottom">
        <a href="#" className="follow-link">
          <span className="follow-icon">📦</span>
          Sigue tu compra
        </a>
        <a href="#" className="help-link">
          <span className="help-icon">❓</span>
          ¿Necesitas ayuda?
        </a>
        <div className="return-policy-box">
          Políticas de<br />Devolución
        </div>
      </div>
    </header>
  );
}

export default Header;