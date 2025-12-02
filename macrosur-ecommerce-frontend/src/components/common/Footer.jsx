import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="fw-bold text-primary">MACROSUR</h5>
            <p className="small">La mejor calidad en productos para el hogar. Comprometidos con la logística eficiente.</p>
            <i className="bi bi-facebook me-2"></i>
            <i className="bi bi-instagram me-2"></i>
            <i className="bi bi-twitter"></i>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="fw-bold">COMPRA</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/catalogo" className="text-white small p-0 mb-1">Catálogo</Nav.Link>
              <Nav.Link as={Link} to="/seguimiento" className="text-white small p-0 mb-1">Rastreo de Pedidos</Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className="mb-3">
            <h6 className="fw-bold">AYUDA</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/ayuda" className="text-white small p-0 mb-1">Centro de Ayuda</Nav.Link>
              <Nav.Link as={Link} to="/devoluciones" className="text-white small p-0 mb-1">Devoluciones</Nav.Link>
              <Nav.Link as={Link} to="/terminos-condiciones" className="text-white small p-0 mb-1">Términos y Condiciones</Nav.Link>
              <Nav.Link as={Link} to="/libro-reclamaciones" className="text-white small p-0 mb-1">Libro de Reclamaciones</Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className="mb-3">
             <h6 className="fw-bold">CONTACTO</h6>
             <p className="small mb-1">
               <i className="bi bi-envelope me-1"></i>
               Email: contacto@macrosur.cl
             </p>
             <p className="small mb-1">
               <i className="bi bi-telephone me-1"></i>
               Teléfono: +56 2 1234 5678
             </p>
             <p className="small mb-0">
               <i className="bi bi-geo-alt me-1"></i>
               Santiago, Chile
             </p>
          </Col>
        </Row>
        <div className="text-center small mt-3 border-top pt-3 text-muted">
          &copy; {new Date().getFullYear()} MACROSUR E-commerce. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;