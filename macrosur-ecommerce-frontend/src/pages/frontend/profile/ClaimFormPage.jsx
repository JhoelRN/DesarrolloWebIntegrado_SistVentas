import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClaimFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pedidoId: '',
    tipoReclamo: '',
    descripcion: '',
    adjunto: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const tiposReclamo = [
    'Producto defectuoso',
    'Producto incorrecto',
    'Producto no llegó',
    'Producto dañado',
    'Problema con envío',
    'Otro'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.pedidoId || !formData.tipoReclamo || !formData.descripcion) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    // TODO: Enviar reclamo a la API
    console.log('Reclamo enviado:', formData);
    setSuccess(true);

    setTimeout(() => {
      navigate('/profile/orders');
    }, 2000);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">
                <i className="bi bi-file-earmark-text me-2"></i>
                Presentar Reclamo
              </h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  <i className="bi bi-check-circle me-2"></i>
                  Reclamo enviado exitosamente. Serás redirigido...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Pedido *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ej: 12345"
                    value={formData.pedidoId}
                    onChange={(e) => setFormData({...formData, pedidoId: e.target.value})}
                    required
                  />
                  <Form.Text className="text-muted">
                    Puedes encontrarlo en tu historial de pedidos
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Reclamo *</Form.Label>
                  <Form.Select
                    value={formData.tipoReclamo}
                    onChange={(e) => setFormData({...formData, tipoReclamo: e.target.value})}
                    required
                  >
                    <option value="">Selecciona un tipo...</option>
                    {tiposReclamo.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción del Reclamo *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe detalladamente tu reclamo..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Adjuntar Evidencia (Opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFormData({...formData, adjunto: e.target.files[0]})}
                  />
                  <Form.Text className="text-muted">
                    Puedes adjuntar fotos o documentos (máx. 5MB)
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                  </Button>
                  <Button variant="primary" type="submit">
                    <i className="bi bi-send me-2"></i>
                    Enviar Reclamo
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClaimFormPage;