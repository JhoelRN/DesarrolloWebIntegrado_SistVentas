import React from 'react';

function MainContent() {
  const images = [
    { src: "https://placehold.co/400x400/FF5733/FFFFFF?text=Alfombras", alt: "Alfombras" },
    { src: "https://placehold.co/400x400/33FF57/000000?text=Almohadas", alt: "Almohadas" },
    { src: "https://placehold.co/400x400/5733FF/FFFFFF?text=Cocina", alt: "Cocina" },
  ];

  return (
    <main className="main-content">
      {/* Sección del Carrusel */}
      <section className="carousel-section">
        <div className="carousel-images">
          {images.map((image, index) => (
            <img key={index} src={image.src} alt={image.alt} className="carousel-image" />
          ))}
        </div>
        <div className="carousel-controls">
          <button className="carousel-btn prev-btn">←</button>
          <div className="carousel-dots">
            {images.map((_, index) => (
              <span key={index} className="dot"></span>
            ))}
          </div>
          <button className="carousel-btn next-btn">→</button>
        </div>
      </section>

      {/* Sección de "Aprovecha" */}
      <section className="promo-section">
        <span className="promo-text">¡aprovecha!, comenzó</span>
        <div className="promo-image">
          {/* Aquí puedes usar una imagen real de tu disco */}
          <img src="https://placehold.co/150x50/DDDDDD/000000?text=Diadel+Shopping" alt="Día del Shopping" />
        </div>
        <span className="promo-text">los mejores días para llevártelo todo</span>
      </section>

      {/* Sección de "Descubre más para ti" */}
      <section className="discover-section">
        <h3>Descubre más para ti</h3>
        <div className="discover-grid">
          <div className="discover-item">
            <span className="icon">💳</span>
            <p>Pide tu Tarjeta Rlpley online</p>
          </div>
          <div className="discover-item">
            <span className="icon">💰</span>
            <p>Rlpley Puntos GO</p>
          </div>
          <div className="discover-item">
            <span className="icon">🚚</span>
            <p>Pide online un Efectivo Express</p>
          </div>
          <div className="discover-item">
            <span className="icon">🎁</span>
            <p>Promociones Banco Rlpley</p>
          </div>
        </div>
      </section>

      {/* Servicios al cliente */}
      <section className="customer-service-section">
        <h3>Servicios al cliente</h3>
        <div className="service-grid">
          <div className="service-item">
            <span className="service-icon">💬</span>
            <p>Servicio al cliente</p>
          </div>
          <div className="service-item">
            <span className="service-icon">📦</span>
            <p>Seguimiento de Compra</p>
          </div>
          <div className="service-item">
            <span className="service-icon">🏠</span>
            <p>Retiro en tienda</p>
          </div>
          <div className="service-item">
            <span className="service-icon">💡</span>
            <p>Soluciones Empresas</p>
          </div>
        </div>
      </section>
      
      {/* Sección de ofertas y "libro de reclamaciones" */}
      <section className="offer-section">
        <div className="offer-image">
          <img src="https://placehold.co/600x200/CCCCCC/000000?text=Ofertas" alt="Ofertas" />
        </div>
        <div className="complaint-book">
          <img src="https://placehold.co/100x100/AAAAAA/FFFFFF?text=Libro" alt="Libro de Reclamaciones" />
          <p>Libro de<br />Reclamaciones</p>
        </div>
      </section>
    </main>
  );
}

export default MainContent;