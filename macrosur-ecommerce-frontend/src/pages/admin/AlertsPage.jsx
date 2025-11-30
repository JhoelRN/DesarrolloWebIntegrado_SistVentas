import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { obtenerAlarmasActivas, resolverAlarma } from '../../api/alerts';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const AlertsPage = () => {
  const [alarmas, setAlarmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarAlarmas();
  }, []);

  const cargarAlarmas = async () => {
    try {
      setLoading(true);
      const data = await obtenerAlarmasActivas();
      setAlarmas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar alarmas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolver = async (alarmaId) => {
    if (window.confirm('¿Está seguro de resolver esta alarma?')) {
      try {
        await resolverAlarma(alarmaId);
        cargarAlarmas();
        alert('Alarma resuelta exitosamente');
      } catch (err) {
        alert('Error al resolver alarma: ' + err.message);
      }
    }
  };

  const getTipoBadge = (tipo) => {
    if (tipo.includes('Cero')) return <Badge bg="danger">{tipo}</Badge>;
    if (tipo.includes('Bajo')) return <Badge bg="warning">{tipo}</Badge>;
    return <Badge bg="info">{tipo}</Badge>;
  };

  if (loading) return <Container><p>Cargando alarmas...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><FaExclamationTriangle /> Alarmas de Stock</h2>
          <p className="text-muted">
            {alarmas.length} alarma(s) activa(s)
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={cargarAlarmas}>Actualizar</Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {alarmas.length === 0 ? (
            <Alert variant="success">
              <FaCheck /> No hay alarmas activas
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Ubicación</th>
                  <th>Tipo Alarma</th>
                  <th>Cantidad Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alarmas.map((alarma) => (
                  <tr key={alarma.alarmaId}>
                    <td>{alarma.nombreProducto}</td>
                    <td><code>{alarma.sku}</code></td>
                    <td>{alarma.nombreUbicacion}</td>
                    <td>{getTipoBadge(alarma.tipoAlarma)}</td>
                    <td><strong>{alarma.cantidadActual}</strong></td>
                    <td>{alarma.stockMinimo}</td>
                    <td>{new Date(alarma.fechaAlarma).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleResolver(alarma.alarmaId)}
                      >
                        <FaCheck /> Resolver
                      </Button>
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

export default AlertsPage;
