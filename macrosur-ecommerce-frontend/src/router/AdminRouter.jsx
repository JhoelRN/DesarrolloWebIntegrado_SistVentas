import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// Importa la página del Dashboard (asumimos que existe un stub en /pages/admin/)
import DashboardAdminPage from '../pages/admin/DashboardAdminPage'; 

// Stubs para las otras páginas de gestión
const ProductManagementPage = () => <Container className="mt-4"><h2>Gestión de Productos (CRUD)</h2><p>Aquí se añadirán las tablas y formularios para crear, leer, actualizar y eliminar productos.</p></Container>;
const OrderManagementPage = () => <Container className="mt-4"><h2>Gestión de Pedidos</h2><p>Listado y detalle de todos los pedidos realizados por los clientes.</p></Container>;
const UserManagementPage = () => <Container className="mt-4"><h2>Gestión de Usuarios</h2><p>Gestión de clientes y usuarios administradores.</p></Container>;
const CategoryManagementPage = () => <Container className="mt-4"><h2>Gestión de Categorías</h2><p>CRUD para las categorías y subcategorías de productos.</p></Container>;
const SettingsPage = () => <Container className="mt-4"><h2>Configuración del Sistema</h2><p>Configuración general, tasas, impuestos y datos de contacto.</p></Container>;
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
        
        {/* Rutas de gestión de contenido */}
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        
        {/* Rutas de gestión de operaciones */}
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        
        {/* Configuración */}
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Fallback dentro del panel de admin */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRouter;
