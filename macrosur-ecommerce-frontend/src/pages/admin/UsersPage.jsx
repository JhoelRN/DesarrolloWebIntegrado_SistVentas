import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import * as adminApi from '../../api/admin';
import PermissionGuard from '../../components/common/PermissionGuard';
import { usePermissions } from '../../hooks/usePermissions';

const UsersPage = () => {
  const { canPerformAction, isAdmin } = usePermissions();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_corporativo: '',
    contrasena: '',
    rol_id: 3 // Por defecto GESTOR_PRODUCTOS
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        adminApi.getAdminUsers(),
        adminApi.getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError('Error cargando datos: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que el correo termine en @macrosur.com
    if (!formData.correo_corporativo.endsWith('@macrosur.com')) {
      setError('El correo debe terminar en @macrosur.com');
      setLoading(false);
      return;
    }

    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData = { ...formData };
        if (!updateData.contrasena) {
          delete updateData.contrasena; // No actualizar contraseña si está vacía
        }
        await adminApi.updateAdminUser(editingUser.usuario_admin_id, updateData);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await adminApi.createAdminUser(formData);
        setSuccess('Usuario creado exitosamente');
      }
      
      handleCloseModal();
      await loadData(); // Recargar lista
    } catch (err) {
      setError(`Error ${editingUser ? 'actualizando' : 'creando'} usuario: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (rolId) => {
    const rol = roles.find(r => r.rol_id === rolId);
    return rol ? rol.nombre_rol : 'Desconocido';
  };

  const getRoleBadgeVariant = (rolId) => {
    switch (rolId) {
      case 1: return 'danger'; // ADMIN
      case 2: return 'warning'; // GESTOR_LOGISTICA
      case 3: return 'info'; // GESTOR_PRODUCTOS
      case 4: return 'success'; // GESTOR_COMERCIAL
      default: return 'secondary';
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      correo_corporativo: user.correo_corporativo,
      contrasena: '', // No mostrar contraseña actual
      rol_id: user.rol_id
    });
    setShowModal(true);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    // Prevenir auto-desactivación
    const currentUserEmail = localStorage.getItem('userEmail');
    const userToToggle = users.find(u => u.usuario_admin_id === userId);
    
    if (userToToggle && userToToggle.correo_corporativo === currentUserEmail) {
      setError('No puedes desactivarte a ti mismo');
      return;
    }

    const action = currentStatus ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Estás seguro de que deseas ${action} este usuario?`)) {
      return;
    }

    try {
      if (currentStatus) {
        await adminApi.deactivateUser(userId);
        setSuccess('Usuario desactivado exitosamente. No podrá iniciar sesión.');
      } else {
        await adminApi.activateUser(userId);
        setSuccess('Usuario activado exitosamente. Ya puede iniciar sesión.');
      }
      await loadData();
    } catch (err) {
      setError(`Error ${action}ando usuario: ` + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Prevenir auto-eliminación
    const currentUserEmail = localStorage.getItem('userEmail');
    const userToDelete = users.find(u => u.usuario_admin_id === userId);
    
    if (userToDelete && userToDelete.correo_corporativo === currentUserEmail) {
      setError('No puedes eliminarte a ti mismo');
      return;
    }

    // Confirmación doble para eliminar permanentemente
    if (!window.confirm('⚠️ ADVERTENCIA: Esta acción ELIMINARÁ PERMANENTEMENTE el usuario y no se puede deshacer.\n\n¿Estás seguro?')) {
      return;
    }

    if (!window.confirm('⚠️ ÚLTIMA CONFIRMACIÓN: Los datos del usuario se perderán para siempre.\n\n¿Confirmas la eliminación permanente?')) {
      return;
    }

    try {
      await adminApi.deleteAdminUser(userId);
      setSuccess('Usuario eliminado permanentemente de la base de datos.');
      await loadData();
    } catch (err) {
      setError('Error eliminando usuario: ' + err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ nombre: '', apellido: '', correo_corporativo: '', contrasena: '', rol_id: 3 });
  };

  // Verificar permisos antes de renderizar la página
  if (!isAdmin) {
    return (
      <Container fluid>
        <Alert variant="danger">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Acceso Denegado</strong>
          <p>Solo los administradores pueden acceder a la gestión de usuarios.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Gestión de Usuarios Admin</h1>
            <PermissionGuard requiredPermission="GESTIONAR_USUARIOS">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
              </Button>
            </PermissionGuard>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Usuarios Administradores</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo Corporativo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.usuario_admin_id}>
                  <td>{user.usuario_admin_id}</td>
                  <td>{user.nombre} {user.apellido}</td>
                  <td>{user.correo_corporativo}</td>
                  <td>
                    <Badge bg={getRoleBadgeVariant(user.rol_id)}>
                      {getRoleName(user.rol_id)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.activo ? 'success' : 'secondary'}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <PermissionGuard requiredPermission="GESTIONAR_USUARIOS">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditUser(user)}
                        title="Editar usuario"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant={user.activo ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        className="me-2"
                        onClick={() => handleToggleUserStatus(user.usuario_admin_id, user.activo)}
                        title={user.activo ? 'Desactivar usuario (reversible)' : 'Activar usuario'}
                      >
                        <i className={user.activo ? 'bi bi-slash-circle' : 'bi bi-check-circle'}></i>
                      </Button>
                      {/* Solo ADMIN puede eliminar permanentemente */}
                      <PermissionGuard requiredRole="ADMIN">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.usuario_admin_id)}
                          title="Eliminar permanentemente (NO reversible)"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </PermissionGuard>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar usuario */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Editar Usuario Admin' : 'Crear Nuevo Usuario Admin'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Correo Corporativo *</Form.Label>
              <Form.Control
                type="email"
                value={formData.correo_corporativo}
                onChange={(e) => setFormData({...formData, correo_corporativo: e.target.value})}
                placeholder="ejemplo@macrosur.com"
                required
              />
              <Form.Text className="text-muted">
                Debe terminar en @macrosur.com
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Contraseña {editingUser ? '(dejar vacío para mantener actual)' : '*'}
              </Form.Label>
              <Form.Control
                type="password"
                value={formData.contrasena}
                onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                minLength={6}
                required={!editingUser}
                placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol *</Form.Label>
              <Form.Select
                value={formData.rol_id}
                onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
                required
              >
                {roles.map(role => (
                  <option key={role.rol_id} value={role.rol_id}>
                    {role.nombre_rol}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Selecciona el rol que determinará los permisos del usuario
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading 
                ? (editingUser ? 'Actualizando...' : 'Creando...') 
                : (editingUser ? 'Actualizar Usuario' : 'Crear Usuario')
              }
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UsersPage;