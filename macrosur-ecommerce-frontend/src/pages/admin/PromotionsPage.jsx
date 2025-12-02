/**
 * Página de Gestión de Promociones - CRUD Completo
 * 
 * ARQUITECTURA HÍBRIDA:
 * - Frontend: React + Bootstrap (UI/UX)
 * - Ajax: Axios (GET/POST/PUT/DELETE)
 * - Backend: Spring Boot REST API
 * - Patrón MVC: View (React) + Controller (REST) + Model (JPA Entity)
 * 
 * COMPONENTES:
 * - Lista de promociones con DataTable
 * - Formulario modal para crear/editar
 * - Filtros y búsqueda
 * - Estadísticas en tiempo real
 * - Validaciones frontend y backend
 */

import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Table, Modal, Form, 
  Badge, Alert, Spinner, InputGroup, ButtonGroup 
} from 'react-bootstrap';
import { 
  obtenerPromociones, 
  obtenerPromocionesActivas,
  crearPromocion, 
  actualizarPromocion, 
  eliminarPromocion,
  buscarPromocionesPorNombre,
  obtenerPromocionesPorTipo,
  obtenerEstadisticas,
  calcularDescuento,
  validarPromocion,
  formatearFechaParaInput,
  obtenerEstadoBadge,
  TIPOS_DESCUENTO
} from '../../api/promociones';

const PromotionsPage = () => {
  // ========== STATE MANAGEMENT ==========
  const [promociones, setPromociones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [promocionActual, setPromocionActual] = useState(null);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [soloActivas, setSoloActivas] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    nombreRegla: '',
    tipoDescuento: 'Porcentaje',
    valorDescuento: '',
    acumulable: true,
    exclusivo: false,
    fechaInicio: '',
    fechaFin: '',
    segmentacionJson: ''
  });

  // Calculadora de descuento
  const [precioCalculo, setPrecioCalculo] = useState('');
  const [resultadoCalculo, setResultadoCalculo] = useState(null);

  // ========== EFFECTS ==========
  useEffect(() => {
    cargarDatos();
  }, [soloActivas]);

  // ========== FUNCIONES PRINCIPALES ==========

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [promos, stats] = await Promise.all([
        soloActivas ? obtenerPromocionesActivas() : obtenerPromociones(),
        obtenerEstadisticas()
      ]);

      setPromociones(promos);
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(typeof err === 'string' ? err : 'Error al cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    
    // Validar frontend
    const errores = validarPromocion(formData);
    if (errores.length > 0) {
      setError(errores.join('. '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (modoEdicion && promocionActual) {
        await actualizarPromocion(promocionActual.reglaId, formData);
        setSuccess('Promoción actualizada correctamente');
      } else {
        await crearPromocion(formData);
        setSuccess('Promoción creada correctamente');
      }

      cerrarModal();
      await cargarDatos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar la promoción "${nombre}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await eliminarPromocion(id);
      setSuccess('Promoción eliminada correctamente');
      await cargarDatos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al eliminar la promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!filtroNombre.trim()) {
      await cargarDatos();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resultados = await buscarPromocionesPorNombre(filtroNombre);
      setPromociones(resultados);
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarTipo = async (tipo) => {
    setFiltroTipo(tipo);
    
    if (!tipo) {
      await cargarDatos();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resultados = await obtenerPromocionesPorTipo(tipo);
      setPromociones(resultados);
    } catch (err) {
      setError('Error al filtrar');
    } finally {
      setLoading(false);
    }
  };

  const handleCalcularDescuento = async (promocionId) => {
    if (!precioCalculo || precioCalculo <= 0) {
      setError('Ingrese un precio válido');
      return;
    }

    try {
      const resultado = await calcularDescuento(promocionId, parseFloat(precioCalculo));
      setResultadoCalculo(resultado);
    } catch (err) {
      setError('Error al calcular descuento');
    }
  };

  // ========== FUNCIONES AUXILIARES ==========

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setPromocionActual(null);
    setFormData({
      nombreRegla: '',
      tipoDescuento: 'Porcentaje',
      valorDescuento: '',
      acumulable: true,
      exclusivo: false,
      fechaInicio: '',
      fechaFin: '',
      segmentacionJson: null
    });
    setShowModal(true);
  };

  const abrirModalEditar = (promocion) => {
    setModoEdicion(true);
    setPromocionActual(promocion);
    setFormData({
      nombreRegla: promocion.nombreRegla,
      tipoDescuento: promocion.tipoDescuento,
      valorDescuento: promocion.valorDescuento,
      acumulable: promocion.acumulable,
      exclusivo: promocion.exclusivo,
      fechaInicio: formatearFechaParaInput(promocion.fechaInicio),
      fechaFin: formatearFechaParaInput(promocion.fechaFin),
      segmentacionJson: promocion.segmentacionJson || null
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setPromocionActual(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si cambia el tipo de descuento a 2x1 o Envío Gratis, asignar valor 0
    if (name === 'tipoDescuento' && (value === 'Dos_X_Uno' || value === 'Envio_Gratis')) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        valorDescuento: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // ========== RENDER ==========

  if (loading && promociones.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando promociones...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* HEADER */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">
            <i className="bi bi-percent me-2"></i>
            Gestión de Promociones
          </h2>
          <p className="text-muted">
            Administración de descuentos, cupones y campañas promocionales
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={abrirModalNuevo}>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Promoción
          </Button>
        </Col>
      </Row>

      {/* ALERTAS */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* ESTADÍSTICAS */}
      {estadisticas && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Promociones</h6>
                <h2 className="mb-0 text-primary">{estadisticas.totalPromociones}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h6 className="text-muted mb-2">Activas</h6>
                <h2 className="mb-0 text-success">{estadisticas.promocionesActivas}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h6 className="text-muted mb-2">Inactivas</h6>
                <h2 className="mb-0 text-secondary">{estadisticas.promocionesInactivas}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h6 className="text-muted mb-2">Próximas a Expirar</h6>
                <h2 className="mb-0 text-warning">{estadisticas.proximasExpirar}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* FILTROS */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  placeholder="Buscar por nombre..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                />
                <Button variant="outline-primary" onClick={handleBuscar}>
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={filtroTipo} 
                onChange={(e) => handleFiltrarTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {TIPOS_DESCUENTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Check 
                type="switch"
                id="solo-activas-switch"
                label="Mostrar solo promociones activas"
                checked={soloActivas}
                onChange={(e) => setSoloActivas(e.target.checked)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABLA DE PROMOCIONES */}
      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Vigencia</th>
                <th>Acumulable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No se encontraron promociones
                  </td>
                </tr>
              ) : (
                promociones.map(promo => (
                  <tr key={promo.reglaId}>
                    <td>{promo.reglaId}</td>
                    <td>
                      <strong>{promo.nombreRegla}</strong>
                    </td>
                    <td>
                      <Badge bg="info">{promo.tipoDescuento}</Badge>
                    </td>
                    <td>
                      {promo.tipoDescuento === 'Porcentaje' 
                        ? `${promo.valorDescuento}%` 
                        : promo.tipoDescuento === 'Monto_Fijo'
                        ? `$${promo.valorDescuento.toLocaleString('es-CL')}`
                        : promo.tipoDescuento}
                    </td>
                    <td>
                      <Badge bg={obtenerEstadoBadge(promo)}>
                        {promo.estadoTexto}
                      </Badge>
                    </td>
                    <td className="small">
                      {promo.fechaInicio && (
                        <div>Inicio: {new Date(promo.fechaInicio).toLocaleDateString('es-CL')}</div>
                      )}
                      {promo.fechaFin && (
                        <div>Fin: {new Date(promo.fechaFin).toLocaleDateString('es-CL')}</div>
                      )}
                      {promo.diasRestantes !== null && promo.diasRestantes > 0 && (
                        <div className="text-warning">
                          <small>{promo.diasRestantes} días restantes</small>
                        </div>
                      )}
                    </td>
                    <td>
                      {promo.acumulable && <Badge bg="secondary">Acumulable</Badge>}
                      {promo.exclusivo && <Badge bg="warning">Exclusivo</Badge>}
                    </td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => abrirModalEditar(promo)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleEliminar(promo.reglaId, promo.nombreRegla)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL CREAR/EDITAR */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modoEdicion ? 'Editar Promoción' : 'Nueva Promoción'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCrear}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Promoción *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombreRegla"
                    value={formData.nombreRegla}
                    onChange={handleInputChange}
                    placeholder="Ej: Black Friday 2024"
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Descuento *</Form.Label>
                  <Form.Select
                    name="tipoDescuento"
                    value={formData.tipoDescuento}
                    onChange={handleInputChange}
                    required
                  >
                    {TIPOS_DESCUENTO.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Valor {(formData.tipoDescuento !== 'Dos_X_Uno' && formData.tipoDescuento !== 'Envio_Gratis') ? '*' : ''}
                    {formData.tipoDescuento === 'Porcentaje' && ' (%)'}
                    {formData.tipoDescuento === 'Monto_Fijo' && ' ($)'}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="valorDescuento"
                    value={formData.valorDescuento}
                    onChange={handleInputChange}
                    placeholder="Ej: 20"
                    required={formData.tipoDescuento !== 'Dos_X_Uno' && formData.tipoDescuento !== 'Envio_Gratis'}
                    min="0"
                    step="0.01"
                    disabled={formData.tipoDescuento === 'Dos_X_Uno' || formData.tipoDescuento === 'Envio_Gratis'}
                  />
                  {(formData.tipoDescuento === 'Dos_X_Uno' || formData.tipoDescuento === 'Envio_Gratis') && (
                    <Form.Text className="text-muted">
                      Este tipo de promoción no requiere valor numérico
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Check 
                  type="checkbox"
                  id="acumulable-check"
                  name="acumulable"
                  label="Acumulable con otras promociones"
                  checked={formData.acumulable}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={6}>
                <Form.Check 
                  type="checkbox"
                  id="exclusivo-check"
                  name="exclusivo"
                  label="Promoción exclusiva (no acumulable)"
                  checked={formData.exclusivo}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>

            {error && (
              <Alert variant="danger" className="mt-3 mb-0">
                {error}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  {modoEdicion ? 'Actualizar' : 'Crear'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PromotionsPage;
