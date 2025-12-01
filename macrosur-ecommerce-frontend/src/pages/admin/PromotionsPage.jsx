import React from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge } from 'react-bootstrap';

const PromotionsPage = () => {
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2>Campañas y Descuentos</h2>
            <p className="text-muted mb-0">Gestiona cupones y banners promocionales</p>
        </div>
        <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>Nueva Campaña</Button>
      </div>

      <Row>
        <h5 className="mb-3 text-muted">Activas Ahora</h5>
        {/* Tarjeta de Campaña Activa */}
        <Col md={6} lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
                <div className="position-relative">
                    <Card.Img variant="top" src="https://placehold.co/600x250/007bff/ffffff?text=Cyber+Days" style={{height: '160px', objectFit: 'cover'}} />
                    <Badge bg="success" className="position-absolute top-0 end-0 m-3">En Curso</Badge>
                </div>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0">Cyber Days 2025</h5>
                        <small className="text-muted">ID: CAMP-001</small>
                    </div>
                    <p className="text-muted small">Descuentos del 30% en toda la categoría Tecnología y Muebles.</p>
                    
                    <div className="mb-3 bg-light p-2 rounded">
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                            <span>Rendimiento del Cupón</span>
                            <span>450 / 1000 usos</span>
                        </div>
                        <ProgressBar now={45} variant="primary" style={{height: '6px'}} />
                    </div>
                    
                    <Row className="g-2 small text-muted">
                        <Col xs={6}><i className="bi bi-calendar-check me-1"></i>Inicio: 25 Nov</Col>
                        <Col xs={6}><i className="bi bi-calendar-x me-1"></i>Fin: 30 Nov</Col>
                        <Col xs={6}><i className="bi bi-ticket-perforated me-1"></i>Cupón: <strong>CYBER30</strong></Col>
                        <Col xs={6}><i className="bi bi-percent me-1"></i>Dscto: 30%</Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0 pb-3">
                    <div className="d-grid gap-2">
                        <Button variant="outline-primary">Gestionar Productos</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Col>

        {/* Tarjeta de Campaña Programada */}
        <Col md={6} lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
                <div className="position-relative">
                    <Card.Img variant="top" src="https://placehold.co/600x250/dc3545/ffffff?text=Navidad+2025" style={{height: '160px', objectFit: 'cover', filter: 'grayscale(30%)'}} />
                    <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-3">Programada</Badge>
                </div>
                <Card.Body>
                    <h5 className="fw-bold">Navidad 2025</h5>
                    <p className="text-muted small">Campaña de fin de año. Envío gratis en todo el sitio.</p>
                    
                    <div className="alert alert-warning border-0 py-2 px-3 small d-flex align-items-center">
                        <i className="bi bi-clock-history me-2 fs-5"></i>
                        <div>Inicia en <strong>25 días</strong><br/>Programado para 15 Dic</div>
                    </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0 pb-3">
                    <div className="d-grid gap-2">
                        <Button variant="outline-secondary">Editar Configuración</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Col>

         {/* Tarjeta de Crear Nueva */}
         <Col md={6} lg={4} className="mb-4">
            <Card className="border-2 border-dashed h-100 d-flex align-items-center justify-content-center bg-light" style={{borderStyle: 'dashed', minHeight: '350px'}}>
                <div className="text-center text-muted p-4">
                    <div className="mb-3 display-4 text-secondary opacity-50"><i className="bi bi-plus-circle"></i></div>
                    <h5>Crear Nueva Campaña</h5>
                    <p className="small">Configura descuentos, cupones o banners temporales.</p>
                    <Button variant="primary" size="sm" className="mt-2">Comenzar</Button>
                </div>
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PromotionsPage;