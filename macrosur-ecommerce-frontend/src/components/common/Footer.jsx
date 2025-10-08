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
              <Nav.Link as={Link} to="/info/stock-consignado" className="text-white small p-0 mb-1">Stock Consignado</Nav.Link>
              <Nav.Link as={Link} to="/track" className="text-white small p-0 mb-1">Rastreo</Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className="mb-3">
            <h6 className="fw-bold">AYUDA</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/info/politica-devoluciones" className="text-white small p-0 mb-1">Devoluciones</Nav.Link>
              <Nav.Link as={Link} to="/info/terminos" className="text-white small p-0 mb-1">Términos y Condiciones</Nav.Link>
              <Nav.Link as={Link} to="/profile/claims" className="text-white small p-0 mb-1">Libro de Reclamaciones</Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className="mb-3">
             <h6 className="fw-bold">CONTACTO</h6>
             <p className="small mb-1">Email: contacto@macrosur.com</p>
             <p className="small">Teléfono: +51 987 654 321</p>
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