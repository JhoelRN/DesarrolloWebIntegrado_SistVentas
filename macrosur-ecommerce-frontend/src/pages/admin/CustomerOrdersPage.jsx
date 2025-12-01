import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CustomerOrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal para asignar seguimiento
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [operadores, setOperadores] = useState([]);
  const [seguimientoData, setSeguimientoData] = useState({
    operadorId: '',
    numeroGuia: '',
    fechaEstimadaEntrega: ''
  });

  useEffect(() => {
    cargarPedidos();
    cargarOperadores();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/pedidos');
      setPedidos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar pedidos');
      setLoading(false);
    }
  };

  const cargarOperadores = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/logistica/operadores');
      setOperadores(response.data);
    } catch (err) {
      console.error('Error al cargar operadores:', err);
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:8081/api/pedidos/${pedidoId}/estado?estado=${nuevoEstado}`);
      cargarPedidos();
    } catch (err) {
      alert('Error al cambiar estado del pedido');
    }
  };

  const abrirModalSeguimiento = (pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
    setSeguimientoData({
      operadorId: '',
      numeroGuia: '',
      fechaEstimadaEntrega: ''
    });
  };

  const crearSeguimiento = async () => {
    try {
      const payload = {
        pedidoId: selectedPedido.pedidoId,
        operadorId: parseInt(seguimientoData.operadorId),
        numeroGuia: seguimientoData.numeroGuia,
        fechaEstimadaEntrega: seguimientoData.fechaEstimadaEntrega ? new Date(seguimientoData.fechaEstimadaEntrega).toISOString() : null
      };

      await axios.post('http://localhost:8081/api/logistica/seguimiento', payload);
      
      // Cambiar estado del pedido a DESPACHADO
      await cambiarEstadoPedido(selectedPedido.pedidoId, 'DESPACHADO');
      
      setShowModal(false);
      alert('Seguimiento creado exitosamente');
      cargarPedidos();
    } catch (err) {
      alert('Error al crear seguimiento: ' + (err.response?.data?.message || err.message));
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente Pago': 'warning',
      'Pagado': 'info',
      'En Preparacion': 'primary',
      'Despachado': 'success',
      'Entregado': 'success',
      'Cancelado': 'danger'
    };
    return <Badge bg={badges[estado] || 'secondary'}>{estado}</Badge>;
  };

  if (loading) {
    return (
      <Container fluid className="py-4 text-center">
        <Spinner animation="border" />
        <p>Cargando pedidos...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2><i className="bi bi-cart-check me-2"></i>Gestión de Pedidos de Clientes</h2>
      <p className="text-muted">Administra los pedidos realizados por los clientes en la tienda online</p>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {pedidos.length === 0 ? (
        <Alert variant="info">No hay pedidos registrados</Alert>
      ) : (
        <Table responsive hover className="mt-4">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Método Entrega</th>
              <th>Seguimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.pedidoId}>
                <td>#{pedido.pedidoId}</td>
                <td>Cliente {pedido.clienteId}</td>
                <td>{new Date(pedido.fechaPedido).toLocaleDateString('es-CL')}</td>
                <td>{getEstadoBadge(pedido.estado)}</td>
                <td>${pedido.totalFinal.toLocaleString('es-CL')}</td>
                <td>
                  <small>
                    {pedido.metodoEntrega === 'Domicilio' ? (
                      <><i className="bi bi-truck me-1"></i>Domicilio</>
                    ) : (
                      <><i className="bi bi-shop me-1"></i>Retiro en Tienda</>
                    )}
                  </small>
                </td>
                <td>
                  {pedido.seguimiento ? (
                    <div>
                      <small>
                        <strong>{pedido.seguimiento.numeroGuia}</strong><br />
                        {pedido.seguimiento.estadoEnvio}
                      </small>
                    </div>
                  ) : (
                    <Badge bg="secondary">Sin asignar</Badge>
                  )}
                </td>
                <td>
                  {pedido.estado === 'Pagado' && !pedido.seguimiento && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => abrirModalSeguimiento(pedido)}
                    >
                      <i className="bi bi-truck me-1"></i>
                      Asignar Envío
                    </Button>
                  )}
                  
                  {pedido.estado === 'En Preparacion' && !pedido.seguimiento && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => abrirModalSeguimiento(pedido)}
                    >
                      <i className="bi bi-truck me-1"></i>
                      Asignar Envío
                    </Button>
                  )}

                  {pedido.estado === 'Despachado' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => cambiarEstadoPedido(pedido.pedidoId, 'ENTREGADO')}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Marcar Entregado
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para asignar seguimiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Seguimiento de Envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPedido && (
            <>
              <Alert variant="info">
                <strong>Pedido #{selectedPedido.pedidoId}</strong><br />
                Total: ${selectedPedido.totalFinal.toLocaleString('es-CL')}<br />
                {selectedPedido.detalles.length} productos
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Operador Logístico</Form.Label>
                <Form.Select
                  value={seguimientoData.operadorId}
                  onChange={(e) => setSeguimientoData({...seguimientoData, operadorId: e.target.value})}
                  required
                >
                  <option value="">Selecciona un operador</option>
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
                  value={seguimientoData.numeroGuia}
                  onChange={(e) => setSeguimientoData({...seguimientoData, numeroGuia: e.target.value})}
                  placeholder="Ej: 1234567890"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha Estimada de Entrega</Form.Label>
                <Form.Control
                  type="date"
                  value={seguimientoData.fechaEstimadaEntrega}
                  onChange={(e) => setSeguimientoData({...seguimientoData, fechaEstimadaEntrega: e.target.value})}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={crearSeguimiento}
            disabled={!seguimientoData.operadorId || !seguimientoData.numeroGuia}
          >
            <i className="bi bi-check-circle me-2"></i>
            Crear Seguimiento
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerOrdersPage;
