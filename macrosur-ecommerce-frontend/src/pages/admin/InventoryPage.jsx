import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { obtenerInventarioCompleto, ajustarInventario, transferirStock } from '../../api/inventory';
import { FaExclamationTriangle, FaExchangeAlt, FaEdit } from 'react-icons/fa';

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
      setError('Error al cargar inventario: ' + err.message);
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
      alert('Error al ajustar inventario: ' + err.message);
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
      alert('Error al transferir stock: ' + err.message);
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

  if (loading) return <Container><p>Cargando inventario...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaExclamationTriangle /> Gestión de Inventario</h2>
          <p className="text-muted">Administra el stock de productos en todas las ubicaciones</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={cargarInventarios}>
            Actualizar
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
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
              {inventarios.map((item) => (
                <tr key={item.inventarioId}>
                  <td><code>{item.sku}</code></td>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.urlImagen && (
                        <img 
                          src={item.urlImagen} 
                          alt={item.nombreProducto}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                        />
                      )}
                      <span>{item.nombreProducto}</span>
                    </div>
                  </td>
                  <td>{item.nombreUbicacion}</td>
                  <td><strong>{item.cantidad}</strong></td>
                  <td>{item.stockMinimoSeguridad}</td>
                  <td>{getStockBadge(item)}</td>
                  <td>
                    {item.tieneAlarma && (
                      <Badge bg="danger">
                        <FaExclamationTriangle /> {item.tipoAlarma}
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAbrirAjuste(item)}
                    >
                      <FaEdit /> Ajustar
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleAbrirTransferencia(item)}
                    >
                      <FaExchangeAlt /> Transferir
                    </Button>
                  </td>
                </tr>
              ))}
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
              <p><strong>Producto:</strong> {selectedItem.nombreProducto}</p>
              <p><strong>SKU:</strong> {selectedItem.sku}</p>
              <p><strong>Cantidad Actual:</strong> {selectedItem.cantidad}</p>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad de Ajuste</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ej: +10 o -5"
                    value={ajusteForm.cantidadAjuste}
                    onChange={(e) => setAjusteForm({ ...ajusteForm, cantidadAjuste: e.target.value })}
                  />
                  <Form.Text>Use números positivos para aumentar y negativos para reducir</Form.Text>
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
              <p><strong>Producto:</strong> {selectedItem.nombreProducto}</p>
              <p><strong>Ubicación Origen:</strong> {selectedItem.nombreUbicacion}</p>
              <p><strong>Cantidad Disponible:</strong> {selectedItem.cantidad}</p>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación Destino</Form.Label>
                  <Form.Select
                    value={transferenciaForm.ubicacionDestinoId}
                    onChange={(e) => setTransferenciaForm({ ...transferenciaForm, ubicacionDestinoId: e.target.value })}
                  >
                    <option value="">Seleccione ubicación...</option>
                    <option value="1">Tienda Principal</option>
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
                    placeholder="Si la transferencia es por un pedido específico"
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
