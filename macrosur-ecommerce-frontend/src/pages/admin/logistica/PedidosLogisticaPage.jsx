import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Alert, Table, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PedidosLogisticaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidoResaltado, setPedidoResaltado] = useState(null);
  const pedidoRef = useRef({});
  const [formData, setFormData] = useState({
    estado: '',
    numeroGuia: '',
    operadorLogistico: ''
  });

  const operadoresLogisticos = [
    { value: 'chilexpress', label: 'Chilexpress' },
    { value: 'starken', label: 'Starken' },
    { value: 'correos_chile', label: 'Correos de Chile' },
    { value: 'bluexpress', label: 'Blue Express' },
    { value: 'otro', label: 'Otro' }
  ];

  const estadosPedido = [
    'Pendiente Pago',
    'Pagado',
    'En Preparacion',
    'Despachado',
    'Entregado',
    'Cancelado'
  ];

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Detectar pedido derivado desde comercial
  useEffect(() => {
    const pedidoIdParam = searchParams.get('pedido');
    if (pedidoIdParam && pedidos.length > 0) {
      const pedidoId = parseInt(pedidoIdParam);
      const pedido = pedidos.find(p => p.pedidoId === pedidoId);
      
      if (pedido) {
        // Resaltar el pedido
        setPedidoResaltado(pedidoId);
        
        // Scroll hacia el pedido
        setTimeout(() => {
          if (pedidoRef.current[pedidoId]) {
            pedidoRef.current[pedidoId].scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);

        // Si no tiene seguimiento, abrir modal automáticamente
        if (!pedido.seguimiento) {
          setTimeout(() => {
            abrirModalSeguimiento(pedido);
          }, 500);
        }

        // Remover resaltado después de 5 segundos
        setTimeout(() => {
          setPedidoResaltado(null);
          setSearchParams({}); // Limpiar query param
        }, 5000);
      }
    }
  }, [pedidos, searchParams]);

  const cargarPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/pedidos');
      setPedidos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar los pedidos');
      setLoading(false);
    }
  };

  const abrirModalSeguimiento = (pedido) => {
    setPedidoSeleccionado(pedido);
    setFormData({
      estado: pedido.estado,
      numeroGuia: pedido.seguimiento?.numeroGuia || '',
      operadorLogistico: pedido.seguimiento?.operadorLogistico || ''
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setPedidoSeleccionado(null);
    setFormData({
      estado: '',
      numeroGuia: '',
      operadorLogistico: ''
    });
  };

  const actualizarPedido = async () => {
    try {
      // Actualizar estado
      if (formData.estado !== pedidoSeleccionado.estado) {
        await axios.put(
          `http://localhost:8081/api/pedidos/${pedidoSeleccionado.pedidoId}/estado?estado=${encodeURIComponent(formData.estado)}`
        );
      }

      // Asignar/actualizar seguimiento si hay número de guía
      if (formData.numeroGuia && formData.operadorLogistico) {
        await axios.post(
          `http://localhost:8081/api/pedidos/${pedidoSeleccionado.pedidoId}/seguimiento`,
          {
            numeroGuia: formData.numeroGuia,
            operadorLogistico: formData.operadorLogistico
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      alert('Pedido actualizado exitosamente');
      cerrarModal();
      cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar pedido:', err);
      alert('Error al actualizar el pedido: ' + (err.response?.data?.error || err.message));
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
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p>Cargando pedidos...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-truck me-2"></i>
            Gestión de Pedidos - Logística
          </h2>
          <p className="text-muted">Administra el estado y seguimiento de los pedidos</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {pedidoResaltado && (
        <Alert variant="info" className="d-flex align-items-center gap-2">
          <i className="bi bi-info-circle-fill"></i>
          <span>
            <strong>Pedido derivado desde Comercial:</strong> El pedido #{pedidoResaltado} está resaltado en la tabla.
            {!pedidos.find(p => p.pedidoId === pedidoResaltado)?.seguimiento && 
              ' Se ha abierto el modal para asignar seguimiento.'}
          </span>
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Método Entrega</th>
                <th>Seguimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No hay pedidos registrados
                  </td>
                </tr>
              ) : (
                pedidos.map(pedido => (
                  <tr 
                    key={pedido.pedidoId}
                    ref={el => pedidoRef.current[pedido.pedidoId] = el}
                    className={pedidoResaltado === pedido.pedidoId ? 'table-warning' : ''}
                    style={{
                      transition: 'background-color 0.3s ease',
                      ...(pedidoResaltado === pedido.pedidoId && {
                        boxShadow: '0 0 15px rgba(255, 193, 7, 0.5)',
                        animation: 'pulse 1s ease-in-out 3'
                      })
                    }}
                  >
                    <td><strong>#{pedido.pedidoId}</strong></td>
                    <td>{pedido.nombreCliente || `Cliente #${pedido.clienteId}`}</td>
                    <td>
                      {new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td><strong>${pedido.totalFinal.toLocaleString('es-CL')}</strong></td>
                    <td>{getEstadoBadge(pedido.estado)}</td>
                    <td>
                      {pedido.metodoEntrega === 'Domicilio' ? (
                        <><i className="bi bi-truck me-1"></i>Domicilio</>
                      ) : (
                        <><i className="bi bi-shop me-1"></i>Retiro en Tienda</>
                      )}
                    </td>
                    <td>
                      {pedido.seguimiento ? (
                        <div>
                          <Badge bg="success" className="me-1">
                            <i className="bi bi-check-circle me-1"></i>
                            Asignado
                          </Badge>
                          <br />
                          <small className="text-muted">
                            Guía: {pedido.seguimiento.numeroGuia}
                          </small>
                        </div>
                      ) : (
                        <Badge bg="secondary">Sin asignar</Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => abrirModalSeguimiento(pedido)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de Seguimiento */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-truck me-2"></i>
            Gestionar Pedido #{pedidoSeleccionado?.pedidoId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSeleccionado && (
            <>
              <Alert variant="info">
                <Row>
                  <Col md={6}>
                    <strong>Cliente:</strong> {pedidoSeleccionado.nombreCliente || `#${pedidoSeleccionado.clienteId}`}<br />
                    <strong>Fecha:</strong> {new Date(pedidoSeleccionado.fechaPedido).toLocaleString('es-CL')}<br />
                    <strong>Total:</strong> ${pedidoSeleccionado.totalFinal.toLocaleString('es-CL')}
                  </Col>
                  <Col md={6}>
                    <strong>Método de Entrega:</strong> {pedidoSeleccionado.metodoEntrega}<br />
                    <strong>Productos:</strong> {pedidoSeleccionado.detalles.length} items
                  </Col>
                </Row>
              </Alert>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Estado del Pedido</strong></Form.Label>
                  <Form.Select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    {estadosPedido.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Actualiza el estado según el progreso del pedido
                  </Form.Text>
                </Form.Group>

                <hr />

                <h6 className="mb-3">
                  <i className="bi bi-box-seam me-2"></i>
                  Información de Envío
                </h6>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Operador Logístico</strong></Form.Label>
                  <Form.Select
                    value={formData.operadorLogistico}
                    onChange={(e) => setFormData({ ...formData, operadorLogistico: e.target.value })}
                  >
                    <option value="">Seleccionar operador...</option>
                    {operadoresLogisticos.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Número de Guía</strong></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 12345678"
                    value={formData.numeroGuia}
                    onChange={(e) => setFormData({ ...formData, numeroGuia: e.target.value })}
                  />
                  <Form.Text className="text-muted">
                    Ingresa el número de guía proporcionado por el operador logístico
                  </Form.Text>
                </Form.Group>

                {formData.numeroGuia && formData.operadorLogistico && (
                  <Alert variant="success">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>URL de rastreo:</strong> Se generará automáticamente para el cliente
                  </Alert>
                )}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={actualizarPedido}>
            <i className="bi bi-save me-2"></i>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos para animación */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </Container>
  );
};

export default PedidosLogisticaPage;
