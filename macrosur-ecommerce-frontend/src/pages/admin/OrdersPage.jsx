import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';

const OrdersPage = () => {
  // Datos simulados (MOCK DATA) para la presentación
  const [pedidos, setPedidos] = useState([
    { id: 'ORD-23001', cliente: 'Juan Perez', fecha: '2025-11-28', total: 450.00, metodo: 'Tarjeta', estado: 'Entregado', items: 2 },
    { id: 'ORD-23002', cliente: 'Maria Garcia', fecha: '2025-11-29', total: 120.50, metodo: 'Yape', estado: 'En Camino', items: 1 },
    { id: 'ORD-23003', cliente: 'Carlos Lopez', fecha: '2025-11-29', total: 890.00, metodo: 'Tarjeta', estado: 'Pendiente', items: 4 },
    { id: 'ORD-23004', cliente: 'Ana Torres', fecha: '2025-11-30', total: 35.00, metodo: 'Efectivo', estado: 'Cancelado', items: 1 },
    { id: 'ORD-23005', cliente: 'Luis Diaz', fecha: '2025-11-30', total: 1250.00, metodo: 'Tarjeta', estado: 'Procesando', items: 3 },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
        case 'Entregado': return 'success';
        case 'En Camino': return 'info';
        case 'Procesando': return 'primary';
        case 'Pendiente': return 'warning';
        case 'Cancelado': return 'danger';
        default: return 'secondary';
    }
  };

  const handleSearch = (e) => {
    // Lógica de filtrado simulada
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2>Gestión de Pedidos</h2>
            <p className="text-muted mb-0">Seguimiento de ventas y despachos</p>
        </div>
        <div className="d-flex gap-2">
            <Button variant="outline-success"><i className="bi bi-file-earmark-excel me-2"></i>Exportar Excel</Button>
            <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>Crear Pedido</Button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <Row className="mb-4 g-3">
        <Col md={3}>
            <Card className="border-0 shadow-sm border-start border-4 border-primary">
                <Card.Body>
                    <div className="text-muted small">Ventas Hoy</div>
                    <h3 className="mb-0">S/ 1,285.00</h3>
                </Card.Body>
            </Card>
        </Col>
        <Col md={3}>
            <Card className="border-0 shadow-sm border-start border-4 border-warning">
                <Card.Body>
                    <div className="text-muted small">Pendientes</div>
                    <h3 className="mb-0">5</h3>
                </Card.Body>
            </Card>
        </Col>
        <Col md={3}>
            <Card className="border-0 shadow-sm border-start border-4 border-success">
                <Card.Body>
                    <div className="text-muted small">Entregados (Mes)</div>
                    <h3 className="mb-0">124</h3>
                </Card.Body>
            </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <Row>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
                        <Form.Control placeholder="Buscar pedido, cliente o DNI..." />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Select>
                        <option>Todos los estados</option>
                        <option>Pendiente</option>
                        <option>En Camino</option>
                        <option>Entregado</option>
                    </Form.Select>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body className="p-0">
            <Table hover responsive className="mb-0 align-middle">
                <thead className="bg-light">
                    <tr>
                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Pago</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td><span className="fw-bold text-primary">#{pedido.id}</span><br/><small className="text-muted">{pedido.items} items</small></td>
                            <td>{pedido.cliente}</td>
                            <td>{pedido.fecha}</td>
                            <td><Badge bg="light" text="dark" className="border"><i className="bi bi-credit-card me-1"></i>{pedido.metodo}</Badge></td>
                            <td className="fw-bold">S/ {pedido.total.toFixed(2)}</td>
                            <td><Badge bg={getStatusBadge(pedido.estado)}>{pedido.estado}</Badge></td>
                            <td className="text-end">
                                <Button variant="link" className="text-dark p-0 me-3" title="Ver Detalle"><i className="bi bi-eye"></i></Button>
                                <Button variant="link" className="text-dark p-0" title="Imprimir Guía"><i className="bi bi-printer"></i></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card.Body>
        <Card.Footer className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Mostrando 5 de 5 pedidos</small>
                {/* Paginación simplificada */}
                <div className="btn-group">
                    <Button variant="outline-secondary" size="sm" disabled>Anterior</Button>
                    <Button variant="outline-secondary" size="sm" disabled>Siguiente</Button>
                </div>
            </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default OrdersPage;