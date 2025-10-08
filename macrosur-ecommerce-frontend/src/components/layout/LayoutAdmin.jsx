import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const LayoutAdmin = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h5 className="fw-bold mb-4">MACROSUR Admin</h5>
        {/* Aquí iría el SideBar de navegación */}
        <p className="small text-muted">Menú de Navegación...</p>
      </div>
      <div className="flex-grow-1 p-4">
        <Container fluid>
          <h1 className="mb-4 text-danger border-bottom pb-2">Panel de Administración</h1>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default LayoutAdmin;