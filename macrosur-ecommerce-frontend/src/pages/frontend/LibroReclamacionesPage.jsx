import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const LibroReclamacionesPage = () => {
  const [formData, setFormData] = useState({
    // Datos del consumidor
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
    // Datos del bien/servicio
    tipoReclamo: 'RECLAMO',
    tipoProducto: 'PRODUCTO',
    descripcionProducto: '',
    montoReclamado: '',
    // Detalle del reclamo
    detalleReclamo: '',
    pedidoSolicitud: '',
    fechaIncidente: ''
  });

  const [enviado, setEnviado] = useState(false);
  const [numeroReclamo, setNumeroReclamo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío del formulario
    const nroReclamo = `REC-${Date.now()}`;
    setNumeroReclamo(nroReclamo);
    setEnviado(true);
    
    // En producción, aquí se enviaría al backend
    console.log('Reclamo enviado:', formData);
  };

  if (enviado) {
    return (
      <Container className="py-5" style={{ marginTop: '150px' }}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Alert variant="success" className="text-center">
              <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
              <h3 className="mt-3">¡Reclamo Registrado Exitosamente!</h3>
              <p className="mb-3">
                Tu reclamo ha sido registrado con el número: <strong>{numeroReclamo}</strong>
              </p>
              <p className="mb-3">
                Según la normativa del SERNAC, tenemos un plazo de <strong>30 días hábiles</strong> para 
                responderte. Te contactaremos al email registrado.
              </p>
              <Button variant="primary" onClick={() => {
                setEnviado(false);
                setFormData({
                  tipoDocumento: 'DNI',
                  numeroDocumento: '',
                  nombres: '',
                  apellidos: '',
                  telefono: '',
                  email: '',
                  direccion: '',
                  tipoReclamo: 'RECLAMO',
                  tipoProducto: 'PRODUCTO',
                  descripcionProducto: '',
                  montoReclamado: '',
                  detalleReclamo: '',
                  pedidoSolicitud: '',
                  fechaIncidente: ''
                });
              }}>
                Hacer otro reclamo
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '150px' }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h3 className="mb-0">
                <i className="bi bi-book me-2"></i>
                Libro de Reclamaciones
              </h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <strong>Información importante:</strong> Este libro de reclamaciones cumple con lo dispuesto 
                en la Ley N° 19.496 de Protección de los Derechos de los Consumidores. La empresa responderá 
                tu reclamo en un plazo máximo de 30 días hábiles.
              </Alert>

              <Form onSubmit={handleSubmit}>
                {/* Identificación del Consumidor */}
                <h5 className="border-bottom pb-2 mb-3">1. Identificación del Consumidor</h5>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Documento *</Form.Label>
                      <Form.Select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required
                      >
                        <option value="DNI">DNI/RUT</option>
                        <option value="CE">Carnet de Extranjería</option>
                        <option value="PASAPORTE">Pasaporte</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Documento *</Form.Label>
                      <Form.Control
                        type="text"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        placeholder="Ej: 12.345.678-9"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellidos *</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Dirección Completa *</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, comuna, región"
                    required
                  />
                </Form.Group>

                {/* Identificación del Bien o Servicio */}
                <h5 className="border-bottom pb-2 mb-3">2. Identificación del Bien o Servicio Contratado</h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Solicitud *</Form.Label>
                      <Form.Select
                        name="tipoReclamo"
                        value={formData.tipoReclamo}
                        onChange={handleChange}
                        required
                      >
                        <option value="RECLAMO">Reclamo</option>
                        <option value="QUEJA">Queja</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        <strong>Reclamo:</strong> Disconformidad con producto/servicio | 
                        <strong> Queja:</strong> Malestar por atención
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo *</Form.Label>
                      <Form.Select
                        name="tipoProducto"
                        value={formData.tipoProducto}
                        onChange={handleChange}
                        required
                      >
                        <option value="PRODUCTO">Producto</option>
                        <option value="SERVICIO">Servicio</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción del Producto/Servicio *</Form.Label>
                  <Form.Control
                    type="text"
                    name="descripcionProducto"
                    value={formData.descripcionProducto}
                    onChange={handleChange}
                    placeholder="Nombre del producto o servicio adquirido"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Monto Reclamado (opcional)</Form.Label>
                      <Form.Control
                        type="number"
                        name="montoReclamado"
                        value={formData.montoReclamado}
                        onChange={handleChange}
                        placeholder="$"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Pedido (opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="pedidoSolicitud"
                        value={formData.pedidoSolicitud}
                        onChange={handleChange}
                        placeholder="Ej: ORD-12345"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Fecha del Incidente</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaIncidente"
                    value={formData.fechaIncidente}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Detalle del Reclamo */}
                <h5 className="border-bottom pb-2 mb-3">3. Detalle del Reclamo o Queja</h5>

                <Form.Group className="mb-4">
                  <Form.Label>Describe tu reclamo o queja *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="detalleReclamo"
                    value={formData.detalleReclamo}
                    onChange={handleChange}
                    placeholder="Explica detalladamente tu situación, incluyendo fechas, nombres de productos, y cualquier información relevante..."
                    required
                  />
                  <Form.Text className="text-muted">
                    Mínimo 50 caracteres. Sé lo más específico posible.
                  </Form.Text>
                </Form.Group>

                {/* Información Legal */}
                <Alert variant="warning">
                  <strong>Importante:</strong>
                  <ul className="mb-0 mt-2">
                    <li>La empresa tiene 30 días hábiles para responder tu reclamo</li>
                    <li>Recibirás una copia de este formulario en tu email</li>
                    <li>Puedes presentar tu reclamo también ante el SERNAC</li>
                    <li>Todos los campos marcados con (*) son obligatorios</li>
                  </ul>
                </Alert>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Declaro que la información proporcionada es veraz y acepto que sea procesada conforme a la Ley de Protección de Datos Personales"
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="danger" type="submit" size="lg">
                    <i className="bi bi-send me-2"></i>
                    Enviar Reclamo
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => window.history.back()}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Información adicional */}
          <Card className="mt-4 bg-light">
            <Card.Body>
              <h6 className="fw-bold">Datos de la Empresa</h6>
              <p className="mb-1"><strong>Razón Social:</strong> MACROSUR E-Commerce SpA</p>
              <p className="mb-1"><strong>RUT:</strong> 76.123.456-7</p>
              <p className="mb-1"><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
              <p className="mb-1"><strong>Teléfono:</strong> +56 2 1234 5678</p>
              <p className="mb-3"><strong>Email:</strong> reclamos@macrosur.cl</p>
              
              <h6 className="fw-bold">SERNAC</h6>
              <p className="mb-0">
                Si no estás conforme con nuestra respuesta, puedes presentar tu reclamo ante el 
                Servicio Nacional del Consumidor (SERNAC) en <strong>www.sernac.cl</strong> o llamando 
                al <strong>800 700 100</strong>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibroReclamacionesPage;
