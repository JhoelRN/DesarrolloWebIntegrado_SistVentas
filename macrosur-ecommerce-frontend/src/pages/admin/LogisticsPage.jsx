import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { 
  obtenerOperadores, 
  obtenerProveedores,
  crearOperador, 
  actualizarOperador, 
  eliminarOperador,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} from '../../api/logistics';
import { FaTruck, FaPlus, FaEdit, FaTrash, FaBox } from 'react-icons/fa';

const LogisticsPage = () => {
  const [operadores, setOperadores] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('operadores');
  
  // Modales y formularios para Operadores
  const [showOperadorModal, setShowOperadorModal] = useState(false);
  const [editandoOperador, setEditandoOperador] = useState(null);
  const [operadorForm, setOperadorForm] = useState({
    nombre: '',
    urlRastreoBase: ''
  });
  
  // Modales y formularios para Proveedores
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [editandoProveedor, setEditandoProveedor] = useState(null);
  const [proveedorForm, setProveedorForm] = useState({
    nombre: '',
    contacto: '',
    telefono: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [operadoresData, proveedoresData] = await Promise.all([
        obtenerOperadores(),
        obtenerProveedores()
      ]);
      setOperadores(operadoresData);
      setProveedores(proveedoresData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== OPERADORES ====================
  
  const handleAbrirModalOperador = (operador = null) => {
    if (operador) {
      setEditandoOperador(operador);
      setOperadorForm({
        nombre: operador.nombre,
        urlRastreoBase: operador.urlRastreoBase
      });
    } else {
      setEditandoOperador(null);
      setOperadorForm({
        nombre: '',
        urlRastreoBase: ''
      });
    }
    setShowOperadorModal(true);
  };

  const handleGuardarOperador = async () => {
    try {
      if (editandoOperador) {
        await actualizarOperador(editandoOperador.operadorId, operadorForm);
        alert('Operador actualizado exitosamente');
      } else {
        await crearOperador(operadorForm);
        alert('Operador creado exitosamente');
      }
      setShowOperadorModal(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar operador: ' + err.message);
    }
  };

  const handleEliminarOperador = async (operadorId) => {
    if (window.confirm('¿Está seguro de eliminar este operador logístico?')) {
      try {
        await eliminarOperador(operadorId);
        alert('Operador eliminado exitosamente');
        cargarDatos();
      } catch (err) {
        alert('Error al eliminar operador: ' + err.message);
      }
    }
  };

  // ==================== PROVEEDORES ====================
  
  const handleAbrirModalProveedor = (proveedor = null) => {
    if (proveedor) {
      setEditandoProveedor(proveedor);
      setProveedorForm({
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono
      });
    } else {
      setEditandoProveedor(null);
      setProveedorForm({
        nombre: '',
        contacto: '',
        telefono: ''
      });
    }
    setShowProveedorModal(true);
  };

  const handleGuardarProveedor = async () => {
    try {
      if (editandoProveedor) {
        await actualizarProveedor(editandoProveedor.proveedorId, proveedorForm);
        alert('Proveedor actualizado exitosamente');
      } else {
        await crearProveedor(proveedorForm);
        alert('Proveedor creado exitosamente');
      }
      setShowProveedorModal(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar proveedor: ' + err.message);
    }
  };

  const handleEliminarProveedor = async (proveedorId) => {
    if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
      try {
        await eliminarProveedor(proveedorId);
        alert('Proveedor eliminado exitosamente');
        cargarDatos();
      } catch (err) {
        alert('Error al eliminar proveedor: ' + err.message);
      }
    }
  };

  if (loading) return <Container><p>Cargando datos...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaTruck /> Gestión Logística</h2>
          <p className="text-muted">Administra operadores de envío y proveedores</p>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        
        {/* TAB: OPERADORES LOGÍSTICOS */}
        <Tab eventKey="operadores" title={<><FaTruck /> Operadores ({operadores.length})</>}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Operadores Logísticos</h5>
              <Button variant="success" onClick={() => handleAbrirModalOperador()}>
                <FaPlus /> Nuevo Operador
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>URL Rastreo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {operadores.map((operador) => (
                    <tr key={operador.operadorId}>
                      <td><code>#{operador.operadorId}</code></td>
                      <td><strong>{operador.nombre}</strong></td>
                      <td>
                        <a href={operador.urlRastreoBase} target="_blank" rel="noopener noreferrer" className="small">
                          {operador.urlRastreoBase?.substring(0, 50)}...
                        </a>
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleAbrirModalOperador(operador)}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleEliminarOperador(operador.operadorId)}
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB: PROVEEDORES */}
        <Tab eventKey="proveedores" title={<><FaBox /> Proveedores ({proveedores.length})</>}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Proveedores</h5>
              <Button variant="success" onClick={() => handleAbrirModalProveedor()}>
                <FaPlus /> Nuevo Proveedor
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.proveedorId}>
                      <td><code>#{proveedor.proveedorId}</code></td>
                      <td><strong>{proveedor.nombre}</strong></td>
                      <td>{proveedor.contacto}</td>
                      <td>{proveedor.telefono}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleAbrirModalProveedor(proveedor)}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleEliminarProveedor(proveedor.proveedorId)}
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal Operador */}
      <Modal show={showOperadorModal} onHide={() => setShowOperadorModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editandoOperador ? 'Editar Operador' : 'Nuevo Operador'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Operador *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Olva Courier"
                value={operadorForm.nombre}
                onChange={(e) => setOperadorForm({ ...operadorForm, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de Rastreo *</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://www.operador.com/rastreo?guia="
                value={operadorForm.urlRastreoBase}
                onChange={(e) => setOperadorForm({ ...operadorForm, urlRastreoBase: e.target.value })}
              />
              <Form.Text>La URL debe incluir el parámetro donde se concatenará el número de guía</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOperadorModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarOperador}>
            {editandoOperador ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Proveedor */}
      <Modal show={showProveedorModal} onHide={() => setShowProveedorModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editandoProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Proveedor *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Distribuidora Tech SAC"
                value={proveedorForm.nombre}
                onChange={(e) => setProveedorForm({ ...proveedorForm, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Persona de Contacto del Proveedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan Pérez - Gerente de Ventas"
                value={proveedorForm.contacto}
                onChange={(e) => setProveedorForm({ ...proveedorForm, contacto: e.target.value })}
              />
              <Form.Text className="text-muted">
                Nombre y cargo de la persona del proveedor con quien coordinamos pedidos
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono del Proveedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: +51 987654321"
                value={proveedorForm.telefono}
                onChange={(e) => setProveedorForm({ ...proveedorForm, telefono: e.target.value })}
              />
              <Form.Text className="text-muted">
                Teléfono directo del contacto o línea principal del proveedor
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProveedorModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarProveedor}>
            {editandoProveedor ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LogisticsPage;