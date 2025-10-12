import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Definición de permisos por rol
const ROLE_PERMISSIONS = {
  ADMIN: ['*'], // Admin tiene acceso a todo
  GESTOR_LOGISTICA: [
    'view_dashboard',
    'view_orders',
    'manage_inventory',
    'manage_restock',
    'manage_logistics',
    'view_reports'
  ],
  GESTOR_PRODUCTOS: [
    'view_dashboard',
    'manage_products',
    'manage_categories',
    'view_orders',
    'view_inventory',
    'view_reports'
  ],
  GESTOR_COMERCIAL: [
    'view_dashboard',
    'view_products',
    'manage_promotions',
    'view_orders',
    'manage_customers',
    'manage_reviews',
    'view_reports'
  ]
};

// Hook para verificar permisos
export const usePermissions = () => {
  const { userRole } = useAuth();
  
  const hasPermission = (permission) => {
    if (!userRole) return false;
    
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const canAccess = (permissions) => {
    if (Array.isArray(permissions)) {
      return permissions.some(permission => hasPermission(permission));
    }
    return hasPermission(permissions);
  };

  return { hasPermission, canAccess, userRole };
};

// Componente para proteger contenido basado en permisos
const PermissionGuard = ({ permission, permissions, children, fallback = null }) => {
  const { canAccess, hasPermission } = usePermissions();
  
  let allowed = false;
  
  if (permission) {
    allowed = hasPermission(permission);
  } else if (permissions) {
    allowed = canAccess(permissions);
  }
  
  return allowed ? children : fallback;
};

export default PermissionGuard;