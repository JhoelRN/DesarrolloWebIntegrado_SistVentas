import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';

const AddressBookPage = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    alias: '',
    calle: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigoPostal: ''
  });

  useEffect(() => {
    // TODO: Cargar direcciones desde API
    setDirecciones([
      {
        id: 1,
        alias: 'Casa',
        calle: 'Av. Principal 123',
        comuna: 'Providencia',
        ciudad: 'Santiago',
        region: 'Región Metropolitana',
        principal: true
      }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Funcionalidad en desarrollo');
    setShowModal(false);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-geo-alt me-2"></i>Mis Direcciones</h2>
          <p className="text-muted">Gestiona tus direcciones de envío</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>Agregar Dirección
          </Button>
        </Col>
      </Row>

      {direcciones.length === 0 ? (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          No tienes direcciones guardadas. Agrega una para facilitar tus compras.
        </Alert>
      ) : (
        <Row>
          {direcciones.map(dir => (
            <Col md={6} key={dir.id} className="mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{dir.alias}</h5>
                    {dir.principal && <span className="badge bg-success">Principal</span>}
                  </div>
                  <p className="mb-1">{dir.calle}</p>
                  <p className="mb-1">{dir.comuna}, {dir.ciudad}</p>
                  <p className="text-muted mb-3">{dir.region}</p>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-pencil"></i> Editar
                    </Button>
                    {!dir.principal && (
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-trash"></i> Eliminar
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Dirección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Alias</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Casa, Trabajo, Casa de mis padres"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calle y Número</Form.Label>
              <Form.Control
                type="text"
                placeholder="Av. Principal 123, Depto 45"
                value={formData.calle}
                onChange={(e) => setFormData({...formData, calle: e.target.value})}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.comuna}
                    onChange={(e) => setFormData({...formData, comuna: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100">
              Guardar Dirección
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddressBookPage;