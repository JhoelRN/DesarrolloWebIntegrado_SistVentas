import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const ReportsPage = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtros para reportes
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [almacenId, setAlmacenId] = useState('');

  const descargarReporte = async (tipoReporte) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        return;
      }

      // Construir URL con filtros
      let url = `http://localhost:8081/api/reports/${tipoReporte}?formato=PDF`;
      
      if (tipoReporte === 'ventas' && fechaInicio) {
        url += `&fechaInicio=${fechaInicio}`;
      }
      if (tipoReporte === 'ventas' && fechaFin) {
        url += `&fechaFin=${fechaFin}`;
      }
      if (tipoReporte === 'productos' && categoriaId) {
        url += `&categoriaId=${categoriaId}`;
      }
      if (tipoReporte === 'inventario' && almacenId) {
        url += `&almacenId=${almacenId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);

        setSuccess(`✓ Reporte de ${tipoReporte} descargado exitosamente`);
      } else {
        const errorText = await response.text();
        setError(`Error al generar reporte: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Error descargando reporte:', err);
      setError('Error de conexión al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Configuración de reportes según rol
  const reportesDisponibles = {
    ADMIN: [
      { id: 'usuarios', nombre: 'Usuarios del Sistema', icon: 'bi-people', color: 'primary', descripcion: 'Lista completa de usuarios y gestores' },
      { id: 'productos', nombre: 'Catálogo de Productos', icon: 'bi-box-seam', color: 'success', descripcion: 'Productos, categorías y stock' },
      { id: 'inventario', nombre: 'Inventario Total', icon: 'bi-boxes', color: 'warning', descripcion: 'Stock por almacén y ubicación' },
      { id: 'ventas', nombre: 'Ventas Completo', icon: 'bi-graph-up', color: 'info', descripcion: 'Historial de ventas y pedidos' }
    ],
    GESTOR_PRODUCTOS: [
      { id: 'productos', nombre: 'Catálogo de Productos', icon: 'bi-box-seam', color: 'success', descripcion: 'Productos y categorías' }
    ],
    GESTOR_COMERCIAL: [
      { id: 'ventas', nombre: 'Reporte de Ventas', icon: 'bi-graph-up', color: 'info', descripcion: 'Ventas del período seleccionado' }
    ],
    GESTOR_LOGISTICA: [
      { id: 'inventario', nombre: 'Reporte de Inventario', icon: 'bi-boxes', color: 'warning', descripcion: 'Stock y alarmas por almacén' }
    ]
  };

  const reportes = reportesDisponibles[userRole] || [];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><i className="bi bi-file-earmark-bar-graph me-2"></i>Reportes</h2>
          <p className="text-muted mb-0">
            Genera reportes en PDF según tu rol: <Badge bg="primary">{userRole}</Badge>
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filtros Globales */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0"><i className="bi bi-funnel me-2"></i>Filtros de Reportes</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL') && (
              <>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Inicio (Ventas)</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Fin (Ventas)</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </>
            )}
            {(userRole === 'ADMIN' || userRole === 'GESTOR_PRODUCTOS') && (
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría (Productos)</Form.Label>
                  <Form.Select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            {(userRole === 'ADMIN' || userRole === 'GESTOR_LOGISTICA') && (
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Almacén (Inventario)</Form.Label>
                  <Form.Select
                    value={almacenId}
                    onChange={(e) => setAlmacenId(e.target.value)}
                  >
                    <option value="">Todos los almacenes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Grid de Reportes Disponibles */}
      <Row>
        {reportes.length === 0 ? (
          <Col>
            <Alert variant="warning">
              <i className="bi bi-info-circle me-2"></i>
              No tienes permisos para generar reportes. Contacta al administrador.
            </Alert>
          </Col>
        ) : (
          reportes.map((reporte) => (
            <Col md={6} lg={4} key={reporte.id} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <div
                      className={`bg-${reporte.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center`}
                      style={{ width: '80px', height: '80px' }}
                    >
                      <i className={`${reporte.icon} text-${reporte.color}`} style={{ fontSize: '2.5rem' }}></i>
                    </div>
                  </div>
                  
                  <h5 className="text-center mb-2">{reporte.nombre}</h5>
                  <p className="text-muted text-center small mb-4">{reporte.descripcion}</p>
                  
                  <div className="mt-auto">
                    <Button
                      variant={reporte.color}
                      className="w-100"
                      onClick={() => descargarReporte(reporte.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-2"></i>
                          Descargar PDF
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Información Adicional */}
      <Card className="mt-4 bg-light border-0">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6 className="fw-bold"><i className="bi bi-info-circle me-2"></i>Información</h6>
              <ul className="small mb-0">
                <li>Los reportes se generan en formato PDF profesional</li>
                <li>Utiliza los filtros para personalizar la información</li>
                <li>Los datos son en tiempo real desde la base de datos</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="fw-bold"><i className="bi bi-clock me-2"></i>Disponibilidad</h6>
              <ul className="small mb-0">
                <li>Reportes disponibles 24/7</li>
                <li>Los archivos PDF incluyen fecha de generación</li>
                <li>Contacta soporte si necesitas reportes adicionales</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </Container>
  );
};

export default ReportsPage;
