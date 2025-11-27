import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const CustomersPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteResenas, setClienteResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
  }, [searchTerm, clientes]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Endpoint para listar todos los clientes (solo admin)
      const response = await axios.get(`${API_URL}/clientes`, {
        headers: {
          'X-Is-Admin': 'true'
        }
      });

      setClientes(response.data);
      setFilteredClientes(response.data);

    } catch (err) {
      console.error('Error cargando clientes:', err);
      setError('Error al cargar los clientes. Este endpoint requiere permisos de administrador.');
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalle = async (cliente) => {
    setClienteSeleccionado(cliente);
    setShowDetailModal(true);
    
    // Cargar reseñas del cliente
    try {
      setLoadingResenas(true);
      const response = await axios.get(`${API_URL}/resenas/cliente/${cliente.clienteId}`, {
        headers: {
          'X-Is-Admin': 'true'
        }
      });
      setClienteResenas(response.data);
    } catch (err) {
      console.error('Error cargando reseñas del cliente:', err);
      setClienteResenas([]);
    } finally {
      setLoadingResenas(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Clientes</h2>
          <p className="text-muted">
            Vista de solo lectura de los clientes registrados en la plataforma
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="outline-primary" onClick={cargarClientes}>
            🔄 Actualizar
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            Clientes Registrados ({filteredClientes.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredClientes.length === 0 ? (
            <Alert variant="info" className="mb-0">
              {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda' : 'No hay clientes registrados'}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Avatar</th>
                    <th>Nombre Completo</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Fecha Registro</th>
                    <th>Método Login</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map(cliente => (
                    <tr key={cliente.clienteId}>
                      <td>{cliente.clienteId}</td>
                      <td>
                        {cliente.avatarUrl ? (
                          <img 
                            src={cliente.avatarUrl} 
                            alt={cliente.nombre}
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {cliente.nombre?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{cliente.nombre} {cliente.apellido}</strong>
                      </td>
                      <td>{cliente.correo}</td>
                      <td>{cliente.telefono || '-'}</td>
                      <td>
                        {new Date(cliente.fechaRegistro).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        {cliente.oauthProvider ? (
                          <Badge bg="info">
                            {cliente.oauthProvider === 'google' ? 'Google' : 'Microsoft'}
                          </Badge>
                        ) : (
                          <Badge bg="secondary">Manual</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => abrirDetalle(cliente)}
                        >
                          👁️ Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Detalle de Cliente */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clienteSeleccionado && (
            <div>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  {clienteSeleccionado.avatarUrl ? (
                    <img 
                      src={clienteSeleccionado.avatarUrl} 
                      alt={clienteSeleccionado.nombre}
                      className="rounded-circle mb-2"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                    >
                      {clienteSeleccionado.nombre?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {clienteSeleccionado.oauthProvider && (
                    <Badge bg="info">
                      {clienteSeleccionado.oauthProvider === 'google' ? 'Google' : 'Microsoft'}
                    </Badge>
                  )}
                </Col>
                <Col md={9}>
                  <h4>{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</h4>
                  <p className="text-muted mb-3">{clienteSeleccionado.correo}</p>
                  
                  <Row className="mb-2">
                    <Col sm={4}><strong>ID:</strong></Col>
                    <Col>{clienteSeleccionado.clienteId}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}><strong>Teléfono:</strong></Col>
                    <Col>{clienteSeleccionado.telefono || 'No especificado'}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}><strong>Fecha Registro:</strong></Col>
                    <Col>
                      {new Date(clienteSeleccionado.fechaRegistro).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Col>
                  </Row>
                  {clienteSeleccionado.oauthProvider && (
                    <Row className="mb-2">
                      <Col sm={4}><strong>OAuth ID:</strong></Col>
                      <Col><code>{clienteSeleccionado.oauthId}</code></Col>
                    </Row>
                  )}
                </Col>
              </Row>

              <hr />

              <h5 className="mb-3">Reseñas del Cliente ({clienteResenas.length})</h5>
              
              {loadingResenas ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : clienteResenas.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  Este cliente no ha escrito ninguna reseña
                </Alert>
              ) : (
                <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {clienteResenas.map(resena => (
                    <Card key={resena.resenaId} className="border">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>{resena.productoNombre}</strong>
                            <div className="text-warning">
                              {'★'.repeat(resena.calificacion)}{'☆'.repeat(5 - resena.calificacion)}
                            </div>
                          </div>
                          <Badge bg={
                            resena.estadoResena === 'Aprobada' ? 'success' :
                            resena.estadoResena === 'Rechazada' ? 'danger' : 'warning'
                          }>
                            {resena.estadoResena}
                          </Badge>
                        </div>
                        <p className="mb-1 small">{resena.comentario}</p>
                        <small className="text-muted">
                          {new Date(resena.fechaResena).toLocaleDateString('es-PE')}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Alert variant="warning" className="mb-0 w-100 small">
            ℹ️ <strong>Nota:</strong> Los datos del cliente no pueden ser modificados sin su consentimiento. 
            Esta es una vista de solo lectura para verificación administrativa.
          </Alert>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomersPage;