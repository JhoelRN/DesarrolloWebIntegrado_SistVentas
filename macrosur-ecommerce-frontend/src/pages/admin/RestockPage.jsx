import React from 'react';
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';

const RestockPage = () => {
  // Datos simulados de reposición
  const solicitudes = [
    { id: 'REQ-1023', proveedor: 'Muebles del Sur SAC', fecha: '2023-11-28', items: 15, total: 'S/ 4,500', estado: 'Pendiente' },
    { id: 'REQ-1022', proveedor: 'Importaciones Tech', fecha: '2023-11-25', items: 50, total: 'S/ 12,300', estado: 'Aprobado' },
    { id: 'REQ-1021', proveedor: 'Textiles Andinos', fecha: '2023-11-20', items: 100, total: 'S/ 2,100', estado: 'Recibido' },
  ];

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2>Reposición y Compras</h2>
            <p className="text-muted mb-0">Gestión de órdenes de compra a proveedores</p>
        </div>
        <Button variant="primary"><i className="bi bi-plus-circle me-2"></i>Nueva Orden de Compra</Button>
      </div>

      <Row>
        <Col md={8}>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Solicitudes Recientes</h5>
                    <Button variant="link" size="sm">Ver todas</Button>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>ID Solicitud</th>
                                <th>Proveedor</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map(sol => (
                                <tr key={sol.id}>
                                    <td className="fw-bold text-primary">{sol.id}</td>
                                    <td>{sol.proveedor}</td>
                                    <td>{sol.fecha}</td>
                                    <td>{sol.total}</td>
                                    <td>
                                        <Badge bg={
                                            sol.estado === 'Recibido' ? 'success' : 
                                            sol.estado === 'Aprobado' ? 'info' : 'warning'
                                        }>
                                            {sol.estado}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="outline-secondary" size="sm">Detalle</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Col>

        <Col md={4}>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Proveedores Principales</h5>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-building fs-4 text-secondary"></i></div>
                        <div>
                            <div className="fw-bold">Muebles del Sur</div>
                            <small className="text-muted">Mobiliario / Arequipa</small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-building fs-4 text-secondary"></i></div>
                        <div>
                            <div className="fw-bold">Importaciones Tech</div>
                            <small className="text-muted">Electrónica / Lima</small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-2 me-3"><i className="bi bi-building fs-4 text-secondary"></i></div>
                        <div>
                            <div className="fw-bold">Textiles Andinos</div>
                            <small className="text-muted">Decoración / Cusco</small>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                    <Button variant="outline-primary" className="w-100">Gestionar Proveedores</Button>
                </Card.Footer>
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RestockPage;