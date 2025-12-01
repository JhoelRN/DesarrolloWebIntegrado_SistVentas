import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// --- Importaciones de Páginas ---

// Dashboard Principal
import DashboardAdminPage from '../pages/admin/DashboardAdminPage';

// Catálogo
import ProductsPage from '../pages/admin/ProductsPage';
import CategoriesPage from '../pages/admin/CategoriesPage';

// Ventas y Clientes
// NOTA: Usamos el archivo nuevo CustomerOrdersPage para la gestión de ventas
import CustomerOrdersPage from '../pages/admin/CustomerOrdersPage'; 
import CustomersPage from '../pages/admin/CustomersPage';
import PromotionsPage from '../pages/admin/PromotionsPage';

// Logística y Compras (Módulo Nuevo)
import LogisticsPage from '../pages/admin/LogisticsPage'; // Operadores y Proveedores
// NOTA: OrdersPage ahora contiene la lógica de Reposición (versión de Rodrigo)
import RepositionOrdersPage from '../pages/admin/OrdersPage'; 
import InventoryPage from '../pages/admin/InventoryPage'; // Gestión avanzada de inventario
import RestockPage from '../pages/admin/RestockPage'; // Dashboard de reposición
import AlertsPage from '../pages/admin/AlertsPage'; // Si existe en la rama de Rodrigo
import TrackingPage from '../pages/admin/TrackingPage'; // Si existe en la rama de Rodrigo

// Administración General
import UsersPage from '../pages/admin/UsersPage';
import ReviewsPage from '../pages/admin/ReviewsPage';
import ClaimsPage from '../pages/admin/ClaimsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import ReportsTestPage from '../pages/admin/ReportsTestPage';

const NotFound = () => <Container className="mt-4"><h2 className="text-danger">404 | Admin - Ruta No Válida</h2></Container>;

/**
 * AdminRouter: Gestiona todas las rutas bajo /admin/*
 */
const AdminRouter = () => {
  return (
    <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />

        {/* --- Rutas Principales --- */}
        <Route path="/dashboard" element={<DashboardAdminPage />} />

        {/* --- Catálogo --- */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* --- Ventas (Versión HEAD preservada) --- */}
        <Route path="/orders" element={<CustomerOrdersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />

        {/* --- Logística (Versión Rodrigo integrada) --- */}
        {/* Inventario Avanzado */}
        <Route path="/inventory" element={<InventoryPage />} />
        
        {/* Gestión de Proveedores y Operadores */}
        <Route path="/logistics" element={<LogisticsPage />} />
        
        {/* Dashboard de Reposición (Nuevo) */}
        <Route path="/restock" element={<RestockPage />} />

        {/* Sub-rutas específicas de logística definidas por Rodrigo */}
        <Route path="/logistica/ordenes-reposicion" element={<RepositionOrdersPage />} />
        <Route path="/logistica/alarmas" element={<AlertsPage />} />
        <Route path="/logistica/seguimiento" element={<TrackingPage />} />

        {/* --- Administración --- */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports-test" element={<ReportsTestPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRouter;