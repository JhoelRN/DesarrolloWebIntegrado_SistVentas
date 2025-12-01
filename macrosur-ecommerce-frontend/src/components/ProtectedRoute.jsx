import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Alert, Button } from 'react-bootstrap';

/**
 * Componente de protección de rutas basado en roles
 * 
 * @param {Array} allowedRoles - Roles permitidos (ej: ['Admin', 'Gestor Comercial'])
 * @param {Array} requiredPermissions - Permisos específicos requeridos
 * @param {React.Component} children - Componente a renderizar si tiene acceso
 */
const ProtectedRoute = ({ allowedRoles = [], requiredPermissions = [], children }) => {
  const { isAuthenticated, userRole, userPermissions, loading } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Verificando permisos...</p>
      </Container>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar si el rol del usuario está en la lista de roles permitidos
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Verificar si el usuario tiene los permisos requeridos
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => userPermissions?.includes(permission));

  // Si no tiene el rol o permisos necesarios, mostrar página de acceso denegado
  if (!hasRequiredRole || !hasRequiredPermissions) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="bi bi-shield-x me-2"></i>
            Acceso Denegado
          </Alert.Heading>
          <hr />
          <p className="mb-3">
            <strong>No tienes permisos para acceder a esta sección.</strong>
          </p>
          <div className="mb-3">
            <small className="text-muted">
              Tu rol actual: <strong>{userRole || 'Sin rol'}</strong>
            </small>
            <br />
            {allowedRoles.length > 0 && (
              <small className="text-muted">
                Roles permitidos: <strong>{allowedRoles.join(', ')}</strong>
              </small>
            )}
            {requiredPermissions.length > 0 && (
              <>
                <br />
                <small className="text-muted">
                  Permisos requeridos: <strong>{requiredPermissions.join(', ')}</strong>
                </small>
              </>
            )}
          </div>
          <hr />
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => window.location.href = '/admin/dashboard'}
            >
              <i className="bi bi-house me-2"></i>
              Ir al Dashboard
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Si tiene acceso, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
