// src/pages/CartPage.jsx
import React from 'react';
import { Container, Row, Col, Table, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

    const IVA_RATE = 0.19;
    const subtotal = cartTotal;
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    const handleContinueShopping = () => {
        navigate('/productos');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <Container className="my-5">
                <Alert variant="info" className="text-center">
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega productos para comenzar tu compra</p>
                    <Button variant="primary" onClick={handleContinueShopping}>
                        <i className="bi bi-shop me-2"></i>
                        Ver Productos
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">
                <i className="bi bi-cart3 me-2"></i>
                Carrito de Compras ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})
            </h2>

            <Row>
                <Col md={8}>
                    <Table responsive hover>
                        <thead className="table-light">
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.varianteId}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={item.imagen || '/placeholder.jpg'}
                                                alt={item.nombre}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                className="me-3 rounded"
                                            />
                                            <div>
                                                <strong>{item.nombre}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {item.nombreVariante !== 'Estándar' && (
                                                        <>Variante: {item.nombreVariante} | </>
                                                    )}
                                                    SKU: {item.sku}
                                                </small>
                                                <br />
                                                <small className="text-success">
                                                    Stock disponible: {item.stock}
                                                </small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        ${item.precio.toLocaleString('es-CL')}
                                    </td>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => updateQuantity(item.varianteId, item.cantidad - 1)}
                                                disabled={item.cantidad <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-3">{item.cantidad}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => updateQuantity(item.varianteId, item.cantidad + 1)}
                                                disabled={item.cantidad >= item.stock}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <strong>${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
                                    </td>
                                    <td className="align-middle">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeFromCart(item.varianteId)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-secondary" onClick={handleContinueShopping}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Seguir Comprando
                        </Button>
                        <Button variant="outline-danger" onClick={clearCart}>
                            <i className="bi bi-trash me-2"></i>
                            Vaciar Carrito
                        </Button>
                    </div>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3">Resumen del Pedido</h5>
                            
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-2">
                                <span>IVA (19%):</span>
                                <span>${iva.toLocaleString('es-CL')}</span>
                            </div>

                            <Alert variant="info" className="py-2 small mb-2">
                                <i className="bi bi-info-circle me-2"></i>
                                El costo de envío se calculará en el checkout
                            </Alert>
                            
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
                                className="w-100"
                                onClick={handleCheckout}
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Proceder al Checkout
                            </Button>

                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Compra 100% segura
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;