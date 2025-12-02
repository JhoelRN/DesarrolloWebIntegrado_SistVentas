import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ProtectedRoute from '../components/ProtectedRoute';
// Importa las páginas reales del admin
import DashboardAdminPage from '../pages/admin/DashboardAdminPage';
import ProductsPage from '../pages/admin/ProductsPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import CustomerOrdersPage from '../pages/admin/CustomerOrdersPage';
import CustomersPage from '../pages/admin/CustomersPage';
import UsersPage from '../pages/admin/UsersPage';
import InventoryPage from '../pages/admin/InventoryPage';
import PromotionsPage from '../pages/admin/PromotionsPage';
import LogisticsPage from '../pages/admin/LogisticsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import RestockPage from '../pages/admin/RestockPage';
import ReviewsPage from '../pages/admin/ReviewsPage';
import ClaimsPage from '../pages/admin/ClaimsPage';
import ReportsTestPage from '../pages/admin/ReportsTestPage';
// Páginas del módulo de logística
import RepositionOrdersPage from '../pages/admin/RepositionOrdersPage';
import AlertsPage from '../pages/admin/AlertsPage';
import TrackingPage from '../pages/admin/TrackingPage';
import PedidosLogisticaPage from '../pages/admin/logistica/PedidosLogisticaPage';

const NotFound = () => <Container className="mt-4"><h2 className="text-danger">404 | Admin - Ruta No Válida</h2></Container>;

/**
 * Componente que maneja las rutas internas de /admin/*.
 * Asume que ya está envuelto en <LayoutAdmin /> y <ProtectedRoute requiredRole="ADMIN">.
 */
const AdminRouter = () => {
  return (
    // Las rutas dentro de <Routes> se resuelven relativas a /admin/
    <Routes>
        {/* Redirección: Si el usuario accede a /admin/, lo redirige a /admin/dashboard */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />

  {/* Rutas principales del panel de administración */}
  <Route path="/dashboard" element={<DashboardAdminPage />} />

        {/* Rutas de gestión de catálogo - ADMIN + GESTOR_PRODUCTOS */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_PRODUCTOS']}>
              <ProductsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_PRODUCTOS']}>
              <CategoriesPage />
            </ProtectedRoute>
          } 
        />

        {/* Rutas de gestión de ventas - ADMIN + GESTOR_COMERCIAL */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL']}>
              <CustomerOrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/promotions" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL']}>
              <PromotionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL']}>
              <CustomersPage />
            </ProtectedRoute>
          } 
        />

        {/* Rutas de logística - ADMIN + GESTOR_LOGISTICA */}
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <InventoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logistics" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <LogisticsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas del módulo de logística avanzado - ADMIN + GESTOR_LOGISTICA */}
        <Route 
          path="/logistica/pedidos" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <PedidosLogisticaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logistica/ordenes-reposicion" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <RepositionOrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logistica/alarmas" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <AlertsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logistica/seguimiento" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_LOGISTICA']}>
              <TrackingPage />
            </ProtectedRoute>
          } 
        />

        {/* Rutas de administración */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Reseñas y reclamos - ADMIN + GESTOR_COMERCIAL */}
        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL']}>
              <ReviewsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/claims" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL']}>
              <ClaimsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Reportes - Todos los gestores */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR_COMERCIAL', 'GESTOR_LOGISTICA', 'GESTOR_PRODUCTOS']}>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports-test" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReportsTestPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback dentro del panel de admin */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRouter;
