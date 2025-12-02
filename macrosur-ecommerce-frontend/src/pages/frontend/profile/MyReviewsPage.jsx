import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyReviewsPage = () => {
  const navigate = useNavigate();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      // TODO: Cargar reseñas desde API
      setResenas([
        {
          id: 1,
          productoId: 10,
          productoNombre: 'Sofá 3 Cuerpos',
          calificacion: 5,
          comentario: 'Excelente producto, muy cómodo',
          fecha: '2025-11-15',
          estado: 'APROBADA'
        },
        {
          id: 2,
          productoId: 15,
          productoNombre: 'Mesa de Comedor',
          calificacion: 4,
          comentario: 'Buena calidad, llegó en buen estado',
          fecha: '2025-11-20',
          estado: 'PENDIENTE'
        }
      ]);
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEstrellas = (calificacion) => {
    return Array.from({length: 5}, (_, i) => (
      <i 
        key={i} 
        className={`bi bi-star${i < calificacion ? '-fill' : ''}`}
        style={{color: '#ffc107'}}
      ></i>
    ));
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'APROBADA': <Badge bg="success">Aprobada</Badge>,
      'PENDIENTE': <Badge bg="warning">Pendiente</Badge>,
      'RECHAZADA': <Badge bg="danger">Rechazada</Badge>
    };
    return badges[estado] || <Badge bg="secondary">{estado}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-star me-2"></i>Mis Reseñas</h2>
          <p className="text-muted">Administra tus reseñas de productos</p>
        </Col>
      </Row>

      {resenas.length === 0 ? (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Aún no has escrito ninguna reseña.
          <Button 
            variant="link" 
            onClick={() => navigate('/catalogo')}
            className="ms-2"
          >
            Ver productos
          </Button>
        </Alert>
      ) : (
        <Row>
          {resenas.map(resena => (
            <Col md={12} key={resena.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-1">{resena.productoNombre}</h5>
                          <div className="mb-2">
                            {renderEstrellas(resena.calificacion)}
                            <span className="ms-2 text-muted">
                              {resena.calificacion}/5
                            </span>
                          </div>
                        </div>
                        {getEstadoBadge(resena.estado)}
                      </div>
                      <p className="mb-2">{resena.comentario}</p>
                      <small className="text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(resena.fecha).toLocaleDateString('es-CL')}
                      </small>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="d-flex flex-column gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate(`/producto/${resena.productoId}`)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          Ver Producto
                        </Button>
                        {resena.estado === 'PENDIENTE' && (
                          <Button variant="outline-secondary" size="sm">
                            <i className="bi bi-pencil me-1"></i>
                            Editar
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyReviewsPage;