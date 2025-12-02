import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mis-pedidos' } });
      return;
    }
    cargarMisPedidos();
  }, [isAuthenticated, user]);

  const cargarMisPedidos = async () => {
    try {
      if (!user?.id) {
        setError('No se pudo obtener tu información de usuario');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:8081/api/pedidos/mis-pedidos/${user.id}`);
      setPedidos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar tus pedidos');
      setLoading(false);
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

  const verDetalle = (pedido) => {
    setSelectedPedido(selectedPedido?.pedidoId === pedido.pedidoId ? null : pedido);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p>Cargando tus pedidos...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">
        <i className="bi bi-box-seam me-2"></i>
        Mis Pedidos
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {pedidos.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No tienes pedidos aún</h5>
          <p>Comienza a explorar nuestros productos</p>
          <Button variant="primary" href="/productos">
            Ver Productos
          </Button>
        </Alert>
      ) : (
        <>
          {pedidos.map(pedido => (
            <Card key={pedido.pedidoId} className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Pedido #{pedido.pedidoId}</strong>
                  <span className="ms-3 text-muted">
                    {new Date(pedido.fechaPedido).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  {getEstadoBadge(pedido.estado)}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <small className="text-muted">Total</small>
                    <h5 className="text-success">${pedido.totalFinal.toLocaleString('es-CL')}</h5>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">Método de Entrega</small>
                    <div>
                      {pedido.metodoEntrega === 'Domicilio' ? (
                        <><i className="bi bi-truck me-1"></i>Envío a Domicilio</>
                      ) : (
                        <><i className="bi bi-shop me-1"></i>Retiro en Tienda</>
                      )}
                    </div>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">Productos</small>
                    <div>{pedido.detalles.length} productos</div>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => verDetalle(pedido)}
                    >
                      {selectedPedido?.pedidoId === pedido.pedidoId ? (
                        <>
                          <i className="bi bi-chevron-up me-1"></i>
                          Ocultar Detalle
                        </>
                      ) : (
                        <>
                          <i className="bi bi-chevron-down me-1"></i>
                          Ver Detalle
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>

                {/* Información de Seguimiento */}
                {pedido.seguimiento && (
                  <Alert variant="info" className="mt-3 mb-0">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <strong>
                          <i className="bi bi-truck me-2"></i>
                          Información de Envío
                        </strong>
                        <div className="mt-2">
                          <strong>Número de Guía:</strong> {pedido.seguimiento.numeroGuia}<br />
                          <strong>Operador:</strong> {pedido.seguimiento.nombreOperador}<br />
                          <strong>Estado:</strong> <Badge bg="primary">{pedido.seguimiento.estadoEnvio}</Badge>
                          {pedido.seguimiento.fechaEntrega && (
                            <>
                              <br />
                              <strong>Entregado:</strong> {new Date(pedido.seguimiento.fechaEntrega).toLocaleDateString('es-CL')}
                            </>
                          )}
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="primary"
                          href={pedido.seguimiento.urlRastreoCompleta}
                          target="_blank"
                        >
                          <i className="bi bi-box-arrow-up-right me-2"></i>
                          Rastrear Envío
                        </Button>
                      </Col>
                    </Row>
                  </Alert>
                )}

                {/* Detalle de productos */}
                {selectedPedido?.pedidoId === pedido.pedidoId && (
                  <div className="mt-3 pt-3 border-top">
                    <h6>Productos del Pedido</h6>
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.detalles.map(detalle => (
                          <tr key={detalle.detallePedidoId}>
                            <td>
                              <strong>{detalle.nombreProducto}</strong>
                              {detalle.nombreVariante !== 'Estándar' && (
                                <><br /><small className="text-muted">Variante: {detalle.nombreVariante}</small></>
                              )}
                              <br />
                              <small className="text-muted">SKU: {detalle.sku}</small>
                            </td>
                            <td>${detalle.precioUnitario.toLocaleString('es-CL')}</td>
                            <td>{detalle.cantidad}</td>
                            <td><strong>${detalle.subtotal.toLocaleString('es-CL')}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                          <td><strong>${pedido.totalNeto.toLocaleString('es-CL')}</strong></td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end">IVA (19%):</td>
                          <td>${pedido.totalImpuestos.toLocaleString('es-CL')}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="text-end">Envío:</td>
                          <td>${pedido.totalEnvio.toLocaleString('es-CL')}</td>
                        </tr>
                        {pedido.totalDescuento > 0 && (
                          <tr>
                            <td colSpan="3" className="text-end text-success">Descuento:</td>
                            <td className="text-success">-${pedido.totalDescuento.toLocaleString('es-CL')}</td>
                          </tr>
                        )}
                        <tr className="table-success">
                          <td colSpan="3" className="text-end"><strong>TOTAL:</strong></td>
                          <td><strong>${pedido.totalFinal.toLocaleString('es-CL')}</strong></td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default MyOrdersPage;
