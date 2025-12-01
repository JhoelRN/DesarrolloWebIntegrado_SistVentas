import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardAdminPage = () => {
  const { userRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8081/api/reports/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Datos de ejemplo para gráficas (en producción vienen del backend)
  const ventasMesData = [
    { dia: 1, ventas: 4000 }, { dia: 5, ventas: 3000 }, { dia: 10, ventas: 2000 },
    { dia: 15, ventas: 2780 }, { dia: 20, ventas: 1890 }, { dia: 25, ventas: 2390 }, { dia: 30, ventas: 3490 }
  ];

  const productosCategoriaData = [
    { nombre: 'Electrónica', cantidad: 45 },
    { nombre: 'Hogar', cantidad: 32 },
    { nombre: 'Deportes', cantidad: 28 },
    { nombre: 'Ropa', cantidad: 25 }
  ];

  const estadoPedidosData = [
    { nombre: 'Completados', value: 65 },
    { nombre: 'Pendientes', value: 20 },
    { nombre: 'En proceso', value: 10 },
    { nombre: 'Cancelados', value: 5 }
  ];

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h2><i className="bi bi-speedometer2 me-2"></i>Dashboard {userRole}</h2>
        <p className="text-muted">Resumen de estadísticas y métricas en tiempo real</p>
      </div>

      {/* KPIs Cards */}
      <Row className="mb-4">
        {userRole === 'ADMIN' && (
          <>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Total Productos</p>
                      <h3 className="mb-0">{stats?.totalProductos || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Ventas del Mes</p>
                      <h3 className="mb-0">${(stats?.ventasMes || 0).toLocaleString()}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-currency-dollar" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Pedidos Pendientes</p>
                      <h3 className="mb-0">{stats?.pedidosPendientes || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-clock-history" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-danger text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Alarmas Activas</p>
                      <h3 className="mb-0">{stats?.alarmasActivas || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {userRole === 'GESTOR_PRODUCTOS' && (
          <>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Total Productos</p>
                      <h3 className="mb-0">{stats?.totalProductos || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Categorías</p>
                      <h3 className="mb-0">{stats?.totalCategorias || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-tags" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Stock Bajo</p>
                      <h3 className="mb-0">{stats?.productosStockBajo || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-exclamation-circle" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Valor Inventario</p>
                      <h3 className="mb-0">${(stats?.valorInventario || 0).toLocaleString()}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-cash-stack" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {userRole === 'GESTOR_COMERCIAL' && (
          <>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Ventas del Mes</p>
                      <h3 className="mb-0">${(stats?.ventasMes || 0).toLocaleString()}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-graph-up" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Pedidos del Mes</p>
                      <h3 className="mb-0">{stats?.pedidosDelMes || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-cart-check" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Ticket Promedio</p>
                      <h3 className="mb-0">${(stats?.ticketPromedio || 0).toLocaleString()}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-receipt" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Clientes Activos</p>
                      <h3 className="mb-0">{stats?.clientesActivos || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {userRole === 'GESTOR_LOGISTICA' && (
          <>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Stock Total</p>
                      <h3 className="mb-0">{stats?.stockTotal || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-boxes" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-danger text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Alarmas Activas</p>
                      <h3 className="mb-0">{stats?.alarmasActivas || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Órdenes Reposición</p>
                      <h3 className="mb-0">{stats?.ordenesReposicion || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-clipboard-check" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 small opacity-75">Despachos en Tránsito</p>
                      <h3 className="mb-0">{stats?.despachosEnTransito || 0}</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="bi bi-truck" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* Gráficas */}
      <Row>
        {(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL') && (
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0"><i className="bi bi-graph-up me-2"></i>Ventas del Mes</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasMesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" label={{ value: 'Día del mes', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Ventas ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        )}

        {(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL') && (
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0"><i className="bi bi-pie-chart me-2"></i>Estado de Pedidos</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={estadoPedidosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.nombre}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadoPedidosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        )}

        {(userRole === 'ADMIN' || userRole === 'GESTOR_PRODUCTOS') && (
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0"><i className="bi bi-bar-chart me-2"></i>Productos por Categoría</h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productosCategoriaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default DashboardAdminPage;
