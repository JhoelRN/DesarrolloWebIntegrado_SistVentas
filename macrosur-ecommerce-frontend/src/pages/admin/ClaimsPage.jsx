import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { enviarReclamo } from '../../api/claims';

const ClaimsPage = () => {
  const [formData, setFormData] = useState({
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    domicilio: '',
    tipoReclamo: 'Reclamo', // Reclamo o Queja
    detalle: '',
    pedidoRelacionado: '',
    montoReclamado: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Enviar al backend
      const resultado = await enviarReclamo(formData);
      setSuccess(`Su reclamo ha sido registrado con el código: ${resultado.reclamoId || 'REC-' + Date.now().toString().slice(-6)}`);
      setFormData({ // Limpiar formulario
        tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidoPaterno: '',
        apellidoMaterno: '', telefono: '', email: '', domicilio: '',
        tipoReclamo: 'Reclamo', detalle: '', pedidoRelacionado: '', montoReclamado: ''
      });
    } catch (err) {
      setError('Hubo un problema al enviar su reclamo. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white text-center py-3">
              <h3 className="mb-0"><i className="bi bi-book-half me-2"></i>Libro de Reclamaciones</h3>
              <small>Conforme al Código de Protección y Defensa del Consumidor</small>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <p className="text-muted">
                  MACROSUR E-COMMERCE S.A.C. <br/>
                  RUC: 20123456789 <br/>
                  Av. Principal 123, Arequipa, Perú
                </p>
              </div>

              {success && <Alert variant="success" className="text-center"><h4><i className="bi bi-check-circle me-2"></i>¡Registrado!</h4>{success}<br/>Se ha enviado una copia a su correo.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {!success && (
                <Form onSubmit={handleSubmit}>
                  <h5 className="border-bottom pb-2 mb-3 text-primary">1. Identificación del Consumidor</h5>
                  <Row className="g-3 mb-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Tipo Doc.</Form.Label>
                        <Form.Select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                          <option>DNI</option>
                          <option>CE</option>
                          <option>Pasaporte</option>
                          <option>RUC</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>N° Documento *</Form.Label>
                        <Form.Control required name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Nombres *</Form.Label>
                        <Form.Control required name="nombres" value={formData.nombres} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Apellido Paterno *</Form.Label>
                        <Form.Control required name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Apellido Materno *</Form.Label>
                        <Form.Control required name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Teléfono / Celular *</Form.Label>
                        <Form.Control required name="telefono" value={formData.telefono} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email *</Form.Label>
                        <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Domicilio *</Form.Label>
                        <Form.Control required name="domicilio" value={formData.domicilio} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="border-bottom pb-2 mb-3 text-primary">2. Detalle de la Reclamación</h5>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tipo *</Form.Label>
                        <div className="d-flex gap-3">
                          <Form.Check 
                            type="radio" label="Reclamo (Disconformidad producto/servicio)" 
                            name="tipoReclamo" value="Reclamo" 
                            checked={formData.tipoReclamo === 'Reclamo'} onChange={handleChange} 
                          />
                          <Form.Check 
                            type="radio" label="Queja (Malestar atención)" 
                            name="tipoReclamo" value="Queja" 
                            checked={formData.tipoReclamo === 'Queja'} onChange={handleChange} 
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Monto Reclamado (S/)</Form.Label>
                        <Form.Control type="number" name="montoReclamado" value={formData.montoReclamado} onChange={handleChange} placeholder="0.00" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Producto o Servicio Contratado / N° Pedido</Form.Label>
                        <Form.Control name="pedidoRelacionado" value={formData.pedidoRelacionado} onChange={handleChange} placeholder="Ej: Silla Gamer - Pedido #1234" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Detalle del Reclamo o Queja *</Form.Label>
                        <Form.Control required as="textarea" rows={4} name="detalle" value={formData.detalle} onChange={handleChange} placeholder="Describa los hechos..." />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid mt-4">
                    <Button variant="primary" size="lg" type="submit" disabled={loading}>
                      {loading ? <><Spinner size="sm" animation="border" className="me-2"/>Enviando...</> : 'Enviar Hoja de Reclamación'}
                    </Button>
                  </div>
                  <p className="text-muted small text-center mt-3">
                    Al enviar este formulario, usted acepta nuestra Política de Privacidad y el tratamiento de sus datos personales para la gestión de su reclamo.
                  </p>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClaimsPage;