import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Button, Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const LayoutAdmin = () => {
  const { logout } = useAuth();
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
          <Nav.Link as={Link} to="/admin/dashboard" className="text-white">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/admin/products" className="text-white">Productos</Nav.Link>
          <Nav.Link as={Link} to="/admin/orders" className="text-white">Pedidos</Nav.Link>
          <Nav.Link as={Link} to="/admin/users" className="text-white">Usuarios</Nav.Link>
          <Nav.Link as={Link} to="/admin/inventory" className="text-white">Inventario</Nav.Link>
          <Nav.Link as={Link} to="/admin/promotions" className="text-white">Promociones</Nav.Link>
          <Nav.Link as={Link} to="/admin/reports" className="text-white">Reportes</Nav.Link>
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