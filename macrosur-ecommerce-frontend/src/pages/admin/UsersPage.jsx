import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import * as adminApi from '../../api/admin';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_corporativo: '',
    contrasena: '',
    rol_id: 1
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
      await adminApi.createAdminUser(formData);
      setSuccess('Usuario creado exitosamente');
      setShowModal(false);
      setFormData({ nombre: '', apellido: '', correo_corporativo: '', contrasena: '', rol_id: 1 });
      await loadData(); // Recargar lista
    } catch (err) {
      setError('Error creando usuario: ' + err.message);
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

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Gestión de Usuarios Admin</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
            </Button>
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
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <i className="bi bi-trash"></i>
                    </Button>
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

      {/* Modal para crear usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario Admin</Modal.Title>
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
              <Form.Label>Contraseña *</Form.Label>
              <Form.Control
                type="password"
                value={formData.contrasena}
                onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                minLength={6}
                required
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
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UsersPage;