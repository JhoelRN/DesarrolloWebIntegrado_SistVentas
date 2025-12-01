import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Button, Nav, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import PermissionGuard from '../common/PermissionGuard';
import { usePermissions } from '../../hooks/usePermissions';

const LayoutAdmin = () => {
  const { logout, userRole, user } = useAuth();
  const { canAccessPage, canPerformAction } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Navegar ANTES de limpiar el estado
    setTimeout(() => logout(), 100); // Delay para completar navegación
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h5 className="fw-bold mb-4">MACROSUR Admin</h5>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </Nav.Link>
          
          {/* Catálogo y Productos - ADMIN + GESTOR_PRODUCTOS */}
          {(userRole === 'ADMIN' || userRole === 'GESTOR_PRODUCTOS') && (
            <>
              <div className="text-muted small mt-3 mb-1">CATÁLOGO</div>
              <Nav.Link as={Link} to="/admin/products" className="text-white">
                <i className="bi bi-box me-2"></i>Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/categories" className="text-white">
                <i className="bi bi-tags me-2"></i>Categorías
              </Nav.Link>
            </>
          )}
          
          {/* Ventas y Comercial - ADMIN + GESTOR_COMERCIAL */}
          {(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL') && (
            <>
              <div className="text-muted small mt-3 mb-1">VENTAS</div>
              <Nav.Link as={Link} to="/admin/orders" className="text-white">
                <i className="bi bi-cart-check me-2"></i>Pedidos Clientes
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/promotions" className="text-white">
                <i className="bi bi-percent me-2"></i>Promociones
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/customers" className="text-white">
                <i className="bi bi-people me-2"></i>Clientes
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/reviews" className="text-white">
                <i className="bi bi-star me-2"></i>Reseñas
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/claims" className="text-white">
                <i className="bi bi-file-earmark-text me-2"></i>Reclamaciones
              </Nav.Link>
            </>
          )}
          
          {/* Logística e Inventario - ADMIN + GESTOR_LOGISTICA */}
          {(userRole === 'ADMIN' || userRole === 'GESTOR_LOGISTICA') && (
            <>
              <div className="text-muted small mt-3 mb-1">LOGÍSTICA</div>
              <Nav.Link as={Link} to="/admin/inventory" className="text-white">
                <i className="bi bi-boxes me-2"></i>Inventario
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/logistica/ordenes-reposicion" className="text-white">
                <i className="bi bi-clipboard-check me-2"></i>Órdenes Reposición
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/logistica/alarmas" className="text-white">
                <i className="bi bi-exclamation-triangle me-2"></i>Alarmas Stock
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/logistica/pedidos" className="text-white">
                <i className="bi bi-cart-check me-2"></i>Pedidos Logística
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/logistics" className="text-white">
                <i className="bi bi-truck me-2"></i>Operadores
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/logistica/seguimiento" className="text-white">
                <i className="bi bi-geo-alt me-2"></i>Seguimiento
              </Nav.Link>
            </>
          )}
          
          {/* Administración - Solo ADMIN */}
          {userRole === 'ADMIN' && (
            <>
              <div className="text-muted small mt-3 mb-1">ADMINISTRACIÓN</div>
              <Nav.Link as={Link} to="/admin/users" className="text-white">
                <i className="bi bi-person-badge me-2"></i>Usuarios Admin
              </Nav.Link>
            </>
          )}
          
          {/* Reportes - Todos los gestores */}
          {(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL' || userRole === 'GESTOR_LOGISTICA' || userRole === 'GESTOR_PRODUCTOS') && (
            <>
              <div className="text-muted small mt-3 mb-1">REPORTES</div>
              <Nav.Link as={Link} to="/admin/reports" className="text-white">
                <i className="bi bi-graph-up me-2"></i>Reportes
              </Nav.Link>
            </>
          )}
        </Nav>

        <div className="mt-4">
          <Button variant="outline-light" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </div>

      <div className="flex-grow-1 p-4">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0 text-danger">Panel de Administración</h1>
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-bold">{user?.name || 'Usuario'}</div>
                <Badge bg="secondary" className="text-uppercase">{userRole}</Badge>
              </div>
              <Button variant="secondary" size="sm" as={Link} to="/">Ir al sitio</Button>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
              </Button>
            </div>
          </div>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default LayoutAdmin;