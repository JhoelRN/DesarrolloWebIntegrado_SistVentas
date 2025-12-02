import { useAuth } from '../contexts/AuthContext';

// Hook personalizado para verificar permisos de manera más granular
export const usePermissions = () => {
  const { userRole, userPermissions, hasPermission, hasRole } = useAuth();

  // Mapeo de páginas a permisos requeridos
  const PAGE_PERMISSIONS = {
    // Páginas de administración
    'dashboard': ['VER_DASHBOARD_ADMIN'],
    'users': ['GESTIONAR_USUARIOS'],
    'products': ['VER_PRODUCTOS'],
    'categories': ['VER_CATEGORIAS'],
    'inventory': ['VER_INVENTARIO'],
    'orders': ['VER_PEDIDOS'],
    'customers': ['VER_CLIENTES'],
    'promotions': ['VER_PROMOCIONES'],
    'reviews': ['VER_RESENAS'],
    'claims': ['VER_RECLAMOS'],
    'logistics': ['VER_LOGISTICA'],
    'restock': ['AUTORIZAR_REPOSICION'],
    'reports': ['REPORTE_PRODUCTOS', 'REPORTE_INVENTARIO', 'REPORTE_VENTAS', 'REPORTE_USUARIOS']
  };

  // Mapeo de acciones a permisos
  const ACTION_PERMISSIONS = {
    'create_product': ['CREAR_PRODUCTOS'],
    'edit_product': ['EDITAR_PRODUCTOS'],
    'delete_product': ['ELIMINAR_PRODUCTOS'],
    'create_category': ['CREAR_CATEGORIAS'],
    'edit_category': ['EDITAR_CATEGORIAS'],
    'manage_stock': ['GESTIONAR_STOCK'],
    'authorize_restock': ['AUTORIZAR_REPOSICION'],
    'manage_orders': ['GESTIONAR_PEDIDOS'],
    'create_promotion': ['CREAR_PROMOCIONES'],
    'manage_reviews': ['GESTIONAR_RESENAS'],
    'manage_claims': ['GESTIONAR_RECLAMOS'],
    'manage_users': ['GESTIONAR_USUARIOS'],
    'generate_report_products': ['REPORTE_PRODUCTOS'],
    'generate_report_inventory': ['REPORTE_INVENTARIO'],
    'generate_report_sales': ['REPORTE_VENTAS'],
    'generate_report_users': ['REPORTE_USUARIOS']
  };

  // Verificar si puede acceder a una página
  const canAccessPage = (page) => {
    if (!userRole) return false;
    
    // Admin puede acceder a todo
    if (userRole === 'ADMIN') return true;
    
    const requiredPermissions = PAGE_PERMISSIONS[page] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  // Verificar si puede realizar una acción
  const canPerformAction = (action) => {
    if (!userRole) return false;
    
    // Admin puede hacer todo
    if (userRole === 'ADMIN') return true;
    
    const requiredPermissions = ACTION_PERMISSIONS[action] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  // Verificar múltiples permisos (requiere todos)
  const hasAllPermissions = (permissions) => {
    if (!userRole) return false;
    if (userRole === 'ADMIN') return true;
    return permissions.every(permission => hasPermission(permission));
  };

  // Verificar múltiples permisos (requiere al menos uno)
  const hasAnyPermission = (permissions) => {
    if (!userRole) return false;
    if (userRole === 'ADMIN') return true;
    return permissions.some(permission => hasPermission(permission));
  };

  // Obtener páginas disponibles para el usuario actual
  const getAvailablePages = () => {
    if (!userRole) return [];
    
    if (userRole === 'ADMIN') {
      return Object.keys(PAGE_PERMISSIONS);
    }
    
    return Object.keys(PAGE_PERMISSIONS).filter(page => canAccessPage(page));
  };

  // Obtener acciones disponibles para el usuario actual
  const getAvailableActions = () => {
    if (!userRole) return [];
    
    if (userRole === 'ADMIN') {
      return Object.keys(ACTION_PERMISSIONS);
    }
    
    return Object.keys(ACTION_PERMISSIONS).filter(action => canPerformAction(action));
  };

  return {
    // Datos del usuario
    userRole,
    userPermissions,
    
    // Funciones básicas del AuthContext
    hasPermission,
    hasRole,
    
    // Funciones específicas del hook
    canAccessPage,
    canPerformAction,
    hasAllPermissions,
    hasAnyPermission,
    getAvailablePages,
    getAvailableActions,
    
    // Utilidades
    isAdmin: userRole === 'ADMIN',
    isLogisticsManager: userRole === 'GESTOR_LOGISTICA',
    isProductManager: userRole === 'GESTOR_PRODUCTOS',
    isCommercialManager: userRole === 'GESTOR_COMERCIAL'
  };
};

export default usePermissions;