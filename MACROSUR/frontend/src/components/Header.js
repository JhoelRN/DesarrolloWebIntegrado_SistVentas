import React from 'react';

function Header() {
  return (
    <header className="main-header">
      <div className="header-top">
        {/* Aquí va el logo */}
        <div className="logo">
          <a href="/">Alfombras & Tapetes</a>
        </div>
        {/* Menú y buscador */}
        <nav className="main-nav">
          <ul className="menu-list">
            <li><a href="/alfombras">Alfombras y Tapetes</a></li>
            <li><a href="/almohadas">Almohadas y Cojines</a></li>
            <li><a href="/cocina">Cocina y Bar</a></li>
            <li><a href="/cortinas">Cortinas</a></li>
            <li><a href="/cuadros">Cuadros y Espejos</a></li>
          </ul>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Buscar Productos..." />
          <button>🔍</button>
        </div>
        {/* Iniciar sesión y carrito */}
        <div className="user-actions">
          <a href="/login">Iniciar Sesión</a>
          <a href="/cart">🛒 Carrito</a>
        </div>
      </div>
      {/* Otras partes del header como la barra de servicios, etc. */}
    </header>
  );
}

export default Header;