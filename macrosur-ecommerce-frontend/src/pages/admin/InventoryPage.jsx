import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
// Importamos desde el archivo que acabamos de crear
import { obtenerInventarioCompleto, ajustarInventario, transferirStock } from '../../api/inventory';

const InventoryPage = () => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [showTransferenciaModal, setShowTransferenciaModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [ajusteForm, setAjusteForm] = useState({
    cantidadAjuste: 0,
    motivo: ''
  });
  
  const [transferenciaForm, setTransferenciaForm] = useState({
    ubicacionDestinoId: '',
    cantidad: 0,
    pedidoId: null
  });

  useEffect(() => {
    cargarInventarios();
  }, []);

  const cargarInventarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerInventarioCompleto();
      setInventarios(data);
      setError(null);
    } catch (err) {
      // Mensaje amigable si falla la conexión (común en desarrollo)
      console.error(err);
      setError('No se pudo conectar con el servicio de inventario. Asegúrese de que el Backend esté corriendo en el puerto 8081.');
      setInventarios([]); // Fallback vacío
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirAjuste = (item) => {
    setSelectedItem(item);
    setAjusteForm({ cantidadAjuste: 0, motivo: '' });
    setShowAjusteModal(true);
  };

  const handleAbrirTransferencia = (item) => {
    setSelectedItem(item);
    setTransferenciaForm({ ubicacionDestinoId: '', cantidad: 0, pedidoId: null });
    setShowTransferenciaModal(true);
  };

  const handleAjustar = async () => {
    try {
      const data = {
        varianteId: selectedItem.varianteId,
        ubicacionId: selectedItem.ubicacionId,
        cantidadAjuste: parseInt(ajusteForm.cantidadAjuste),
        motivo: ajusteForm.motivo
      };
      
      await ajustarInventario(data);
      setShowAjusteModal(false);
      cargarInventarios();
      alert('Ajuste realizado exitosamente');
    } catch (err) {
      alert('Error al ajustar inventario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleTransferir = async () => {
    try {
      const data = {
        varianteId: selectedItem.varianteId,
        ubicacionOrigenId: selectedItem.ubicacionId,
        ubicacionDestinoId: parseInt(transferenciaForm.ubicacionDestinoId),
        cantidad: parseInt(transferenciaForm.cantidad),
        pedidoId: transferenciaForm.pedidoId || null
      };
      
      await transferirStock(data);
      setShowTransferenciaModal(false);
      cargarInventarios();
      alert('Transferencia realizada exitosamente');
    } catch (err) {
      alert('Error al transferir stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStockBadge = (item) => {
    if (item.cantidad === 0) {
      return <Badge bg="danger">Sin Stock</Badge>;
    } else if (item.cantidad < item.stockMinimoSeguridad) {
      return <Badge bg="warning">Stock Bajo</Badge>;
    }
    return <Badge bg="success">Stock OK</Badge>;
  };

  if (loading) return <Container className="py-4 text-center"><div className="spinner-border text-primary" role="status"></div><p>Cargando inventario...</p></Container>;
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-exclamation-triangle-fill me-2"></i>Gestión de Inventario</h2>
          <p className="text-muted">Administra el stock de productos en todas las ubicaciones</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={cargarInventarios}>
            <i className="bi bi-arrow-clockwise me-2"></i>Actualizar
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Ubicación</th>
                <th>Cantidad</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
                <th>Alarma</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarios.length > 0 ? (
                inventarios.map((item) => (
                  <tr key={item.inventarioId}>
                    <td><code>{item.sku}</code></td>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.urlImagen && (
                          <img 
                            src={item.urlImagen} 
                            alt={item.nombreProducto}
                            className="rounded border me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <span className="fw-bold">{item.nombreProducto}</span>
                      </div>
                    </td>
                    <td>{item.nombreUbicacion}</td>
                    <td><span className="fs-5 fw-bold">{item.cantidad}</span></td>
                    <td>{item.stockMinimoSeguridad}</td>
                    <td>{getStockBadge(item)}</td>
                    <td>
                      {item.tieneAlarma && (
                        <Badge bg="danger">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>
                          {item.tipoAlarma}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleAbrirAjuste(item)}
                          title="Ajustar Stock"
                        >
                          <i className="bi bi-pencil-square"></i> Ajustar
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleAbrirTransferencia(item)}
                          title="Transferir Stock"
                        >
                          <i className="bi bi-arrow-left-right"></i> Transferir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No hay datos de inventario disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Ajustar Inventario */}
      <Modal show={showAjusteModal} onHide={() => setShowAjusteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajustar Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>Producto:</strong> {selectedItem.nombreProducto}</p>
                <p className="mb-1"><strong>SKU:</strong> {selectedItem.sku}</p>
                <p className="mb-0"><strong>Cantidad Actual:</strong> {selectedItem.cantidad}</p>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad de Ajuste</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ej: +10 o -5"
                    value={ajusteForm.cantidadAjuste}
                    onChange={(e) => setAjusteForm({ ...ajusteForm, cantidadAjuste: e.target.value })}
                  />
                  <Form.Text className="text-muted">Use números positivos para aumentar y negativos para reducir.</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Motivo del Ajuste</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ej: Corrección por inventario físico, merma, etc."
                    value={ajusteForm.motivo}
                    onChange={(e) => setAjusteForm({ ...ajusteForm, motivo: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAjusteModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAjustar}>
            Aplicar Ajuste
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Transferir Stock */}
      <Modal show={showTransferenciaModal} onHide={() => setShowTransferenciaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transferir Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>Producto:</strong> {selectedItem.nombreProducto}</p>
                <p className="mb-1"><strong>Ubicación Origen:</strong> {selectedItem.nombreUbicacion}</p>
                <p className="mb-0"><strong>Disponible:</strong> {selectedItem.cantidad}</p>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación Destino</Form.Label>
                  <Form.Select
                    value={transferenciaForm.ubicacionDestinoId}
                    onChange={(e) => setTransferenciaForm({ ...transferenciaForm, ubicacionDestinoId: e.target.value })}
                  >
                    <option value="">Seleccione ubicación...</option>
                    <option value="1">Tienda Principal</option>
                    <option value="2">Almacén Secundario</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad a Transferir</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={selectedItem.cantidad}
                    value={transferenciaForm.cantidad}
                    onChange={(e) => setTransferenciaForm({ ...transferenciaForm, cantidad: e.target.value })}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>ID de Pedido (Opcional)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Si es para un pedido específico"
                    value={transferenciaForm.pedidoId || ''}
                    onChange={(e) => setTransferenciaForm({ ...transferenciaForm, pedidoId: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransferenciaModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleTransferir}>
            Transferir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InventoryPage;