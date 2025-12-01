import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { obtenerTodasLasOrdenes, crearOrdenReposicion, autorizarOrden, rechazarOrden, recibirMercancia } from '../../api/repositionOrders';
import { obtenerProveedores } from '../../api/logistics';
import axios from 'axios';
import { FaBox, FaPlus, FaCheck, FaTimes, FaTruck, FaFilePdf } from 'react-icons/fa';

const RepositionOrdersPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [variantes, setVariantes] = useState([]); // Lista de productos para dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showRecepcionModal, setShowRecepcionModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  
  const [crearForm, setCrearForm] = useState({
    proveedorId: '',
    items: [{ varianteId: '', cantidadPedida: '' }]
  });
  
  const [recepcionForm, setRecepcionForm] = useState({
    items: []
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [ordenesData, proveedoresData, variantesData] = await Promise.all([
        obtenerTodasLasOrdenes(),
        obtenerProveedores(),
        axios.get('http://localhost:8081/api/productos/variantes', { headers })
      ]);
      setOrdenes(ordenesData);
      setProveedores(proveedoresData);
      setVariantes(variantesData.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearOrden = async () => {
    try {
      const data = {
        proveedorId: parseInt(crearForm.proveedorId),
        items: crearForm.items.map(item => ({
          varianteId: parseInt(item.varianteId),
          cantidadPedida: parseInt(item.cantidadPedida)
        }))
      };
      
      await crearOrdenReposicion(data);
      setShowCrearModal(false);
      cargarDatos();
      alert('Orden creada exitosamente');
    } catch (err) {
      alert('Error al crear orden: ' + err.message);
    }
  };

  const handleAutorizar = async (ordenId) => {
    if (window.confirm('¿Autorizar esta orden de reposición?')) {
      try {
        const usuarioAdminId = 1; // TODO: Obtener del contexto de auth
        await autorizarOrden(ordenId, usuarioAdminId);
        cargarDatos();
        alert('Orden autorizada exitosamente');
      } catch (err) {
        alert('Error al autorizar orden: ' + err.message);
      }
    }
  };

  const handleRechazar = async (ordenId) => {
    if (window.confirm('¿Rechazar esta orden de reposición?')) {
      try {
        await rechazarOrden(ordenId);
        cargarDatos();
        alert('Orden rechazada');
      } catch (err) {
        alert('Error al rechazar orden: ' + err.message);
      }
    }
  };

  const handleAbrirRecepcion = (orden) => {
    setSelectedOrden(orden);
    setRecepcionForm({
      items: orden.detalles.map(detalle => ({
        detalleOrdenId: detalle.detalleOrdenId,
        cantidadPedida: detalle.cantidadPedida,
        cantidadRecibida: detalle.cantidadPedida
      }))
    });
    setShowRecepcionModal(true);
  };

  const handleRecibirMercancia = async () => {
    try {
      const data = {
        ordenReposicionId: selectedOrden.ordenReposicionId,
        items: recepcionForm.items.map(item => ({
          detalleOrdenId: item.detalleOrdenId,
          cantidadRecibida: parseInt(item.cantidadRecibida)
        }))
      };
      
      await recibirMercancia(data);
      setShowRecepcionModal(false);
      cargarDatos();
      alert('Mercancía recibida exitosamente');
    } catch (err) {
      alert('Error al recibir mercancía: ' + err.message);
    }
  };

  const agregarItem = () => {
    setCrearForm({
      ...crearForm,
      items: [...crearForm.items, { varianteId: '', cantidadPedida: '' }]
    });
  };

  const actualizarItem = (index, field, value) => {
    const newItems = [...crearForm.items];
    newItems[index][field] = value;
    setCrearForm({ ...crearForm, items: newItems });
  };

  const eliminarItem = (index) => {
    const newItems = crearForm.items.filter((_, i) => i !== index);
    setCrearForm({ ...crearForm, items: newItems });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': <Badge bg="warning">Pendiente</Badge>,
      'Autorizada': <Badge bg="info">Autorizada</Badge>,
      'Rechazada': <Badge bg="danger">Rechazada</Badge>,
      'Recibida': <Badge bg="success">Recibida</Badge>
    };
    return badges[estado] || <Badge bg="secondary">{estado}</Badge>;
  };

  const ordenesFiltradas = filtroEstado === 'TODAS' 
    ? ordenes 
    : ordenes.filter(o => o.estadoAutorizacion === filtroEstado);

  if (loading) return <Container><p>Cargando órdenes...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaBox /> Órdenes de Reposición</h2>
          <p className="text-muted">Gestiona las órdenes de compra a proveedores</p>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setShowCrearModal(true)}>
            <FaPlus /> Nueva Orden
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex gap-2">
            <Button 
              variant={filtroEstado === 'TODAS' ? 'primary' : 'outline-primary'}
              onClick={() => setFiltroEstado('TODAS')}
            >
              Todas ({ordenes.length})
            </Button>
            <Button 
              variant={filtroEstado === 'Pendiente' ? 'warning' : 'outline-warning'}
              onClick={() => setFiltroEstado('Pendiente')}
            >
              Pendientes ({ordenes.filter(o => o.estadoAutorizacion === 'Pendiente').length})
            </Button>
            <Button 
              variant={filtroEstado === 'Autorizada' ? 'info' : 'outline-info'}
              onClick={() => setFiltroEstado('Autorizada')}
            >
              Autorizadas ({ordenes.filter(o => o.estadoAutorizacion === 'Autorizada').length})
            </Button>
            <Button 
              variant={filtroEstado === 'Recibida' ? 'success' : 'outline-success'}
              onClick={() => setFiltroEstado('Recibida')}
            >
              Recibidas ({ordenes.filter(o => o.estadoAutorizacion === 'Recibida').length})
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha Solicitud</th>
                <th>Estado</th>
                <th>Items</th>
                <th>Costo Total</th>
                <th>Fecha Recepción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((orden) => (
                <tr key={orden.ordenReposicionId}>
                  <td><code>#{orden.ordenReposicionId}</code></td>
                  <td>
                    <strong>{orden.nombreProveedor}</strong><br/>
                    <small className="text-muted">{orden.contactoProveedor}</small>
                  </td>
                  <td>{new Date(orden.fechaSolicitud).toLocaleString()}</td>
                  <td>{getEstadoBadge(orden.estadoAutorizacion)}</td>
                  <td>{orden.detalles?.length || 0} items</td>
                  <td><strong>${orden.costoTotal?.toFixed(2)}</strong></td>
                  <td>
                    {orden.fechaRecepcion 
                      ? new Date(orden.fechaRecepcion).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {orden.estadoAutorizacion === 'Pendiente' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAutorizar(orden.ordenReposicionId)}
                          >
                            <FaCheck /> Autorizar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRechazar(orden.ordenReposicionId)}
                          >
                            <FaTimes /> Rechazar
                          </Button>
                        </>
                      )}
                      {orden.estadoAutorizacion === 'Autorizada' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAbrirRecepcion(orden)}
                        >
                          <FaTruck /> Recibir Mercancía
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`http://localhost:8081/api/logistica/ordenes-reposicion/${orden.ordenReposicionId}/pdf`, '_blank')}
                      >
                        <FaFilePdf /> PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Crear Orden */}
      <Modal show={showCrearModal} onHide={() => setShowCrearModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Orden de Reposición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor</Form.Label>
              <Form.Select
                value={crearForm.proveedorId}
                onChange={(e) => setCrearForm({ ...crearForm, proveedorId: e.target.value })}
              >
                <option value="">Seleccione proveedor...</option>
                {proveedores.map(p => (
                  <option key={p.proveedorId} value={p.proveedorId}>
                    {p.nombre} - {p.contacto}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <h5 className="mb-3 text-danger">🛒 PRODUCTOS DE LA ORDEN (NUEVO DROPDOWN)</h5>
            {crearForm.items.map((item, index) => (
              <Row key={index} className="mb-3 align-items-end border border-success p-2 rounded">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-primary">📦 Producto (Seleccionar del listado)</Form.Label>
                    <Form.Select
                      value={item.varianteId}
                      onChange={(e) => actualizarItem(index, 'varianteId', e.target.value)}
                      className="border-primary border-3"
                      style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                      <option value="">-- 🔽 SELECCIONE UN PRODUCTO 🔽 --</option>
                      {variantes.map(v => (
                        <option key={v.varianteId} value={v.varianteId}>
                          {v.sku} - {v.producto?.nombreProducto || 'Sin nombre'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Cantidad"
                      min="1"
                      value={item.cantidadPedida}
                      onChange={(e) => actualizarItem(index, 'cantidadPedida', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Button
                    variant="danger"
                    onClick={() => eliminarItem(index)}
                    disabled={crearForm.items.length === 1}
                    className="w-100"
                  >
                    Eliminar
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-primary" onClick={agregarItem} className="mt-2">
              <FaPlus /> Agregar Item
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCrearModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrearOrden}>
            Crear Orden
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Recibir Mercancía */}
      <Modal show={showRecepcionModal} onHide={() => setShowRecepcionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Recibir Mercancía - Orden #{selectedOrden?.ordenReposicionId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrden && (
            <>
              <Alert variant="info">
                Confirme las cantidades recibidas. Puede ser diferente a la cantidad pedida.
              </Alert>
              <Table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Pedida</th>
                    <th>Recibida</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrden.detalles.map((detalle, index) => (
                    <tr key={detalle.detalleOrdenId}>
                      <td>{detalle.nombreProducto}</td>
                      <td><code>{detalle.sku}</code></td>
                      <td><strong>{detalle.cantidadPedida}</strong></td>
                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          max={detalle.cantidadPedida}
                          value={recepcionForm.items[index]?.cantidadRecibida || 0}
                          onChange={(e) => {
                            const newItems = [...recepcionForm.items];
                            newItems[index].cantidadRecibida = e.target.value;
                            setRecepcionForm({ items: newItems });
                          }}
                          style={{ width: '100px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecepcionModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleRecibirMercancia}>
            <FaCheck /> Confirmar Recepción
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RepositionOrdersPage;