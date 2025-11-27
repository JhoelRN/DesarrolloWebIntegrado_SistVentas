import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Pagination, Form, Modal } from 'react-bootstrap';
import StarRating from '../common/StarRating';
import * as resenasApi from '../../api/resenas';
import * as clientAuthApi from '../../api/clientAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Componente para mostrar y crear reseñas de productos
 */
const ProductReviews = ({ productoId }) => {
    const navigate = useNavigate();
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadisticas, setEstadisticas] = useState({ promedioCalificacion: 0, totalResenas: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    // Formulario nueva reseña
    const [showModal, setShowModal] = useState(false);
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Permisos
    const [puedeResenar, setPuedeResenar] = useState(false);
    const [motivoNoResenar, setMotivoNoResenar] = useState('');
    const clienteActual = clientAuthApi.obtenerClienteActual();

    useEffect(() => {
        cargarResenas();
        verificarPermisos();
    }, [productoId, currentPage]);

    const cargarResenas = async () => {
        try {
            setLoading(true);
            const data = await resenasApi.obtenerResenasProducto(productoId, currentPage, 10);
            setResenas(data.resenas || []);
            setTotalPages(data.totalPages || 0);
            setEstadisticas({
                promedioCalificacion: data.promedioCalificacion || 0,
                totalResenas: data.totalResenas || 0
            });
        } catch (err) {
            console.error('Error al cargar reseñas:', err);
        } finally {
            setLoading(false);
        }
    };

    const verificarPermisos = async () => {
        if (!clienteActual) {
            setPuedeResenar(false);
            setMotivoNoResenar('Inicia sesión para reseñar');
            return;
        }

        try {
            const result = await resenasApi.puedeResenar(productoId);
            setPuedeResenar(result.puedeResenar);
            setMotivoNoResenar(result.motivo);
        } catch (err) {
            setPuedeResenar(false);
        }
    };

    const handleSubmitResena = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await resenasApi.crearResena(productoId, calificacion, comentario);
            setShowModal(false);
            setComentario('');
            setCalificacion(5);
            alert('¡Reseña enviada! Está pendiente de moderación.');
            cargarResenas();
            verificarPermisos();
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAbrirModal = () => {
        if (!clienteActual) {
            if (window.confirm('Debes iniciar sesión para reseñar. ¿Ir a login?')) {
                navigate('/cliente/login');
            }
            return;
        }
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando reseñas...</p>
            </div>
        );
    }

    return (
        <div className="product-reviews">
            {/* Resumen de calificaciones */}
            <Card className="mb-4 border-0 bg-light">
                <Card.Body>
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <h2 className="display-4 fw-bold mb-0">
                                {estadisticas.promedioCalificacion > 0 
                                    ? estadisticas.promedioCalificacion.toFixed(1) 
                                    : 'N/A'}
                            </h2>
                            <StarRating rating={Math.round(estadisticas.promedioCalificacion)} readOnly size="lg" />
                            <p className="text-muted mt-2">{estadisticas.totalResenas} reseñas</p>
                        </div>
                        <div className="col-md-8">
                            <Button 
                                variant="primary" 
                                onClick={handleAbrirModal}
                                disabled={!puedeResenar}
                                className="mb-3"
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                Escribir Reseña
                            </Button>
                            {!puedeResenar && (
                                <Alert variant="info" className="mb-0">
                                    <small>{motivoNoResenar}</small>
                                </Alert>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Lista de reseñas */}
            {resenas.length === 0 ? (
                <Alert variant="secondary">
                    <i className="bi bi-chat-square-text me-2"></i>
                    No hay reseñas aún. ¡Sé el primero en reseñar!
                </Alert>
            ) : (
                <>
                    {resenas.map((resena) => (
                        <Card key={resena.resenaId} className="mb-3 border-0 shadow-sm">
                            <Card.Body>
                                <div className="d-flex align-items-start">
                                    {resena.clienteAvatarUrl ? (
                                        <img 
                                            src={resena.clienteAvatarUrl} 
                                            alt={resena.clienteNombre}
                                            className="rounded-circle me-3"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div 
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: 'bold' }}
                                        >
                                            {resena.clienteNombre.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <strong>{resena.clienteNombre}</strong>
                                                {resena.compraVerificada && (
                                                    <span className="badge bg-success ms-2">
                                                        <i className="bi bi-patch-check me-1"></i>
                                                        Compra verificada
                                                    </span>
                                                )}
                                            </div>
                                            <small className="text-muted">
                                                {new Date(resena.fechaResena).toLocaleDateString('es-PE')}
                                            </small>
                                        </div>
                                        <StarRating rating={resena.calificacion} readOnly size="sm" />
                                        {resena.comentario && (
                                            <p className="mt-2 mb-0">{resena.comentario}</p>
                                        )}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
                                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                                <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            {/* Modal para crear reseña */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Escribir Reseña</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitResena}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Calificación</Form.Label>
                            <div>
                                <StarRating 
                                    rating={calificacion} 
                                    onRatingChange={setCalificacion}
                                    size="lg"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Comentario (opcional)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                maxLength={1000}
                                placeholder="Comparte tu experiencia con este producto..."
                            />
                            <Form.Text className="text-muted">
                                {comentario.length}/1000 caracteres
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Enviando...' : 'Enviar Reseña'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductReviews;
