import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// Stubs para las páginas de perfil
const DashboardCliente = () => <h3 className="fw-bold">Resumen del Perfil</h3>;
const OrdersPage = () => <h3 className="fw-bold">Mis Pedidos</h3>;
const AddressesPage = () => <h3 className="fw-bold">Mis Direcciones</h3>;
const ClaimsPage = () => <h3 className="fw-bold">Libro de Reclamaciones</h3>;
const NotFound = () => <h3 className="fw-bold text-danger">404 | Perfil - Página No Encontrada</h3>;

/**
 * Componente que maneja las rutas internas de /profile/*.
 * Asume que ya está envuelto en <ProtectedRoute requiredRole="CLIENTE">.
 */
const ProfileRouter = () => {
  return (
    <Container className="my-5">
      <h2 className="mb-4 display-6">Gestión de Cuenta Cliente</h2>
      <p className="text-muted border-bottom pb-3">Bienvenido a tu panel de control personal.</p>
      
      {/* Estructura de Rutas Secundarias para /profile/* */}
      <Routes>
        {/* Ruta principal: /profile */}
        <Route path="/" element={<DashboardCliente />} /> 
        
        {/* Rutas de sub-secciones */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/data" element={<h3>Datos Personales</h3>} />
        <Route path="/claims" element={<ClaimsPage />} />

        {/* Fallback dentro del perfil */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
};

export default ProfileRouter;