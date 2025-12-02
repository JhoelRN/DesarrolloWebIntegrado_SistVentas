/**
 * ProductsPage - Gestión de Productos
 * 
 * Funcionalidades:
 * - Tabla de productos con paginación (20 por página)
 * - Filtros: búsqueda, categoría, rango de precios
 * - CRUD completo con modal
 * - React Quill para ficha técnica HTML
 * - Selector de imágenes
 * - Soft/Hard delete
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, Alert, Spinner, Pagination, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  listarProductos, 
  crearProducto, 
  actualizarProducto, 
  desactivarProducto, 
  eliminarProducto,
  reactivarProducto,
  cambiarEstadoProducto,
  buildSearchParams 
} from '../../api/productos';
import { obtenerCategoriasActivas } from '../../api/categorias';
import ImageSelector from '../../components/product/ImageSelector';
import LazyImage from '../../components/common/LazyImage';

const ProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros y paginación
  const [filtros, setFiltros] = useState({
    search: '',
    categoria: null,
    precioMin: '',
    precioMax: ''
  });
  const [paginacion, setPaginacion] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 20
  });

  // Modal estado
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProducto, setSelectedProducto] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    codigoProducto: '',
    nombreProducto: '',
    descripcionCorta: '',
    fichaTecnicaHtml: '',
    precioUnitario: '',
    pesoKg: '',
    volumenM3: '',
    imagenUrl: '',
    categoriasIds: [],
    activo: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Image Selector Modal
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState({ title: '', html: '' });

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategoriasActivas();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const cargarProductos = async (page = 0) => {
    try {
      setLoading(true);
      const params = buildSearchParams({
        search: filtros.search || undefined,
        categoria: filtros.categoria || undefined,
        precioMin: filtros.precioMin || undefined,
        precioMax: filtros.precioMax || undefined,
        page,
        size: 20,
        sortBy: 'nombreProducto',
        sortDir: 'asc'
      });
      
      const data = await listarProductos(params);
      setProductos(data.productos);
      setPaginacion({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        pageSize: data.pageSize
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar productos: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const handleAplicarFiltros = () => {
    cargarProductos(0);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      search: '',
      categoria: null,
      precioMin: '',
      precioMax: ''
    });
    setTimeout(() => cargarProductos(0), 100);
  };

  const handleOpenModal = (mode, producto = null) => {
    setModalMode(mode);
    setSelectedProducto(producto);
    
    if (mode === 'edit' && producto) {
      console.log('📦 Producto para editar:', producto);
      console.log('📊 pesoKg:', producto.pesoKg, 'tipo:', typeof producto.pesoKg);
      console.log('📊 volumenM3:', producto.volumenM3, 'tipo:', typeof producto.volumenM3);
      
      setFormData({
        codigoProducto: producto.codigoProducto || '',
        nombreProducto: producto.nombreProducto,
        descripcionCorta: producto.descripcionCorta || '',
        fichaTecnicaHtml: producto.fichaTecnicaHtml || '',
        precioUnitario: producto.precioUnitario || '',
        pesoKg: producto.pesoKg ?? '',
        volumenM3: producto.volumenM3 ?? '',
        imagenUrl: producto.imagenUrl || '',
        categoriasIds: producto.categorias?.map(c => c.categoriaId) || [],
        activo: producto.activo
      });
    } else {
      setFormData({
        codigoProducto: '',
        nombreProducto: '',
        descripcionCorta: '',
        fichaTecnicaHtml: '',
        precioUnitario: '',
        pesoKg: '',
        volumenM3: '',
        imagenUrl: '',
        categoriasIds: [],
        activo: true
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProducto(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombreProducto.trim()) {
      errors.nombreProducto = 'El nombre es obligatorio';
    }
    
    if (!formData.precioUnitario || parseFloat(formData.precioUnitario) < 0) {
      errors.precioUnitario = 'El precio debe ser mayor o igual a 0';
    }
    
    if (!formData.pesoKg || parseFloat(formData.pesoKg) <= 0) {
      errors.pesoKg = 'El peso debe ser mayor a 0';
    }
    
    if (formData.categoriasIds.length === 0) {
      errors.categoriasIds = 'Debe seleccionar al menos una categoría';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Validar que la imagen no sea base64 (debe subirse primero)
      if (formData.imagenUrl && formData.imagenUrl.startsWith('data:image')) {
        setFormErrors({ submit: 'Por favor, sube la imagen al servidor antes de guardar (clic en "Subir Imagen")' });
        setSubmitting(false);
        return;
      }
      
      // Limpiar datos antes de enviar: convertir strings vacíos a null y strings a números
      const payload = {
        codigoProducto: formData.codigoProducto || null,
        nombreProducto: formData.nombreProducto,
        descripcionCorta: formData.descripcionCorta || null,
        fichaTecnicaHtml: formData.fichaTecnicaHtml || null,
        precioUnitario: parseFloat(formData.precioUnitario),
        pesoKg: parseFloat(formData.pesoKg),
        volumenM3: formData.volumenM3 ? parseFloat(formData.volumenM3) : null,
        imagenUrl: formData.imagenUrl || null,
        categoriasIds: formData.categoriasIds,
        activo: formData.activo
      };
      
      console.log('📦 Enviando payload:', payload);
      console.log('🔧 Modo:', modalMode);
      console.log('🆔 Producto ID:', selectedProducto?.productoId);
      
      if (modalMode === 'create') {
        console.log('➕ Creando nuevo producto...');
        await crearProducto(payload);
        console.log('✅ Producto creado exitosamente');
      } else {
        console.log('✏️ Actualizando producto', selectedProducto.productoId, '...');
        await actualizarProducto(selectedProducto.productoId, payload);
        console.log('✅ Producto actualizado exitosamente');
      }
      
      console.log('🔄 Recargando lista de productos...');
      await cargarProductos(paginacion.currentPage);
      console.log('🚪 Cerrando modal...');
      handleCloseModal();
    } catch (err) {
      console.error('❌ Error en submit:', err);
      console.error('📋 Error detallado:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setFormErrors({ submit: err.response?.data?.error || err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm('¿Desactivar este producto?')) {
      try {
        await desactivarProducto(id);
        await cargarProductos(paginacion.currentPage);
      } catch (err) {
        alert('Error: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleReactivar = async (id) => {
    try {
      await reactivarProducto(id);
      await cargarProductos(paginacion.currentPage);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const categoriasOptions = categorias.map(c => ({
    value: c.categoriaId,
    label: c.nombre
  }));

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  if (loading && productos.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando productos...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Productos</h2>
          <p className="text-muted">Administra el catálogo de productos</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleOpenModal('create')}>
            + Nuevo Producto
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar por código o nombre..."
                value={filtros.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Select
                isClearable
                placeholder="Filtrar por categoría..."
                value={categoriasOptions.find(o => o.value === filtros.categoria)}
                onChange={(option) => handleFiltroChange('categoria', option?.value || null)}
                options={categoriasOptions}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Precio Min"
                value={filtros.precioMin}
                onChange={(e) => handleFiltroChange('precioMin', e.target.value)}
                step="0.01"
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Precio Max"
                value={filtros.precioMax}
                onChange={(e) => handleFiltroChange('precioMax', e.target.value)}
                step="0.01"
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" onClick={handleAplicarFiltros} className="w-100">
                Filtrar
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Button variant="outline-secondary" size="sm" onClick={handleLimpiarFiltros}>
                Limpiar Filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de Productos */}
      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Peso (kg)</th>
                <th>Categorías</th>
                <th>Ficha Técnica</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No hay productos para mostrar
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.productoId}>
                    <td>
                      {prod.imagenUrl ? (
                        <LazyImage 
                          src={prod.imagenUrl} 
                          alt={prod.nombreProducto} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
                      )}
                    </td>
                    <td>{prod.codigoProducto || '-'}</td>
                    <td><strong>{prod.nombreProducto}</strong></td>
                    <td>${parseFloat(prod.precioUnitario).toFixed(2)}</td>
                    <td>{parseFloat(prod.pesoKg).toFixed(2)}</td>
                    <td>
                      <small>{prod.categoriasNombres || '-'}</small>
                    </td>
                    <td className="text-center">
                      {prod.fichaTecnicaHtml && prod.fichaTecnicaHtml.trim() !== '<p><br></p>' && prod.fichaTecnicaHtml.trim() !== '' ? (
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            setPreviewContent({ 
                              title: prod.nombreProducto, 
                              html: prod.fichaTecnicaHtml 
                            });
                            setShowPreviewModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i> Ver
                        </Button>
                      ) : (
                        <small className="text-muted">Sin ficha</small>
                      )}
                    </td>
                    <td>
                      {prod.activo ? (
                        <Badge bg="success">Activo</Badge>
                      ) : (
                        <Badge bg="danger">Inactivo</Badge>
                      )}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1"
                              onClick={() => handleOpenModal('edit', prod)}>
                        Editar
                      </Button>
                      {prod.activo ? (
                        <Button variant="outline-warning" size="sm"
                                onClick={() => handleSoftDelete(prod.productoId)}>
                          Desactivar
                        </Button>
                      ) : (
                        <Button variant="outline-success" size="sm"
                                onClick={() => handleReactivar(prod.productoId)}>
                          Reactivar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Paginación */}
          {paginacion.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Mostrando {productos.length} de {paginacion.totalItems} productos
              </div>
              <Pagination>
                <Pagination.First onClick={() => cargarProductos(0)} disabled={paginacion.currentPage === 0} />
                <Pagination.Prev onClick={() => cargarProductos(paginacion.currentPage - 1)} 
                                 disabled={paginacion.currentPage === 0} />
                {[...Array(paginacion.totalPages)].map((_, i) => (
                  <Pagination.Item key={i} active={i === paginacion.currentPage} 
                                   onClick={() => cargarProductos(i)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => cargarProductos(paginacion.currentPage + 1)} 
                                 disabled={paginacion.currentPage === paginacion.totalPages - 1} />
                <Pagination.Last onClick={() => cargarProductos(paginacion.totalPages - 1)} 
                                 disabled={paginacion.currentPage === paginacion.totalPages - 1} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Crear/Editar Producto */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {formErrors.submit && <Alert variant="danger">{formErrors.submit}</Alert>}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código del Producto</Form.Label>
                  <Form.Control type="text" value={formData.codigoProducto}
                    onChange={(e) => setFormData({ ...formData, codigoProducto: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control type="text" value={formData.nombreProducto}
                    onChange={(e) => setFormData({ ...formData, nombreProducto: e.target.value })}
                    isInvalid={!!formErrors.nombreProducto} />
                  <Form.Control.Feedback type="invalid">{formErrors.nombreProducto}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción Corta</Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.descripcionCorta}
                onChange={(e) => setFormData({ ...formData, descripcionCorta: e.target.value })} maxLength={500} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ficha Técnica (HTML)</Form.Label>
              <ReactQuill theme="snow" value={formData.fichaTecnicaHtml}
                onChange={(content) => setFormData({ ...formData, fichaTecnicaHtml: content })}
                modules={quillModules} style={{ height: '200px', marginBottom: '50px' }} />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Unitario ($) *</Form.Label>
                  <Form.Control type="number" step="0.01" value={formData.precioUnitario}
                    onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
                    isInvalid={!!formErrors.precioUnitario} />
                  <Form.Control.Feedback type="invalid">{formErrors.precioUnitario}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg) *</Form.Label>
                  <Form.Control type="number" step="0.01" value={formData.pesoKg}
                    onChange={(e) => setFormData({ ...formData, pesoKg: e.target.value })}
                    isInvalid={!!formErrors.pesoKg} />
                  <Form.Control.Feedback type="invalid">{formErrors.pesoKg}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Volumen (m³)</Form.Label>
                  <Form.Control type="number" step="0.0001" value={formData.volumenM3}
                    onChange={(e) => setFormData({ ...formData, volumenM3: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Imagen del Producto</Form.Label>
              <div className="d-flex align-items-center">
                {formData.imagenUrl && (
                  <LazyImage 
                    src={formData.imagenUrl} 
                    alt="Preview" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px', borderRadius: '8px' }} 
                  />
                )}
                <Button variant="outline-primary" onClick={() => setShowImageSelector(true)}>
                  {formData.imagenUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categorías *</Form.Label>
              <Select isMulti placeholder="Seleccionar categorías..."
                value={categoriasOptions.filter(o => formData.categoriasIds.includes(o.value))}
                onChange={(selected) => setFormData({ ...formData, categoriasIds: selected.map(s => s.value) })}
                options={categoriasOptions} />
              {formErrors.categoriasIds && <small className="text-danger">{formErrors.categoriasIds}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Producto Activo" checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />
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

      {/* Image Selector Modal */}
      <ImageSelector
        currentImageUrl={formData.imagenUrl}
        onSelectImage={(url) => setFormData({ ...formData, imagenUrl: url })}
        showModal={showImageSelector}
        onCloseModal={() => setShowImageSelector(false)}
        codigoProducto={formData.codigoProducto || 'PROD'}
      />

      {/* Preview Ficha Técnica Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-text me-2"></i>
            Ficha Técnica: {previewContent.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Card className="border-0 bg-light">
            <Card.Body>
              <div 
                className="ficha-tecnica-preview"
                dangerouslySetInnerHTML={{ __html: previewContent.html }}
                style={{
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}
              />
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsPage;