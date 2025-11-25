import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Alert } from 'react-bootstrap';

// Componente para proteger contenido basado en permisos
const PermissionGuard = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null, 
  requiredPermissions = [], 
  requireAll = false,
  fallback = null,
  showFallback = false 
}) => {
  const { userRole, hasPermission, hasRole } = useAuth();

  // Verificar rol si se especifica
  if (requiredRole && !hasRole(requiredRole)) {
    return showFallback ? (
      <Alert variant="warning">
        <i className="bi bi-shield-exclamation me-2"></i>
        No tienes permisos para acceder a esta sección. Se requiere rol: {requiredRole}
      </Alert>
    ) : fallback;
  }

  // Verificar permiso único si se especifica
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return showFallback ? (
      <Alert variant="warning">
        <i className="bi bi-shield-exclamation me-2"></i>
        No tienes los permisos necesarios para realizar esta acción.
      </Alert>
    ) : fallback;
  }

  // Verificar múltiples permisos
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      return showFallback ? (
        <Alert variant="warning">
          <i className="bi bi-shield-exclamation me-2"></i>
          No tienes los permisos necesarios para acceder a esta funcionalidad.
        </Alert>
      ) : fallback;
    }
  }

  return children;
};

export default PermissionGuard;