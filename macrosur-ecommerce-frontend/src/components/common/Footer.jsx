import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-2 mt-auto">
            <Container>
                {/* Sección Superior: Newsletter y Redes */}
                <div className="border-bottom border-secondary pb-4 mb-4">
                    <Row className="align-items-center">
                        <Col lg={5} className="mb-3 mb-lg-0">
                            <h5 className="fw-bold mb-1">¡Suscríbete a nuestro boletín!</h5>
                            <p className="text-white-50 small mb-0">Recibe ofertas exclusivas y novedades en tu correo.</p>
                        </Col>
                        <Col lg={7}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <InputGroup>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Tu correo electrónico" 
                                        className="border-0 shadow-none"
                                        style={{ height: '45px' }}
                                    />
                                    <Button variant="primary" type="submit" className="fw-bold px-4">
                                        Suscribirse
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </div>

                {/* Sección Central: Enlaces */}
                <Row className="g-4">
                    {/* Columna 1: Marca */}
                    <Col md={4} lg={4}>
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary text-white rounded px-1 me-1" style={{ fontSize: '1.5rem', lineHeight: '1' }}>M</div>
                            <span className="fw-bold fs-4">ACROSUR</span>
                        </div>
                        <p className="text-white-50 small mb-4 pe-lg-4">
                            Especialistas en decoración y mejoramiento del hogar en el sur del país. Calidad y estilo para cada uno de tus espacios.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white text-opacity-75 hover-white transition"><i className="bi bi-facebook fs-5"></i></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white text-opacity-75 hover-white transition"><i className="bi bi-instagram fs-5"></i></a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white text-opacity-75 hover-white transition"><i className="bi bi-linkedin fs-5"></i></a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white text-opacity-75 hover-white transition"><i className="bi bi-youtube fs-5"></i></a>
                        </div>
                    </Col>

                    {/* Columna 2: Comprar */}
                    <Col md={2} lg={2} xs={6}>
                        <h6 className="fw-bold mb-3 text-primary small text-uppercase spacing-1">Comprar</h6>
                        <ul className="list-unstyled small text-white-50 d-flex flex-column gap-2">
                            <li><Link to="/catalogo" className="text-decoration-none text-reset hover-white transition">Catálogo General</Link></li>
                            <li><Link to="/catalogo?categoria=ofertas" className="text-decoration-none text-reset hover-white transition">Ofertas</Link></li>
                            <li><Link to="/track" className="text-decoration-none text-reset hover-white transition">Rastrea tu Pedido</Link></li>
                            <li><Link to="/info/pagos" className="text-decoration-none text-reset hover-white transition">Métodos de Pago</Link></li>
                        </ul>
                    </Col>

                    {/* Columna 3: Ayuda */}
                    <Col md={2} lg={2} xs={6}>
                        <h6 className="fw-bold mb-3 text-primary small text-uppercase spacing-1">Ayuda</h6>
                        <ul className="list-unstyled small text-white-50 d-flex flex-column gap-2">
                            <li><Link to="/info/soporte" className="text-decoration-none text-reset hover-white transition">Centro de Ayuda</Link></li>
                            <li><Link to="/info/politica-devoluciones" className="text-decoration-none text-reset hover-white transition">Cambios y Devoluciones</Link></li>
                            <li><Link to="/info/terminos" className="text-decoration-none text-reset hover-white transition">Términos y Condiciones</Link></li>
                            <li><Link to="/info/privacidad" className="text-decoration-none text-reset hover-white transition">Política de Privacidad</Link></li>
                            <li><Link to="/cliente/libro-reclamaciones" className="text-decoration-none text-reset hover-white transition"><i className="bi bi-book me-1"></i>Libro de Reclamaciones</Link></li>
                        </ul>
                    </Col>

                    {/* Columna 4: Contacto */}
                    <Col md={4} lg={4}>
                        <h6 className="fw-bold mb-3 text-primary small text-uppercase spacing-1">Contáctanos</h6>
                        <ul className="list-unstyled small text-white-50 d-flex flex-column gap-3">
                            <li className="d-flex">
                                <i className="bi bi-geo-alt me-3 text-primary mt-1"></i>
                                <span>Av. Principal 123<br/>Arequipa, Perú</span>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-envelope me-3 text-primary"></i>
                                <a href="mailto:contacto@macrosur.com" className="text-reset text-decoration-none hover-white">contacto@macrosur.com</a>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-telephone me-3 text-primary"></i>
                                <span>(054) 123-4567 / +51 987 654 321</span>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-clock me-3 text-primary"></i>
                                <span>Lun - Sab: 8:00 am - 7:00 pm</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                {/* Sección Inferior: Copyright y Pagos */}
                <div className="border-top border-secondary pt-4 mt-5">
                    <Row className="align-items-center gy-3">
                        <Col md={6} className="text-center text-md-start">
                            <small className="text-white-50">
                                &copy; {new Date().getFullYear()} MACROSUR E-commerce SAC. Todos los derechos reservados.
                            </small>
                        </Col>
                        <Col md={6} className="text-center text-md-end">
                            <div className="d-inline-flex gap-3 align-items-center opacity-75 grayscale-hover transition">
                                <i className="bi bi-credit-card-2-front fs-3" title="Visa/Mastercard"></i>
                                <i className="bi bi-cash-coin fs-3" title="Efectivo"></i>
                                <i className="bi bi-qr-code fs-3" title="Yape/Plin"></i>
                                <i className="bi bi-bank fs-3" title="Transferencia Bancaria"></i>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;