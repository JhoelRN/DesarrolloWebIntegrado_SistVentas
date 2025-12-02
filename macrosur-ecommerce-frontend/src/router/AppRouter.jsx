import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importación de componentes de página (Ejemplo)
import HomePage from '../pages/frontend/HomePage';
import CatalogPage from '../pages/frontend/CatalogPage';
import ProductDetailPage from '../pages/frontend/ProductDetailPage';
import CartPage from '../pages/frontend/CartPage';
import CheckoutPage from '../pages/frontend/CheckoutPage';
import MyOrdersPage from '../pages/frontend/MyOrdersPage';
import TrackOrderPage from '../pages/frontend/TrackOrderPage';
import AyudaPage from '../pages/frontend/AyudaPage';
import DevolucionesPage from '../pages/frontend/DevolucionesPage';
import TerminosCondicionesPage from '../pages/frontend/TerminosCondicionesPage';
import LibroReclamacionesPage from '../pages/frontend/LibroReclamacionesPage';
import LoginClientePage from '../pages/auth/LoginClientePage';
import RegisterClientePage from '../pages/auth/RegisterClientePage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import OAuthCallbackPage from '../pages/auth/OAuthCallbackPage';
import ClientProfilePage from '../pages/frontend/ClientProfilePage';
import InfoPage from '../pages/frontend/InfoPage';
import ProfileRouter from './ProfileRouter';
import AdminRouter from './AdminRouter';
import LayoutAdmin from '../components/layout/LayoutAdmin'; // Layout con Sidebar
import LayoutCliente from '../components/layout/LayoutCliente'; // Layout con Header/Footer

/**
 * Componente Wrapper para proteger rutas.
 * Verifica si el usuario está autenticado Y si tiene el rol requerido.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
    
  if (loading) return <div>Cargando autenticación...</div>; // O un Spinner de Bootstrap

  // Si no está autenticado, redirigir al login correspondiente
  if (!isAuthenticated) {
    // Si la ruta requiere rol ADMIN, redirige al login de admin
    if (requiredRole === 'ADMIN') return <Navigate to="/admin/login" replace />;
    // Por defecto redirige al login del cliente
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero el rol no coincide (ej: Cliente intentando acceder al Admin)
  if (requiredRole) {
    // Permitimos que requiredRole sea un string o un array de strings
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
      <Routes>
        {/* ========================================================= */}
        {/* RUTAS PÚBLICAS Y DE CLIENTE (Usan el Layout del Cliente)  */}
        {/* ========================================================= */}
        <Route element={<LayoutCliente />}>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MyOrdersPage />} />
          <Route path="/seguimiento" element={<TrackOrderPage />} />
          <Route path="/ayuda" element={<AyudaPage />} />
          <Route path="/devoluciones" element={<DevolucionesPage />} />
          <Route path="/terminos-condiciones" element={<TerminosCondicionesPage />} />
          <Route path="/libro-reclamaciones" element={<LibroReclamacionesPage />} />
          <Route path="/info/:slug" element={<InfoPage />} /> {/* Contenido_Informativo */}

          {/* Autenticación */}
          <Route path="/login" element={<LoginClientePage />} />
          <Route path="/register" element={<RegisterClientePage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Perfil de Cliente (Sin protección AuthContext porque usa clientAuth) */}
          <Route 
            path="/cliente/perfil" 
            element={<ClientProfilePage />} 
          />

          {/* Rutas Protegidas de Perfil de Cliente (Rol: CLIENTE) */}
          <Route 
            path="/profile/*" 
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <ProfileRouter /> {/* Sub-Router para todas las vistas del perfil */}
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* ========================================================= */}
        {/* RUTAS DE ADMINISTRACIÓN (Usan el Layout del Admin)        */}
        {/* ========================================================= */}
        
        {/* Login de Administración (Público, pero distinto al del cliente) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rutas Protegidas del Panel de Admin (Requiere Rol de ADMIN/GESTOR) */}
        <Route element={<LayoutAdmin />}>
            <Route 
                path="/admin/*"
                element={
                    <ProtectedRoute requiredRole={["ADMIN", "GESTOR_LOGISTICA", "GESTOR_PRODUCTOS", "GESTOR_COMERCIAL"]}>
                        <AdminRouter /> {/* Sub-Router para todas las vistas de administración */}
                    </ProtectedRoute>
                }
            />
        </Route>

        {/* Fallback para rutas no encontradas */}
        <Route path="*" element={<div className="container mt-5"><h1>404 | Página No Encontrada</h1></div>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
