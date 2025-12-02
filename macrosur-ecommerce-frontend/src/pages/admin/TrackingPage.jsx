import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { crearSeguimiento, obtenerTodosSeguimientos, actualizarEstadoEnvio } from '../../api/tracking';
import { obtenerOperadores } from '../../api/logistics';
import { FaTruck, FaPlus, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

const TrackingPage = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [crearForm, setCrearForm] = useState({
    pedidoId: '',
    operadorId: '',
    numeroGuia: '',
    fechaEstimadaEntrega: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [seguimientosData, operadoresData] = await Promise.all([
        obtenerTodosSeguimientos(),
        obtenerOperadores()
      ]);
      setSeguimientos(seguimientosData);
      setOperadores(operadoresData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSeguimiento = async () => {
    try {
      const data = {
        pedidoId: parseInt(crearForm.pedidoId),
        operadorId: parseInt(crearForm.operadorId),
        numeroGuia: crearForm.numeroGuia,
        fechaEstimadaEntrega: crearForm.fechaEstimadaEntrega || null
      };
      
      await crearSeguimiento(data);
      setShowCrearModal(false);
      setCrearForm({
        pedidoId: '',
        operadorId: '',
        numeroGuia: '',
        fechaEstimadaEntrega: ''
      });
      cargarDatos();
      alert('Seguimiento creado exitosamente');
    } catch (err) {
      alert('Error al crear seguimiento: ' + err.message);
    }
  };

  const handleActualizarEstado = async (seguimientoId, nuevoEstado) => {
    try {
      await actualizarEstadoEnvio(seguimientoId, nuevoEstado);
      cargarDatos();
      alert('Estado actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'En Camino': <Badge bg="primary">En Camino</Badge>,
      'En Distribución': <Badge bg="info">En Distribución</Badge>,
      'Entregado': <Badge bg="success">Entregado</Badge>,
      'Fallido': <Badge bg="danger">Fallido</Badge>
    };
    return badges[estado] || <Badge bg="secondary">{estado}</Badge>;
  };

  const seguimientosFiltrados = seguimientos.filter(s => 
    s.numeroGuia.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.pedidoId.toString().includes(busqueda) ||
    s.nombreOperador.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <Container><p>Cargando seguimientos...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaTruck /> Seguimiento de Envíos</h2>
          <p className="text-muted">Gestiona el tracking de pedidos con operadores logísticos</p>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setShowCrearModal(true)}>
            <FaPlus /> Nuevo Seguimiento
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por número de guía, ID pedido u operador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Operador</th>
                <th>Número de Guía</th>
                <th>Estado</th>
                <th>Fecha Asignación</th>
                <th>Entrega Estimada</th>
                <th>Entrega Real</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {seguimientosFiltrados.map((seguimiento) => (
                <tr key={seguimiento.seguimientoDespachoId}>
                  <td><code>#{seguimiento.pedidoId}</code></td>
                  <td>
                    <strong>{seguimiento.nombreOperador}</strong>
                  </td>
                  <td>
                    <code>{seguimiento.numeroGuia}</code>
                    <br/>
                    <a 
                      href={seguimiento.urlRastreoCompleta} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="small"
                    >
                      <FaExternalLinkAlt /> Ver en sitio operador
                    </a>
                  </td>
                  <td>{getEstadoBadge(seguimiento.estadoEnvio)}</td>
                  <td>{new Date(seguimiento.fechaAsignacion).toLocaleDateString()}</td>
                  <td>
                    {seguimiento.fechaEstimadaEntrega 
                      ? new Date(seguimiento.fechaEstimadaEntrega).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {seguimiento.fechaEntregaReal 
                      ? new Date(seguimiento.fechaEntregaReal).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {seguimiento.estadoEnvio === 'En Camino' && (
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleActualizarEstado(seguimiento.seguimientoDespachoId, 'EN_DISTRIBUCION')}
                      >
                        En Distribución
                      </Button>
                    )}
                    {seguimiento.estadoEnvio === 'En Distribución' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleActualizarEstado(seguimiento.seguimientoDespachoId, 'ENTREGADO')}
                        >
                          Entregado
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleActualizarEstado(seguimiento.seguimientoDespachoId, 'FALLIDO')}
                        >
                          Fallido
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Crear Seguimiento */}
      <Modal show={showCrearModal} onHide={() => setShowCrearModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Seguimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID del Pedido</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 123"
                value={crearForm.pedidoId}
                onChange={(e) => setCrearForm({ ...crearForm, pedidoId: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Operador Logístico</Form.Label>
              <Form.Select
                value={crearForm.operadorId}
                onChange={(e) => setCrearForm({ ...crearForm, operadorId: e.target.value })}
              >
                <option value="">Seleccione operador...</option>
                {operadores.map(op => (
                  <option key={op.operadorId} value={op.operadorId}>
                    {op.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Guía</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: CHX123456789"
                value={crearForm.numeroGuia}
                onChange={(e) => setCrearForm({ ...crearForm, numeroGuia: e.target.value })}
              />
              <Form.Text>Número de tracking proporcionado por el operador</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Estimada de Entrega (Opcional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={crearForm.fechaEstimadaEntrega}
                onChange={(e) => setCrearForm({ ...crearForm, fechaEstimadaEntrega: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCrearModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearSeguimiento}>
            Crear Seguimiento
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TrackingPage;
