import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Badge, ListGroup } from 'react-bootstrap';

const TrackOrderPage = () => {
  const [numeroGuia, setNumeroGuia] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (!numeroGuia.trim()) {
      setError('Por favor, ingresa un número de guía');
      return;
    }
    
    setCargando(true);
    setError('');
    setResultado(null);
    
    try {
      const response = await fetch(`http://localhost:8081/api/seguimientos-despacho/tracking/${numeroGuia}`);
      
      if (response.ok) {
        const data = await response.json();
        setResultado(data);
      } else if (response.status === 404) {
        setError('No se encontró ningún pedido con ese número de guía');
      } else {
        setError('Error al buscar el pedido. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu red e intenta nuevamente.');
      console.error('Error al buscar seguimiento:', err);
    } finally {
      setCargando(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'EN_BODEGA': { variant: 'secondary', texto: 'En Bodega' },
      'EN_TRANSITO': { variant: 'info', texto: 'En Tránsito' },
      'EN_REPARTO': { variant: 'primary', texto: 'En Reparto' },
      'ENTREGADO': { variant: 'success', texto: 'Entregado' },
      'DEVUELTO': { variant: 'warning', texto: 'Devuelto' },
      'EXTRAVIADO': { variant: 'danger', texto: 'Extraviado' }
    };
    
    const config = estados[estado] || { variant: 'secondary', texto: estado };
    return <Badge bg={config.variant}>{config.texto}</Badge>;
  };

  return (
    <Container className="py-5" style={{ marginTop: '150px' }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Rastrea tu Pedido
          </h2>
          
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleBuscar}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Guía de Despacho</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 1234567890"
                    value={numeroGuia}
                    onChange={(e) => setNumeroGuia(e.target.value)}
                    disabled={cargando}
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Ingresa el número de guía que recibiste en tu correo electrónico
                  </Form.Text>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={cargando}
                  className="w-100"
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Buscar Pedido
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          
          {resultado && (
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>
                  Información del Pedido
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Número de Guía:</strong>
                    <p className="text-primary fs-5">{resultado.numeroGuia}</p>
                  </Col>
                  <Col md={6}>
                    <strong>Estado Actual:</strong>
                    <p className="fs-5">{getEstadoBadge(resultado.estadoEnvio)}</p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Operador Logístico:</strong>
                    <p>{resultado.operadorLogistico?.nombre || 'No asignado'}</p>
                  </Col>
                  <Col md={6}>
                    <strong>Teléfono:</strong>
                    <p>{resultado.operadorLogistico?.telefono || 'No disponible'}</p>
                  </Col>
                </Row>

                {resultado.fechaDespacho && (
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Fecha de Despacho:</strong>
                      <p>{new Date(resultado.fechaDespacho).toLocaleDateString('es-CL')}</p>
                    </Col>
                    {resultado.fechaEntrega && (
                      <Col md={6}>
                        <strong>Fecha de Entrega:</strong>
                        <p>{new Date(resultado.fechaEntrega).toLocaleDateString('es-CL')}</p>
                      </Col>
                    )}
                  </Row>
                )}

                {resultado.direccionDestino && (
                  <Row className="mb-3">
                    <Col>
                      <strong>Dirección de Entrega:</strong>
                      <p className="mb-0">{resultado.direccionDestino}</p>
                      {resultado.comunaDestino && resultado.regionDestino && (
                        <p className="text-muted">
                          {resultado.comunaDestino}, {resultado.regionDestino}
                        </p>
                      )}
                    </Col>
                  </Row>
                )}

                {resultado.observaciones && (
                  <Alert variant="info">
                    <strong>Observaciones:</strong>
                    <p className="mb-0 mt-2">{resultado.observaciones}</p>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Información adicional */}
          <Card className="mt-4 bg-light">
            <Card.Body>
              <h6 className="fw-bold">¿Necesitas ayuda?</h6>
              <p className="mb-1 small">
                <i className="bi bi-telephone me-2"></i>
                Llámanos al: <strong>+56 2 1234 5678</strong>
              </p>
              <p className="mb-0 small">
                <i className="bi bi-envelope me-2"></i>
                Escríbenos a: <strong>soporte@macrosur.cl</strong>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrackOrderPage;
