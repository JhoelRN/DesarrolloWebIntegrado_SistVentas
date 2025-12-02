import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CustomerOrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPedidos();
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

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:8081/api/pedidos/${pedidoId}/estado?estado=${encodeURIComponent(nuevoEstado)}`);
      alert(`Pedido actualizado a: ${nuevoEstado}`);
      cargarPedidos();
    } catch (err) {
      alert('Error al cambiar estado del pedido: ' + (err.response?.data?.message || err.message));
    }
  };

  const derivarALogistica = async (pedidoId) => {
    try {
      // Cambiar estado a "Listo para Despacho" sin navegar a otra área
      await axios.put(`http://localhost:8081/api/pedidos/${pedidoId}/estado?estado=${encodeURIComponent('En Preparacion')}`);
      alert('✓ Pedido derivado a Logística exitosamente.\n\nEl área de Logística se encargará de asignar el seguimiento de envío.');
      cargarPedidos();
    } catch (err) {
      alert('Error al derivar pedido: ' + (err.response?.data?.message || err.message));
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
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-cart-check me-2"></i>Gestión Comercial de Pedidos</h2>
          <p className="text-muted">
            Administra el proceso comercial: confirmación de pago y preparación de pedidos.
            Una vez preparado, deriva el pedido a Logística para asignación de seguimiento.
          </p>
        </Col>
      </Row>
      
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
                  <div className="d-flex gap-2 flex-wrap">
                    {/* Pendiente Pago → Pagado */}
                    {pedido.estado === 'Pendiente Pago' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => cambiarEstadoPedido(pedido.pedidoId, 'Pagado')}
                        title="Confirmar pago recibido"
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Confirmar Pago
                      </Button>
                    )}

                    {/* Pagado → En Preparación */}
                    {pedido.estado === 'Pagado' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => cambiarEstadoPedido(pedido.pedidoId, 'En Preparacion')}
                        title="Marcar pedido en preparación"
                      >
                        <i className="bi bi-box-seam me-1"></i>
                        Preparar
                      </Button>
                    )}

                    {/* En Preparación → Marcar como listo para Logística */}
                    {pedido.estado === 'En Preparacion' && !pedido.seguimiento && (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => {
                          if (window.confirm('¿Marcar este pedido como listo para que Logística asigne el seguimiento?')) {
                            derivarALogistica(pedido.pedidoId);
                          }
                        }}
                        title="Notificar a logística que el pedido está listo"
                      >
                        <i className="bi bi-check2-circle me-1"></i>
                        Listo para Logística
                      </Button>
                    )}

                    {/* Mostrar si ya tiene seguimiento asignado por Logística */}
                    {pedido.seguimiento && (
                      <Badge bg="success" className="d-flex align-items-center gap-1">
                        <i className="bi bi-truck"></i>
                        Gestionado por Logística
                      </Badge>
                    )}

                    {/* Opción de cancelar */}
                    {(pedido.estado === 'Pendiente Pago' || pedido.estado === 'Pagado') && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de cancelar este pedido?')) {
                            cambiarEstadoPedido(pedido.pedidoId, 'Cancelado');
                          }
                        }}
                        title="Cancelar pedido"
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}


    </Container>
  );
};

export default CustomerOrdersPage;
