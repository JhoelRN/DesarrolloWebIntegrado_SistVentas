/**
 * CategoriesPage - Gestión de Categorías
 * 
 * Funcionalidades:
 * - Tabla con todas las categorías (activas e inactivas)
 * - Árbol jerárquico (padre-hijo)
 * - CRUD completo con modal
 * - Soft/Hard delete
 * - Búsqueda por nombre
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { 
  obtenerTodasCategorias, 
  crearCategoria, 
  actualizarCategoria, 
  desactivarCategoria, 
  eliminarCategoria,
  reactivarCategoria,
  buscarCategorias 
} from '../../api/categorias';

const CategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal estado
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoriaPadreId: null,
    visibleCliente: true,
    activo: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cargar categorías al montar
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasCategorias();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar categorías: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      cargarCategorias();
    } else {
      try {
        const data = await buscarCategorias(term);
        setCategorias(data);
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    }
  };

  const handleOpenModal = (mode, categoria = null) => {
    setModalMode(mode);
    setSelectedCategoria(categoria);
    
    if (mode === 'edit' && categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        categoriaPadreId: categoria.categoriaPadreId,
        visibleCliente: categoria.visibleCliente,
        activo: categoria.activo
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        categoriaPadreId: null,
        visibleCliente: true,
        activo: true
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategoria(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoriaPadreId: null,
      visibleCliente: true,
      activo: true
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2 || formData.nombre.length > 100) {
      errors.nombre = 'El nombre debe tener entre 2 y 100 caracteres';
    }
    
    if (formData.descripcion && formData.descripcion.length > 1000) {
      errors.descripcion = 'La descripción no puede exceder 1000 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      if (modalMode === 'create') {
        await crearCategoria(formData);
      } else {
        await actualizarCategoria(selectedCategoria.categoriaId, formData);
      }
      
      await cargarCategorias();
      handleCloseModal();
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.error || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm('¿Desactivar esta categoría?')) {
      try {
        await desactivarCategoria(id);
        await cargarCategorias();
      } catch (err) {
        alert('Error: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm('¿ELIMINAR PERMANENTEMENTE esta categoría? Esta acción no se puede deshacer.')) {
      try {
        await eliminarCategoria(id);
        await cargarCategorias();
      } catch (err) {
        alert('Error: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleReactivar = async (id) => {
    try {
      await reactivarCategoria(id);
      await cargarCategorias();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // Opciones para selector de categoría padre
  const categoriasParaSelect = categorias
    .filter(c => c.activo && (modalMode === 'create' || c.categoriaId !== selectedCategoria?.categoriaId))
    .map(c => ({
      value: c.categoriaId,
      label: `${'  '.repeat(c.nivel || 0)}${c.nombre}`
    }));

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando categorías...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Categorías</h2>
          <p className="text-muted">Administra las categorías de productos con soporte jerárquico</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar categorías por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => handleOpenModal('create')}>
            + Nueva Categoría
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Padre</th>
                <th>Nivel</th>
                <th>Visible Cliente</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No hay categorías para mostrar
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.categoriaId}>
                    <td>{cat.categoriaId}</td>
                    <td>
                      <span style={{ marginLeft: `${(cat.nivel || 0) * 20}px` }}>
                        {cat.nivel > 0 && '└─ '}
                        <strong>{cat.nombre}</strong>
                      </span>
                    </td>
                    <td>{cat.descripcion ? cat.descripcion.substring(0, 50) + '...' : '-'}</td>
                    <td>{cat.categoriaPadreNombre || '-'}</td>
                    <td>
                      <Badge bg="secondary">{cat.nivel || 0}</Badge>
                    </td>
                    <td>
                      {cat.visibleCliente ? (
                        <Badge bg="success">Sí</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
                    <td>
                      <Badge bg="info">{cat.cantidadProductos || 0}</Badge>
                    </td>
                    <td>
                      {cat.activo ? (
                        <Badge bg="success">Activa</Badge>
                      ) : (
                        <Badge bg="danger">Inactiva</Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleOpenModal('edit', cat)}
                      >
                        Editar
                      </Button>
                      {cat.activo ? (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleSoftDelete(cat.categoriaId)}
                        >
                          Desactivar
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => handleReactivar(cat.categoriaId)}
                        >
                          Reactivar
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleHardDelete(cat.categoriaId)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para Crear/Editar */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger">{formErrors.submit}</Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                isInvalid={!!formErrors.nombre}
                maxLength={100}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                isInvalid={!!formErrors.descripcion}
                maxLength={1000}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.descripcion}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría Padre (opcional)</Form.Label>
              <Select
                isClearable
                placeholder="Seleccionar categoría padre..."
                value={categoriasParaSelect.find(o => o.value === formData.categoriaPadreId)}
                onChange={(option) => setFormData({ ...formData, categoriaPadreId: option?.value || null })}
                options={categoriasParaSelect}
              />
              <Form.Text className="text-muted">
                Si no seleccionas una, será una categoría raíz
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Visible para clientes"
                checked={formData.visibleCliente}
                onChange={(e) => setFormData({ ...formData, visibleCliente: e.target.checked })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activa"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Actualizar')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CategoriesPage;