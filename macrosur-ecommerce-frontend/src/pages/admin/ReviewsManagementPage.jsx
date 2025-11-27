import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Form, Pagination } from 'react-bootstrap';
import { obtenerResenasPendientes, aprobarResena, rechazarResena, eliminarResenaAdmin } from '../../api/resenas';
import StarRating from '../../components/product/StarRating';

const ReviewsManagementPage = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resenaToDelete, setResenaToDelete] = useState(null);

  useEffect(() => {
    cargarResenas();
  }, [filtroEstado, currentPage]);

  const cargarResenas = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await obtenerResenasPendientes(currentPage, 10, filtroEstado);
      
      setResenas(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

    } catch (err) {
      console.error('Error cargando reseñas:', err);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (resenaId) => {
    try {
      await aprobarResena(resenaId);
      setSuccess('Reseña aprobada correctamente');
      cargarResenas();
    } catch (err) {
      console.error('Error aprobando reseña:', err);
      setError('Error al aprobar la reseña');
    }
  };

  const handleRechazar = async (resenaId) => {
    try {
      await rechazarResena(resenaId);
      setSuccess('Reseña rechazada correctamente');
      cargarResenas();
    } catch (err) {
      console.error('Error rechazando reseña:', err);
      setError('Error al rechazar la reseña');
    }
  };

  const handleEliminar = async () => {
    if (!resenaToDelete) return;

    try {
      await eliminarResenaAdmin(resenaToDelete);
      setSuccess('Reseña eliminada correctamente');
      setShowDeleteModal(false);
      setResenaToDelete(null);
      cargarResenas();
    } catch (err) {
      console.error('Error eliminando reseña:', err);
      setError('Error al eliminar la reseña');
    }
  };

  const abrirDetalle = (resena) => {
    setResenaSeleccionada(resena);
    setShowDetailModal(true);
  };

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'success';
      case 'Rechazada': return 'danger';
      case 'Pendiente': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Reseñas</h2>
          <p className="text-muted">
            Administra las reseñas de productos enviadas por los clientes
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex gap-2">
                <Button
                  variant={filtroEstado === 'Pendiente' ? 'warning' : 'outline-warning'}
                  onClick={() => {
                    setFiltroEstado('Pendiente');
                    setCurrentPage(0);
                  }}
                >
                  Pendientes
                </Button>
                <Button
                  variant={filtroEstado === 'Aprobada' ? 'success' : 'outline-success'}
                  onClick={() => {
                    setFiltroEstado('Aprobada');
                    setCurrentPage(0);
                  }}
                >
                  Aprobadas
                </Button>
                <Button
                  variant={filtroEstado === 'Rechazada' ? 'danger' : 'outline-danger'}
                  onClick={() => {
                    setFiltroEstado('Rechazada');
                    setCurrentPage(0);
                  }}
                >
                  Rechazadas
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            Reseñas {filtroEstado}s ({totalElements})
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : resenas.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No hay reseñas {filtroEstado.toLowerCase()}s en este momento
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Producto</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resenas.map(resena => (
                      <tr 
                        key={resena.resenaId}
                        style={{ cursor: 'pointer' }}
                        onClick={() => abrirDetalle(resena)}
                      >
                        <td>{resena.resenaId}</td>
                        <td>
                          <div>
                            <strong>{resena.clienteNombre}</strong>
                            {resena.compraVerificada && (
                              <Badge bg="success" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                ✓ Verificada
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>{resena.productoNombre}</td>
                        <td>
                          <StarRating rating={resena.calificacion} readOnly size="sm" />
                        </td>
                        <td>
                          <div style={{ 
                            maxWidth: '300px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {resena.comentario}
                          </div>
                        </td>
                        <td>
                          {new Date(resena.fechaResena).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>
                          <Badge bg={getEstadoBadgeVariant(resena.estadoResena)}>
                            {resena.estadoResena}
                          </Badge>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex gap-1">
                            {resena.estadoResena === 'Pendiente' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleAprobar(resena.resenaId)}
                                  title="Aprobar"
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleRechazar(resena.resenaId)}
                                  title="Rechazar"
                                >
                                  ✗
                                </Button>
                              </>
                            )}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setResenaToDelete(resena.resenaId);
                                setShowDeleteModal(true);
                              }}
                              title="Eliminar"
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(0)} 
                      disabled={currentPage === 0}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
                      disabled={currentPage === 0}
                    />
                    
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx}
                        active={idx === currentPage}
                        onClick={() => setCurrentPage(idx)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} 
                      disabled={currentPage === totalPages - 1}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages - 1)} 
                      disabled={currentPage === totalPages - 1}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal Detalle de Reseña */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resenaSeleccionada && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>ID:</strong> {resenaSeleccionada.resenaId}
                </Col>
                <Col md={6}>
                  <strong>Estado:</strong>{' '}
                  <Badge bg={getEstadoBadgeVariant(resenaSeleccionada.estadoResena)}>
                    {resenaSeleccionada.estadoResena}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Cliente:</strong> {resenaSeleccionada.clienteNombre}
                </Col>
                <Col md={6}>
                  <strong>Producto:</strong> {resenaSeleccionada.productoNombre}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Calificación:</strong><br />
                  <StarRating rating={resenaSeleccionada.calificacion} readOnly />
                </Col>
                <Col md={6}>
                  <strong>Fecha:</strong><br />
                  {new Date(resenaSeleccionada.fechaResena).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Col>
              </Row>

              {resenaSeleccionada.compraVerificada && (
                <Row className="mb-3">
                  <Col>
                    <Badge bg="success">✓ Compra Verificada</Badge>
                  </Col>
                </Row>
              )}

              <Row>
                <Col>
                  <strong>Comentario:</strong>
                  <Card className="mt-2">
                    <Card.Body style={{ whiteSpace: 'pre-wrap' }}>
                      {resenaSeleccionada.comentario}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {resenaSeleccionada && resenaSeleccionada.estadoResena === 'Pendiente' && (
            <>
              <Button 
                variant="success" 
                onClick={() => {
                  handleAprobar(resenaSeleccionada.resenaId);
                  setShowDetailModal(false);
                }}
              >
                Aprobar
              </Button>
              <Button 
                variant="warning" 
                onClick={() => {
                  handleRechazar(resenaSeleccionada.resenaId);
                  setShowDetailModal(false);
                }}
              >
                Rechazar
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReviewsManagementPage;
