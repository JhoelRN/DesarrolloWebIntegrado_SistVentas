import React from 'react';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-links">
        <div className="footer-column">
          <h4>Compra con Confianza</h4>
          <ul>
            <li><a href="#">¿Cómo comprar?</a></li>
            <li><a href="#">Guías de Compra</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Cambios y Devoluciones</a></li>
            <li><a href="#">Bases Legales</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Sobre la Empresa</h4>
          <ul>
            <li><a href="#">Portal de Personas</a></li>
            <li><a href="#">¿Quiénes Somos?</a></li>
            <li><a href="#">Nuestras Tiendas</a></li>
            <li><a href="#">Trabaja con nosotros</a></li>
            <li><a href="#">Comprobante Electrónico</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Más de la Empresa</h4>
          <ul>
            <li><a href="#">Banco Rlpley</a></li>
            <li><a href="#">Tarjeta Rlpley</a></li>
            <li><a href="#">Efectivo Express</a></li>
            <li><a href="#">Rlpley Puntos</a></li>
            <li><a href="#">Seguros Rlpley</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Medios de pago</h4>
          <div className="payment-icons">
            <img src="https://placehold.co/50x30/CCCCCC/000000?text=VISA" alt="Visa" />
            <img src="https://placehold.co/50x30/CCCCCC/000000?text=MC" alt="Mastercard" />
            <img src="https://placehold.co/50x30/CCCCCC/000000?text=Amex" alt="Amex" />
          </div>
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="#"><img src="https://placehold.co/30x30/DDDDDD/000000?text=FB" alt="Facebook" /></a>
            <a href="#"><img src="https://placehold.co/30x30/DDDDDD/000000?text=TW" alt="Twitter" /></a>
            <a href="#"><img src="https://placehold.co/30x30/DDDDDD/000000?text=IG" alt="Instagram" /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Conectado desde dónde estés</p>
        <p>Oficina en Casa</p>
        <p>Renueva tu hogar</p>
      </div>
    </footer>
  );
}

export default Footer;