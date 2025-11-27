import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- IMPORTANTE: Componente para corregir el scroll ---
import ScrollToTop from '../components/common/ScrollToTop';

// Importación de páginas
import HomePage from '../pages/frontend/HomePage';
import CatalogPage from '../pages/frontend/CatalogPage';
import ProductDetailPage from '../pages/frontend/ProductDetailPage';
import CartPage from '../pages/frontend/CartPage';
import LoginClientePage from '../pages/auth/LoginClientePage';
import RegisterClientePage from '../pages/auth/RegisterClientePage';
// import AdminLoginPage from '../pages/auth/AdminLoginPage';
import InfoPage from '../pages/frontend/InfoPage';
import TrackingPage from '../pages/frontend/TrackingPage';
import ClientProfilePage from '../pages/frontend/ClientProfilePage';

// Importamos los Layouts
import LayoutAdmin from '../components/layout/LayoutAdmin';
import LayoutCliente from '../components/layout/LayoutCliente';

/**
 * Componente Wrapper para proteger rutas.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
    
  if (loading) return <div className="p-5 text-center">Cargando autenticación...</div>;

  if (!isAuthenticated) {
    if (requiredRole === 'ADMIN') return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* ScrollToTop se encarga de subir la pantalla al cambiar de página */}
      <ScrollToTop />
      
      <Routes>
        {/* ========================================================= */}
        {/* RUTAS PÚBLICAS Y DE CLIENTE (Usan el Layout del Cliente)  */}
        {/* ========================================================= */}
        <Route element={<LayoutCliente />}>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/track" element={<TrackingPage />} />
          
          {/* Rutas de Información (Nosotros, Ayuda, Términos...) */}
          <Route path="/info/:slug" element={<InfoPage />} />

          {/* Autenticación */}
          <Route path="/login" element={<LoginClientePage />} />
          <Route path="/register" element={<RegisterClientePage />} />

          {/* Rutas Protegidas del Cliente */}
          <Route path="/cliente/perfil" element={
              <ProtectedRoute requiredRole="CLIENTE">
                 <ClientProfilePage />
              </ProtectedRoute>
          } />
          
          {/* Aquí podrías agregar sub-rutas si perfil crece */}
          <Route path="/cliente/perfil/orders" element={
              <ProtectedRoute requiredRole="CLIENTE">
                 <div>Historial de Pedidos (Próximamente)</div>
              </ProtectedRoute>
          } />
        </Route>
        
        {/* ========================================================= */}
        {/* RUTAS DE ADMINISTRACIÓN (Usan el Layout del Admin)        */}
        {/* ========================================================= */}
        
        {/* Login Admin */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}

        <Route element={<LayoutAdmin />}>
            <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole={["ADMIN", "GESTOR"]}>
                    <div>Panel de Admin (Próximamente)</div>
                </ProtectedRoute>
            } />
            {/* Aquí irían las rutas de productos, ventas, etc. */}
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<div className="container mt-5 text-center"><h1>404 | Página No Encontrada</h1></div>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;