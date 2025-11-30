import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import { obtenerAlarmasActivas } from '../../api/alerts';
import { obtenerOrdenesPorEstado } from '../../api/repositionOrders';
import { FaExclamationTriangle, FaBox, FaChartLine, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RestockPage = () => {
  const navigate = useNavigate();
  const [alarmas, setAlarmas] = useState([]);
  const [ordenesPendientes, setOrdenesPendientes] = useState([]);
  const [ordenesAutorizadas, setOrdenesAutorizadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [alarmasData, pendientesData, autorizadasData] = await Promise.all([
        obtenerAlarmasActivas(),
        obtenerOrdenesPorEstado('PENDIENTE'),
        obtenerOrdenesPorEstado('AUTORIZADA')
      ]);
      setAlarmas(alarmasData);
      setOrdenesPendientes(pendientesData);
      setOrdenesAutorizadas(autorizadasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const alarmasCriticas = alarmas.filter(a => a.tipoAlarma.includes('Cero')).length;
  const alarmasBajoStock = alarmas.filter(a => a.tipoAlarma.includes('Bajo')).length;
  const totalOrdenesPendientes = ordenesPendientes.length;
  const totalOrdenesAutorizadas = ordenesAutorizadas.length;

  if (loading) return <Container><p>Cargando datos...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaBox /> Dashboard de Reposición</h2>
          <p className="text-muted">Resumen de stock crítico y órdenes de reposición</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={cargarDatos}>Actualizar</Button>
        </Col>
      </Row>

      {/* Tarjetas de Resumen */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ borderTop: '3px solid #dc3545' }}>
            <Card.Body>
              <FaExclamationTriangle size={40} className="text-danger mb-2" />
              <h3 className="mb-0">{alarmasCriticas}</h3>
              <p className="text-muted mb-0">Stock Agotado</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ borderTop: '3px solid #ffc107' }}>
            <Card.Body>
              <FaChartLine size={40} className="text-warning mb-2" />
              <h3 className="mb-0">{alarmasBajoStock}</h3>
              <p className="text-muted mb-0">Bajo Stock</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ borderTop: '3px solid #17a2b8' }}>
            <Card.Body>
              <FaBox size={40} className="text-info mb-2" />
              <h3 className="mb-0">{totalOrdenesPendientes}</h3>
              <p className="text-muted mb-0">Órdenes Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ borderTop: '3px solid #28a745' }}>
            <Card.Body>
              <FaTruck size={40} className="text-success mb-2" />
              <h3 className="mb-0">{totalOrdenesAutorizadas}</h3>
              <p className="text-muted mb-0">En Tránsito</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alertas y Recomendaciones */}
      {(alarmasCriticas > 0 || alarmasBajoStock > 0) && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading><FaExclamationTriangle /> Productos Críticos Detectados</Alert.Heading>
          <p>
            Tienes <strong>{alarmasCriticas} producto(s) sin stock</strong> y <strong>{alarmasBajoStock} con stock bajo</strong>.
            {' '}Es recomendable crear órdenes de reposición para evitar desabastecimiento.
          </p>
          <hr />
          <div className="d-flex gap-2">
            <Button variant="warning" onClick={() => navigate('/admin/logistica/alarmas')}>
              Ver Alarmas
            </Button>
            <Button variant="success" onClick={() => navigate('/admin/orders')}>
              Crear Orden de Reposición
            </Button>
          </div>
        </Alert>
      )}

      {/* Tabs de Información */}
      <Tabs defaultActiveKey="alarmas" className="mb-4">
        <Tab eventKey="alarmas" title={<>Alarmas Activas ({alarmas.length})</>}>
          <Card>
            <Card.Body>
              {alarmas.length === 0 ? (
                <Alert variant="success">
                  ✅ No hay alarmas de stock activas
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>SKU</th>
                        <th>Ubicación</th>
                        <th>Tipo Alarma</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alarmas.slice(0, 10).map((alarma) => (
                        <tr key={alarma.alarmaId}>
                          <td>{alarma.nombreProducto}</td>
                          <td><code>{alarma.sku}</code></td>
                          <td>{alarma.nombreUbicacion}</td>
                          <td>
                            {alarma.tipoAlarma.includes('Cero') ? (
                              <Badge bg="danger">{alarma.tipoAlarma}</Badge>
                            ) : (
                              <Badge bg="warning">{alarma.tipoAlarma}</Badge>
                            )}
                          </td>
                          <td><strong>{alarma.cantidadActual}</strong></td>
                          <td>{alarma.stockMinimo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Button variant="outline-primary" onClick={() => navigate('/admin/logistica/alarmas')}>
                  Ver Todas las Alarmas
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="pendientes" title={<>Órdenes Pendientes ({totalOrdenesPendientes})</>}>
          <Card>
            <Card.Body>
              {totalOrdenesPendientes === 0 ? (
                <Alert variant="info">
                  No hay órdenes pendientes de autorización
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Proveedor</th>
                        <th>Fecha Solicitud</th>
                        <th>Items</th>
                        <th>Costo Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesPendientes.map((orden) => (
                        <tr key={orden.ordenReposicionId}>
                          <td><code>#{orden.ordenReposicionId}</code></td>
                          <td>{orden.nombreProveedor}</td>
                          <td>{new Date(orden.fechaSolicitud).toLocaleDateString()}</td>
                          <td>{orden.detalles?.length || 0} items</td>
                          <td><strong>${orden.costoTotal?.toFixed(2)}</strong></td>
                          <td><Badge bg="warning">Pendiente</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Button variant="outline-primary" onClick={() => navigate('/admin/orders')}>
                  Gestionar Órdenes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="autorizadas" title={<>En Tránsito ({totalOrdenesAutorizadas})</>}>
          <Card>
            <Card.Body>
              {totalOrdenesAutorizadas === 0 ? (
                <Alert variant="info">
                  No hay órdenes autorizadas en tránsito
                </Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Proveedor</th>
                        <th>Fecha Autorización</th>
                        <th>Items</th>
                        <th>Costo Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesAutorizadas.map((orden) => (
                        <tr key={orden.ordenReposicionId}>
                          <td><code>#{orden.ordenReposicionId}</code></td>
                          <td>{orden.nombreProveedor}</td>
                          <td>{new Date(orden.fechaAutorizacion).toLocaleDateString()}</td>
                          <td>{orden.detalles?.length || 0} items</td>
                          <td><strong>${orden.costoTotal?.toFixed(2)}</strong></td>
                          <td><Badge bg="info">Autorizada</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Button variant="outline-primary" onClick={() => navigate('/admin/orders')}>
                  Gestionar Órdenes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Accesos Rápidos */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Accesos Rápidos</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Button 
                variant="outline-primary" 
                className="w-100 mb-2"
                onClick={() => navigate('/admin/inventory')}
              >
                <FaBox /> Gestión de Inventario
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-warning" 
                className="w-100 mb-2"
                onClick={() => navigate('/admin/logistica/alarmas')}
              >
                <FaExclamationTriangle /> Ver Alarmas
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-success" 
                className="w-100 mb-2"
                onClick={() => navigate('/admin/orders')}
              >
                <FaTruck /> Órdenes de Reposición
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-info" 
                className="w-100 mb-2"
                onClick={() => navigate('/admin/logistics')}
              >
                <FaTruck /> Operadores y Proveedores
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestockPage;
