import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Alert, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DevolucionesPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState('');
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la solicitud de devolución
    alert('Solicitud de devolución enviada. Te contactaremos pronto.');
    setMostrarFormulario(false);
    setNumeroPedido('');
    setMotivo('');
    setDescripcion('');
  };

  return (
    <Container className="py-5" style={{ marginTop: '150px' }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="text-center mb-4">
            <i className="bi bi-arrow-return-left me-2"></i>
            Política de Devoluciones y Cambios
          </h2>
          <p className="text-center text-muted mb-5">
            Tu satisfacción es nuestra prioridad. Conoce cómo realizar devoluciones y cambios.
          </p>

          {/* Información destacada */}
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <strong>Derecho a Retracto:</strong> Tienes <strong>10 días corridos</strong> desde la 
                recepción del producto para solicitar una devolución sin necesidad de dar explicaciones, 
                según la Ley del Consumidor chilena.
              </div>
            </div>
          </Alert>

          {/* Condiciones */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Condiciones para Devoluciones</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5 className="text-success">✓ Aceptamos devolución si:</h5>
                  <ul>
                    <li>El producto está sin uso y en perfecto estado</li>
                    <li>Conservas el empaque original completo</li>
                    <li>Tienes la boleta o factura de compra</li>
                    <li>No han pasado más de 10 días desde la recepción</li>
                    <li>El producto no está en la lista de excepciones</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h5 className="text-danger">✗ NO aceptamos devolución de:</h5>
                  <ul>
                    <li>Productos perecibles o de higiene personal</li>
                    <li>Productos personalizados o hechos a medida</li>
                    <li>Software o productos digitales descargados</li>
                    <li>Productos en liquidación (salvo defecto)</li>
                    <li>Artículos con signos evidentes de uso</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Proceso paso a paso */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">¿Cómo solicitar una devolución?</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    1
                  </div>
                  <h5 className="mt-3">Contacta</h5>
                  <p className="small">
                    Envía un email a <strong>devoluciones@macrosur.cl</strong> con tu número de pedido
                  </p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    2
                  </div>
                  <h5 className="mt-3">Validación</h5>
                  <p className="small">
                    Revisaremos tu solicitud en un plazo de 24-48 horas
                  </p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    3
                  </div>
                  <h5 className="mt-3">Envío</h5>
                  <p className="small">
                    Te enviaremos instrucciones para el retiro o devolución del producto
                  </p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    4
                  </div>
                  <h5 className="mt-3">Reembolso</h5>
                  <p className="small">
                    Una vez recibido, procesaremos tu reembolso en 5-10 días hábiles
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Preguntas Frecuentes */}
          <h4 className="mb-3">Preguntas Frecuentes sobre Devoluciones</h4>
          <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Quién paga el envío de la devolución?</Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Retracto (cambio de opinión):</strong> El cliente asume el costo del envío de devolución.
                </p>
                <p className="mb-0">
                  <strong>Producto defectuoso o error nuestro:</strong> MACROSUR cubre el 100% del costo de retiro 
                  y envío del producto de reemplazo.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Cuánto demora el reembolso?</Accordion.Header>
              <Accordion.Body>
                <p>Una vez que recibamos y verifiquemos el producto devuelto:</p>
                <ul>
                  <li><strong>Tarjeta de crédito/débito:</strong> 5-10 días hábiles</li>
                  <li><strong>Transferencia bancaria:</strong> 3-5 días hábiles</li>
                  <li><strong>WebPay:</strong> 7-14 días hábiles (según entidad emisora)</li>
                </ul>
                <p className="mb-0">Te notificaremos por email cuando procesemos el reembolso.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Puedo cambiar un producto por otro?</Accordion.Header>
              <Accordion.Body>
                <p>
                  Sí, puedes solicitar un cambio por otro producto de igual o mayor valor. Si es de mayor valor, 
                  deberás pagar la diferencia.
                </p>
                <p className="mb-0">
                  Si el nuevo producto es de menor valor, reembolsaremos la diferencia mediante el mismo medio 
                  de pago original.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>¿Qué hago si recibí un producto defectuoso?</Accordion.Header>
              <Accordion.Body>
                <p>Si detectas un defecto dentro de los primeros 7 días:</p>
                <ol>
                  <li>Contáctanos inmediatamente a soporte@macrosur.cl</li>
                  <li>Envía fotos del producto y del defecto</li>
                  <li>Te ofreceremos cambio inmediato o reembolso total</li>
                  <li>Coordinaremos el retiro sin costo para ti</li>
                </ol>
                <p className="mb-0">
                  Si el defecto aparece después, aplica la garantía legal (6 meses) o del fabricante.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>¿Puedo devolver un producto en oferta?</Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Sí</strong>, los productos en oferta tienen los mismos derechos de retracto (10 días).
                </p>
                <p className="mb-0">
                  Sin embargo, los productos marcados como <strong>"Liquidación Final"</strong> solo pueden 
                  devolverse si presentan defectos de fabricación.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>¿Qué pasa si rechacé el pedido al recibirlo?</Accordion.Header>
              <Accordion.Body>
                <p>
                  Si rechazaste el pedido en el momento de la entrega, procesaremos automáticamente el reembolso 
                  total una vez que el producto retorne a nuestras bodegas (generalmente 5-10 días hábiles).
                </p>
                <p className="mb-0">
                  No hay cargos adicionales por rechazo en entrega.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Formulario de solicitud */}
          {!mostrarFormulario ? (
            <Card className="shadow-sm text-center bg-light">
              <Card.Body>
                <h5 className="mb-3">¿Necesitas solicitar una devolución?</h5>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setMostrarFormulario(true)}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Solicitar Devolución
                </Button>
                <p className="text-muted mt-3 mb-0 small">
                  También puedes contactarnos directamente en: <strong>devoluciones@macrosur.cl</strong>
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Formulario de Solicitud de Devolución</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Pedido *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: ORD-12345"
                      value={numeroPedido}
                      onChange={(e) => setNumeroPedido(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      Puedes encontrarlo en el email de confirmación o en{' '}
                      <Link to="/mis-pedidos">Mis Pedidos</Link>
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Motivo de Devolución *</Form.Label>
                    <Form.Select
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un motivo</option>
                      <option value="retracto">Cambio de opinión (Retracto)</option>
                      <option value="defectuoso">Producto defectuoso</option>
                      <option value="incorrecto">Producto incorrecto enviado</option>
                      <option value="dañado">Producto dañado en envío</option>
                      <option value="expectativas">No cumple expectativas</option>
                      <option value="otro">Otro motivo</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Cuéntanos más detalles sobre tu solicitud..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </Form.Group>

                  <Alert variant="warning">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Importante:</strong> Una vez enviada la solicitud, nuestro equipo te contactará 
                    en 24-48 horas para validar la información y coordinar la devolución.
                  </Alert>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                      <i className="bi bi-send me-2"></i>
                      Enviar Solicitud
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => setMostrarFormulario(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Información de contacto */}
          <Card className="mt-4 bg-light">
            <Card.Body>
              <h6 className="fw-bold">¿Tienes dudas sobre devoluciones?</h6>
              <p className="mb-1 small">
                <i className="bi bi-telephone me-2"></i>
                Llámanos: <strong>+56 2 1234 5678</strong> (Lun-Vie 9:00-18:00)
              </p>
              <p className="mb-0 small">
                <i className="bi bi-envelope me-2"></i>
                Email: <strong>devoluciones@macrosur.cl</strong>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DevolucionesPage;
