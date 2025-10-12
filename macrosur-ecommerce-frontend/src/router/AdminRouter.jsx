import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// Importa las páginas reales del admin
import DashboardAdminPage from '../pages/admin/DashboardAdminPage';
import ProductsPage from '../pages/admin/ProductsPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import OrdersPage from '../pages/admin/OrdersPage';
import CustomersPage from '../pages/admin/CustomersPage';
import UsersPage from '../pages/admin/UsersPage';
import InventoryPage from '../pages/admin/InventoryPage';
import PromotionsPage from '../pages/admin/PromotionsPage';
import LogisticsPage from '../pages/admin/LogisticsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import RestockPage from '../pages/admin/RestockPage';
import ReviewsPage from '../pages/admin/ReviewsPage';
import ClaimsPage from '../pages/admin/ClaimsPage';

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

        {/* Rutas de gestión de catálogo */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Rutas de gestión de ventas */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/customers" element={<CustomersPage />} />

        {/* Rutas de logística */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/restock" element={<RestockPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />

        {/* Rutas de administración */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/reports" element={<ReportsPage />} />        {/* Fallback dentro del panel de admin */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRouter;
