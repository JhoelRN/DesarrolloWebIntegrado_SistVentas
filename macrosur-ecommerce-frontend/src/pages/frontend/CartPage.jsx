import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const CartPage = () => {
    const { cartItems = [], cartCount, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Mock items por si el contexto está vacío (SOLO PARA DEMO VISUAL)
    // Borra esto cuando conectes la lógica real del carrito
    const demoItems = cartItems.length > 0 ? cartItems : [
        { id: 101, name: 'Taladro Percutor 600W', price: 189.90, quantity: 1, image: 'https://placehold.co/100x100?text=Taladro' },
        { id: 102, name: 'Set de Brocas x12', price: 45.00, quantity: 2, image: 'https://placehold.co/100x100?text=Brocas' },
    ];
    // Fin Mock

    const itemsToShow = demoItems; // Usamos los items demo para que veas algo
    
    const calculateSubtotal = () => {
        return itemsToShow.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const subtotal = calculateSubtotal();
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            // Guardar intención de ir a checkout
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (itemsToShow.length === 0) {
        return (
            <Container className="my-5 py-5 text-center">
                <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                <h2 className="mb-3">Tu carrito está vacío</h2>
                <p className="text-muted mb-4">¡Parece que aún no has agregado productos!</p>
                <Button as={Link} to="/catalogo" variant="primary" size="lg">
                    Ir al Catálogo
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 fw-bold">Carrito de Compras</h1>
            
            <Row>
                {/* Lista de Productos */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="ps-4 py-3">Producto</th>
                                            <th className="py-3">Precio</th>
                                            <th className="py-3">Cantidad</th>
                                            <th className="py-3 text-end pe-4">Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsToShow.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <Image 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            rounded 
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                            className="me-3"
                                                        />
                                                        <div>
                                                            <div className="fw-bold">{item.name}</div>
                                                            <small className="text-muted">Código: {item.id}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>S/ {item.price.toFixed(2)}</td>
                                                <td>
                                                    <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                                        <Button variant="outline-secondary" size="sm">-</Button>
                                                        <input 
                                                            type="text" 
                                                            className="form-control text-center bg-white" 
                                                            value={item.quantity} 
                                                            readOnly 
                                                        />
                                                        <Button variant="outline-secondary" size="sm">+</Button>
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4 fw-bold">
                                                    S/ {(item.price * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="text-end pe-3">
                                                    <Button 
                                                        variant="link" 
                                                        className="text-danger p-0"
                                                        title="Eliminar"
                                                        onClick={() => removeFromCart && removeFromCart(item.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-between">
                        <Button as={Link} to="/catalogo" variant="outline-secondary">
                            <i className="bi bi-arrow-left me-2"></i>Seguir Comprando
                        </Button>
                    </div>
                </Col>

                {/* Resumen de Compra */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm bg-light">
                        <Card.Body className="p-4">
                            <h4 className="card-title fw-bold mb-4">Resumen de Pedido</h4>
                            
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>S/ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                <span className="text-muted">IGV (18%)</span>
                                <span>S/ {igv.toFixed(2)}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fs-5 fw-bold">Total</span>
                                <span className="fs-5 fw-bold text-primary">S/ {total.toFixed(2)}</span>
                            </div>

                            {!isAuthenticated && (
                                <Alert variant="warning" className="small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Inicia sesión para acumular puntos y guardar tu dirección.
                                </Alert>
                            )}

                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-100 fw-bold"
                                onClick={handleCheckout}
                            >
                                Proceder al Pago <i className="bi bi-arrow-right ms-2"></i>
                            </Button>

                            <div className="mt-4 text-center text-muted small">
                                <i className="bi bi-shield-lock me-1"></i> Compra 100% Segura
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;