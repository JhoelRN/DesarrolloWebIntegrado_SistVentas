import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  obtenerPerfil, 
  actualizarPerfil, 
  cambiarContrasena
} from '../../api/clientAuth';
import { obtenerMisResenas, eliminarResena } from '../../api/resenas';
import StarRating from '../../components/product/StarRating';

const ClientProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, userRole, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: ''
  });

  const [passwordData, setPasswordData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resenaToDelete, setResenaToDelete] = useState(null);

  useEffect(() => {
    // Verificar autenticación y que sea un cliente
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRole !== 'CLIENTE') {
      navigate('/');
      return;
    }

    cargarDatos();
  }, [isAuthenticated, userRole, navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [perfilData, resenasData] = await Promise.all([
        obtenerPerfil(),
        obtenerMisResenas()
      ]);

      setCliente(perfilData);
      setResenas(resenasData);

      // Inicializar formulario con datos actuales
      setFormData({
        nombre: perfilData.nombre || '',
        apellido: perfilData.apellido || '',
        telefono: perfilData.telefono || ''
      });

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      await actualizarPerfil(formData);
      
      setSuccess('Perfil actualizado correctamente');
      setEditMode(false);
      
      // Recargar datos
      const perfilActualizado = await obtenerPerfil();
      setCliente(perfilActualizado);

    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (passwordData.contrasenaNueva.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await cambiarContrasena(passwordData.contrasenaActual, passwordData.contrasenaNueva);

      setSuccess('Contraseña cambiada correctamente');
      setShowPasswordModal(false);
      setPasswordData({
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      });

    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    }
  };

  const handleEliminarResena = async () => {
    if (!resenaToDelete) return;

    try {
      await eliminarResena(resenaToDelete);
      setSuccess('Reseña eliminada correctamente');
      setShowDeleteModal(false);
      setResenaToDelete(null);
      
      // Recargar reseñas
      const resenasActualizadas = await obtenerMisResenas();
      setResenas(resenasActualizadas);

    } catch (err) {
      console.error('Error eliminando reseña:', err);
      setError('Error al eliminar la reseña');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!cliente) {
    return (
      <Container className="py-5">
        <Alert variant="danger">No se pudo cargar el perfil del cliente</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Mi Perfil</h2>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              {cliente.avatarUrl ? (
                <img 
                  src={cliente.avatarUrl} 
                  alt={cliente.nombre}
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                >
                  {cliente.nombre?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <h4>{cliente.nombre} {cliente.apellido}</h4>
              <p className="text-muted">{cliente.correo}</p>
              
              {cliente.oauthProvider && (
                <Badge bg="info" className="mb-2">
                  Login con {cliente.oauthProvider === 'google' ? 'Google' : 'Microsoft'}
                </Badge>
              )}

              <div className="text-muted small mt-3">
                <p className="mb-1">Miembro desde</p>
                <p>{new Date(cliente.fechaRegistro).toLocaleDateString('es-PE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Información Personal</h5>
              {!editMode && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  Editar
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {editMode ? (
                <Form onSubmit={handleActualizarPerfil}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido *</Form.Label>
                        <Form.Control
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">
                      Guardar Cambios
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          nombre: cliente.nombre || '',
                          apellido: cliente.apellido || '',
                          telefono: cliente.telefono || ''
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <Row className="mb-3">
                    <Col sm={4}><strong>Nombre:</strong></Col>
                    <Col>{cliente.nombre}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4}><strong>Apellido:</strong></Col>
                    <Col>{cliente.apellido}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4}><strong>Correo:</strong></Col>
                    <Col>{cliente.correo}</Col>
                  </Row>
                  <Row>
                    <Col sm={4}><strong>Teléfono:</strong></Col>
                    <Col>{cliente.telefono || 'No especificado'}</Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>

          {!cliente.oauthProvider && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Seguridad</h5>
              </Card.Header>
              <Card.Body>
                <Button 
                  variant="outline-warning"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Cambiar Contraseña
                </Button>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header>
              <h5 className="mb-0">Mis Reseñas ({resenas.length})</h5>
            </Card.Header>
            <Card.Body>
              {resenas.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  Aún no has escrito ninguna reseña
                </Alert>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {resenas.map(resena => (
                    <Card key={resena.resenaId} className="shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{resena.productoNombre}</h6>
                            <StarRating rating={resena.calificacion} readOnly size="sm" />
                          </div>
                          <div className="d-flex gap-2 align-items-center">
                            <Badge bg={
                              resena.estadoResena === 'Aprobada' ? 'success' :
                              resena.estadoResena === 'Rechazada' ? 'danger' : 'warning'
                            }>
                              {resena.estadoResena}
                            </Badge>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setResenaToDelete(resena.resenaId);
                                setShowDeleteModal(true);
                              }}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted mb-2">{resena.comentario}</p>
                        <small className="text-muted">
                          {new Date(resena.fechaResena).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Cambiar Contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCambiarContrasena}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña Actual *</Form.Label>
              <Form.Control
                type="password"
                name="contrasenaActual"
                value={passwordData.contrasenaActual}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña *</Form.Label>
              <Form.Control
                type="password"
                name="contrasenaNueva"
                value={passwordData.contrasenaNueva}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Mínimo 6 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Nueva Contraseña *</Form.Label>
              <Form.Control
                type="password"
                name="confirmarContrasena"
                value={passwordData.confirmarContrasena}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Cambiar Contraseña
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Confirmar Eliminar Reseña */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarResena}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientProfilePage;
