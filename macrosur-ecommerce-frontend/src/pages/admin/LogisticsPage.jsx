import React from 'react';
import { Container, Card, Row, Col, Button, Badge, ListGroup } from 'react-bootstrap';

const LogisticsPage = () => {
  const enviosEnTransito = [
    { guia: 'OLVA-992382', destino: 'Cusco', cliente: 'Ana Torres', estado: 'En Ruta' },
    { guia: 'SHAL-110293', destino: 'Lima', cliente: 'Pedro Ruiz', estado: 'En Almacén Destino' },
    { guia: 'RAP-883721', destino: 'Arequipa', cliente: 'Luisa Gomez', estado: 'Reparto Final' },
  ];

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2>Operadores Logísticos</h2>
            <p className="text-muted mb-0">Gestión de envíos y couriers externos</p>
        </div>
        <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>Nuevo Envío</Button>
      </div>

      <Row className="g-4">
        {/* Tarjeta de Operador: Olva Courier */}
        <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="fw-bold text-warning">Olva Courier</h5>
                        <Badge bg="success">Activo</Badge>
                    </div>
                    <p className="text-muted small">Courier principal para envíos a nivel nacional.</p>
                    
                    <div className="d-flex justify-content-between small mb-2 border-bottom pb-2">
                        <span>Tiempo Promedio:</span>
                        <span className="fw-bold">2-3 días</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2 border-bottom pb-2">
                        <span>Tarifa Base:</span>
                        <span className="fw-bold">S/ 15.00</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                        <span>Envíos este mes:</span>
                        <span className="fw-bold">145</span>
                    </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0">
                    <Button variant="outline-secondary" size="sm" className="w-100">Configurar Tarifas</Button>
                </Card.Footer>
            </Card>
        </Col>

        {/* Tarjeta de Operador: Shalom */}
        <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="fw-bold text-primary">Shalom</h5>
                        <Badge bg="success">Activo</Badge>
                    </div>
                    <p className="text-muted small">Opción económica para paquetes pesados y provincias.</p>
                    
                    <div className="d-flex justify-content-between small mb-2 border-bottom pb-2">
                        <span>Tiempo Promedio:</span>
                        <span className="fw-bold">3-5 días</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2 border-bottom pb-2">
                        <span>Tarifa Base:</span>
                        <span className="fw-bold">S/ 10.00</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                        <span>Envíos este mes:</span>
                        <span className="fw-bold">89</span>
                    </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0">
                    <Button variant="outline-secondary" size="sm" className="w-100">Configurar Tarifas</Button>
                </Card.Footer>
            </Card>
        </Col>

        {/* Panel de Seguimiento Rápido */}
        <Col md={4}>
            <Card className="border-0 shadow-sm h-100 bg-light">
                <Card.Header className="bg-dark text-white">
                    <h6 className="mb-0"><i className="bi bi-geo-alt-fill me-2"></i>Envíos en Tránsito</h6>
                </Card.Header>
                <ListGroup variant="flush">
                    {enviosEnTransito.map((envio, index) => (
                        <ListGroup.Item key={index} className="bg-transparent">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fw-bold">{envio.guia}</div>
                                    <small className="text-muted">{envio.cliente} - {envio.destino}</small>
                                </div>
                                <Badge bg="info" text="dark" className="fw-normal">{envio.estado}</Badge>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Card.Body className="text-center pt-3">
                    <Button variant="link" size="sm">Ver rastreo completo</Button>
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogisticsPage;