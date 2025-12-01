import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Estado del formulario
    const [metodoEntrega, setMetodoEntrega] = useState('DOMICILIO');
    const [direccionEnvio, setDireccionEnvio] = useState({
        calle: '',
        numero: '',
        comuna: '',
        ciudad: '',
        region: ''
    });

    const IVA_RATE = 0.19;
    const subtotal = cartTotal;
    const iva = subtotal * IVA_RATE;
    const costoEnvio = metodoEntrega === 'DOMICILIO' ? 5000 : 0;
    const total = subtotal + iva + costoEnvio;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Preparar datos del pedido
            const pedidoData = {
                clienteId: 1, // TODO: Obtener del contexto de autenticación
                metodoEntrega: metodoEntrega,
                direccionEnvioId: null, // TODO: Crear dirección si es envío a domicilio
                ubicacionRetiroId: metodoEntrega === 'RETIRO_EN_TIENDA' ? 4 : null, // ID Tienda Física
                totalEnvio: costoEnvio,
                items: cartItems.map(item => ({
                    varianteId: item.varianteId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                    descuentoAplicado: 0
                }))
            };

            const response = await axios.post('http://localhost:8081/api/pedidos', pedidoData);
            
            if (response.data) {
                // Limpiar carrito
                clearCart();
                
                // Redirigir a página de confirmación
                alert(`¡Pedido creado exitosamente! ID: ${response.data.pedidoId}\nTotal: $${response.data.totalFinal.toLocaleString('es-CL')}`);
                navigate('/');
            }
        } catch (err) {
            console.error('Error al crear pedido:', err);
            setError(err.response?.data?.message || 'Error al procesar el pedido. Verifica el stock disponible.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container className="my-5">
                <Alert variant="warning" className="text-center">
                    <h4>No hay productos en el carrito</h4>
                    <Button variant="primary" onClick={() => navigate('/productos')}>
                        Ver Productos
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">
                <i className="bi bi-credit-card me-2"></i>
                Finalizar Compra
            </h2>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={8}>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Card className="mb-4">
                            <Card.Body>
                                <h5 className="mb-3">Método de Entrega</h5>
                                
                                <Form.Check
                                    type="radio"
                                    id="domicilio"
                                    label={
                                        <div>
                                            <strong>Envío a Domicilio</strong>
                                            <br />
                                            <small className="text-muted">Costo: $5.000 - Entrega en 3-5 días hábiles</small>
                                        </div>
                                    }
                                    name="metodoEntrega"
                                    checked={metodoEntrega === 'DOMICILIO'}
                                    onChange={() => setMetodoEntrega('DOMICILIO')}
                                    className="mb-3"
                                />

                                <Form.Check
                                    type="radio"
                                    id="retiro"
                                    label={
                                        <div>
                                            <strong>Retiro en Tienda</strong>
                                            <br />
                                            <small className="text-muted">Gratis - Disponible en 24 horas</small>
                                        </div>
                                    }
                                    name="metodoEntrega"
                                    checked={metodoEntrega === 'RETIRO_EN_TIENDA'}
                                    onChange={() => setMetodoEntrega('RETIRO_EN_TIENDA')}
                                />
                            </Card.Body>
                        </Card>

                        {metodoEntrega === 'DOMICILIO' && (
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-3">Dirección de Envío</h5>
                                    
                                    <Row>
                                        <Col md={8}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Calle</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={direccionEnvio.calle}
                                                    onChange={(e) => setDireccionEnvio({...direccionEnvio, calle: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Número</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={direccionEnvio.numero}
                                                    onChange={(e) => setDireccionEnvio({...direccionEnvio, numero: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Comuna</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={direccionEnvio.comuna}
                                                    onChange={(e) => setDireccionEnvio({...direccionEnvio, comuna: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ciudad</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={direccionEnvio.ciudad}
                                                    onChange={(e) => setDireccionEnvio({...direccionEnvio, ciudad: e.target.value})}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Región</Form.Label>
                                        <Form.Select
                                            value={direccionEnvio.region}
                                            onChange={(e) => setDireccionEnvio({...direccionEnvio, region: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecciona una región</option>
                                            <option value="Metropolitana">Región Metropolitana</option>
                                            <option value="Valparaíso">Valparaíso</option>
                                            <option value="Biobío">Biobío</option>
                                            {/* Agregar más regiones según necesidad */}
                                        </Form.Select>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        )}

                        {metodoEntrega === 'RETIRO_EN_TIENDA' && (
                            <Alert variant="info">
                                <h6>📍 Dirección de Retiro:</h6>
                                <p className="mb-0">
                                    <strong>Tienda Física Macrosur</strong><br />
                                    Av. Principal 123, Santiago Centro<br />
                                    Horario: Lunes a Viernes 9:00 - 18:00
                                </p>
                            </Alert>
                        )}
                    </Col>

                    <Col md={4}>
                        <Card className="sticky-top" style={{top: '20px'}}>
                            <Card.Body>
                                <h5 className="mb-3">Resumen del Pedido</h5>
                                
                                <div className="mb-3">
                                    <small className="text-muted">
                                        {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                                    </small>
                                    {cartItems.map(item => (
                                        <div key={item.varianteId} className="d-flex justify-content-between mt-2">
                                            <small>
                                                {item.nombre} x{item.cantidad}
                                            </small>
                                            <small>${(item.precio * item.cantidad).toLocaleString('es-CL')}</small>
                                        </div>
                                    ))}
                                </div>

                                <hr />
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toLocaleString('es-CL')}</span>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>IVA (19%):</span>
                                    <span>${iva.toLocaleString('es-CL')}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Envío:</span>
                                    <span>
                                        {costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString('es-CL')}`}
                                    </span>
                                </div>
                                
                                <hr />
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong className="text-success">
                                        ${total.toLocaleString('es-CL')}
                                    </strong>
                                </div>
                                
                                <Button
                                    variant="success"
                                    size="lg"
                                    className="w-100 mb-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Confirmar Pedido
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    onClick={() => navigate('/cart')}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Volver al Carrito
                                </Button>

                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        <i className="bi bi-shield-check me-1"></i>
                                        Pago 100% seguro
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default CheckoutPage;
