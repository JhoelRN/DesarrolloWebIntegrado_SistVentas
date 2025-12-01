import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form, InputGroup, Row, Col, ProgressBar, Spinner, Alert } from 'react-bootstrap';
// CORRECCIÓN: Importamos getProducts del archivo products.js que acabamos de asegurar
import { getProducts } from '../../api/products';

const InventoryPage = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos reales al iniciar
  useEffect(() => {
    cargarDatosReales();
  }, []);

  const cargarDatosReales = async () => {
    try {
      setLoading(true);
      // Llamamos a tu Backend (Spring Boot) puerto 8081
      const data = await getProducts({ size: 100 }); 
      
      const listaProductos = data.content || data.productos || [];

      // Adaptamos los datos reales de la BD para la vista de inventario
      const itemsConectados = listaProductos.map(prod => {
        // Simulamos stock ya que el backend aún no lo envía en este endpoint
        const stockSimulado = Math.floor(Math.random() * 50); 
        const stockMinimo = 10;
        let estado = 'Normal';
        if (stockSimulado === 0) estado = 'Agotado';
        else if (stockSimulado < stockMinimo) estado = 'Bajo';

        return {
          id: prod.id,             // ID real
          producto: prod.name,     // Nombre real
          sku: prod.sku || 'S/N',  // Código real
          stock: stockSimulado,
          minimo: stockMinimo,
          ubicacion: 'Almacén A', // Dato fijo por ahora
          estado: estado
        };
      });

      setInventario(itemsConectados);
      setError(null);
    } catch (err) {
      console.error('Error conectando a inventario:', err);
      setError('Error al conectar con la Base de Datos. Verifica que el Backend (8081) esté activo.');
    } finally {
      setLoading(false);
    }
  };

  const getStockVariant = (estado) => {
    switch(estado) {
      case 'Normal': return 'success';
      case 'Bajo': return 'warning';
      case 'Agotado': return 'danger';
      default: return 'primary';
    }
  };

  // Filtrado en el cliente (Frontend)
  const itemsFiltrados = inventario.filter(item => 
    item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2>Control de Inventario</h2>
            <p className="text-muted mb-0">Monitoreo de stock</p>
        </div>
        <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={cargarDatosReales}>
                <i className="bi bi-arrow-clockwise me-2"></i>Actualizar
            </Button>
            <Button variant="primary"><i className="bi bi-box-seam me-2"></i>Ajuste de Stock</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Tarjetas de Resumen (Calculadas con datos reales) */}
      <Row className="mb-4 g-3">
        <Col md={3}>
            <Card className="border-0 shadow-sm bg-primary text-white">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-0">Total Productos</h6>
                            <h2 className="mb-0 fw-bold">{inventario.length}</h2>
                        </div>
                        <i className="bi bi-box fs-1 opacity-50"></i>
                    </div>
                </Card.Body>
            </Card>
        </Col>
        <Col md={3}>
            <Card className="border-0 shadow-sm bg-danger text-white">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-0">Agotados</h6>
                            <h2 className="mb-0 fw-bold">
                                {inventario.filter(i => i.estado === 'Agotado').length}
                            </h2>
                        </div>
                        <i className="bi bi-slash-circle fs-1 opacity-50"></i>
                    </div>
                </Card.Body>
            </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <Row className="align-items-center">
                <Col md={5}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
                        <Form.Control 
                            placeholder="Buscar por nombre o SKU en BD..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body className="p-0">
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Cargando datos desde MySQL...</p>
                </div>
            ) : itemsFiltrados.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    No se encontraron productos en el inventario.
                </div>
            ) : (
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th>Ubicación</th>
                            <th>Stock Físico</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsFiltrados.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="fw-bold">{item.producto}</div>
                                    <small className="text-muted">ID: {item.id}</small>
                                </td>
                                <td><code>{item.sku}</code></td>
                                <td><i className="bi bi-geo-alt me-1 text-muted"></i>{item.ubicacion}</td>
                                <td style={{width: '200px'}}>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">{item.stock}</span>
                                        <ProgressBar 
                                            now={(item.stock / (item.stock + item.minimo)) * 100} 
                                            variant={getStockVariant(item.estado)} 
                                            style={{height: '6px', width: '100px'}} 
                                        />
                                    </div>
                                </td>
                                <td><Badge bg={getStockVariant(item.estado)}>{item.estado}</Badge></td>
                                <td className="text-end">
                                    <Button variant="outline-secondary" size="sm"><i className="bi bi-pencil"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InventoryPage;