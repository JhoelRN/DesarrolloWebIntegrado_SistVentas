import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Button, Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import PermissionGuard from '../common/PermissionGuard';
import { usePermissions } from '../../hooks/usePermissions';

const LayoutAdmin = () => {
  const { logout, userRole } = useAuth();
  const { canAccessPage, canPerformAction } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h5 className="fw-bold mb-4">MACROSUR Admin</h5>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </Nav.Link>
          
          {/* Catálogo y Productos */}
          <PermissionGuard requiredPermissions={['VER_PRODUCTOS', 'CREAR_PRODUCTOS', 'VER_CATEGORIAS']}>
            <div className="text-muted small mt-3 mb-1">CATÁLOGO</div>
          </PermissionGuard>
          
          <PermissionGuard requiredPermissions={['VER_PRODUCTOS']}>
            <Nav.Link as={Link} to="/admin/products" className="text-white">
              <i className="bi bi-box me-2"></i>Productos
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_CATEGORIAS">
            <Nav.Link as={Link} to="/admin/categories" className="text-white">
              <i className="bi bi-tags me-2"></i>Categorías
            </Nav.Link>
          </PermissionGuard>
          
          {/* Ventas y Comercial */}
          <PermissionGuard requiredPermissions={['GESTIONAR_PEDIDOS', 'VER_PROMOCIONES', 'VER_CLIENTES']}>
            <div className="text-muted small mt-3 mb-1">VENTAS</div>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="GESTIONAR_PEDIDOS">
            <Nav.Link as={Link} to="/admin/orders" className="text-white">
              <i className="bi bi-cart-check me-2"></i>Pedidos
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_PROMOCIONES">
            <Nav.Link as={Link} to="/admin/promotions" className="text-white">
              <i className="bi bi-percent me-2"></i>Promociones
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_CLIENTES">
            <Nav.Link as={Link} to="/admin/customers" className="text-white">
              <i className="bi bi-people me-2"></i>Clientes
            </Nav.Link>
          </PermissionGuard>
          
          {/* Logística e Inventario */}
          <PermissionGuard requiredPermissions={['VER_INVENTARIO', 'GESTIONAR_STOCK', 'VER_LOGISTICA']}>
            <div className="text-muted small mt-3 mb-1">LOGÍSTICA</div>
          </PermissionGuard>
          
          <PermissionGuard requiredPermissions={['VER_INVENTARIO']}>
            <Nav.Link as={Link} to="/admin/inventory" className="text-white">
              <i className="bi bi-boxes me-2"></i>Inventario
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="GESTIONAR_STOCK">
            <Nav.Link as={Link} to="/admin/restock" className="text-white">
              <i className="bi bi-arrow-repeat me-2"></i>Reposición
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_LOGISTICA">
            <Nav.Link as={Link} to="/admin/logistics" className="text-white">
              <i className="bi bi-truck me-2"></i>Operadores
            </Nav.Link>
          </PermissionGuard>
          
          {/* Administración */}
          <PermissionGuard requiredRole="ADMIN">
            <div className="text-muted small mt-3 mb-1">ADMINISTRACIÓN</div>
            <Nav.Link as={Link} to="/admin/users" className="text-white">
              <i className="bi bi-person-badge me-2"></i>Usuarios Admin
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_RESENAS">
            <Nav.Link as={Link} to="/admin/reviews" className="text-white">
              <i className="bi bi-star me-2"></i>Reseñas
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermission="VER_RECLAMOS">
            <Nav.Link as={Link} to="/admin/claims" className="text-white">
              <i className="bi bi-file-earmark-text me-2"></i>Reclamaciones
            </Nav.Link>
          </PermissionGuard>
          
          <PermissionGuard requiredPermissions={['REPORTE_PRODUCTOS', 'REPORTE_INVENTARIO', 'REPORTE_VENTAS', 'REPORTE_USUARIOS']}>
            <Nav.Link as={Link} to="/admin/reports" className="text-white">
              <i className="bi bi-graph-up me-2"></i>Reportes
            </Nav.Link>
          </PermissionGuard>
        </Nav>

        <div className="mt-4">
          <Button variant="outline-light" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </div>

      <div className="flex-grow-1 p-4">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0 text-danger">Panel de Administración</h1>
            <div>
              <Button variant="secondary" size="sm" className="me-2" as={Link} to="/">Ir al sitio</Button>
              <Button variant="danger" size="sm" onClick={handleLogout}>Cerrar Sesión</Button>
            </div>
          </div>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default LayoutAdmin;