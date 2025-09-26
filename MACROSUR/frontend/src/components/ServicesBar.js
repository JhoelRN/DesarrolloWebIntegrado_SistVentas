import React from 'react';

function ServicesBar() {
  return (
    <section className="services-bar">
      <div className="service-item">
        <span className="service-icon">🔍</span>
        <a href="#">Ver pedido</a>
      </div>
      <div className="service-item">
        <span className="service-icon">❓</span>
        <a href="#">Ayuda</a>
      </div>
      <div className="service-item">
        <span className="service-icon">🔁</span>
        <a href="#">Políticas de devolución</a>
      </div>
    </section>
  );
}

export default ServicesBar;