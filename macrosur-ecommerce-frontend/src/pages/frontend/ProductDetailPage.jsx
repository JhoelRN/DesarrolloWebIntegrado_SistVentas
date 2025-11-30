/**
 * ProductDetailPage - Página de detalle del producto
 * Muestra información completa: imagen, precio, descripción, ficha técnica, reseñas
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import LazyImage from '../../components/common/LazyImage';
import ProductReviews from '../../components/product/ProductReviews';
import { getProductById } from '../../api/products';
import { useCart } from '../../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [variantes, setVariantes] = useState([]);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
    const [stockDisponible, setStockDisponible] = useState(0);

    useEffect(() => {
        cargarProducto();
        cargarVariantes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const cargarProducto = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            setProducto(data);
        } catch (err) {
            console.error('Error al cargar producto:', err);
            setError('No se pudo cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const cargarVariantes = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/productos/${id}/variantes`);
            if (response.ok) {
                const data = await response.json();
                setVariantes(data);
                // Seleccionar la primera variante por defecto
                if (data.length > 0) {
                    setVarianteSeleccionada(data[0]);
                    await cargarStockVariante(data[0].varianteId);
                }
            }
        } catch (err) {
            console.error('Error al cargar variantes:', err);
        }
    };

    const cargarStockVariante = async (varianteId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/logistica/inventario/variante/${varianteId}`);
            if (response.ok) {
                const inventarios = await response.json();
                // Sumar stock de todas las ubicaciones
                const stockTotal = inventarios.reduce((total, inv) => total + inv.cantidad, 0);
                setStockDisponible(stockTotal);
            } else {
                setStockDisponible(0);
            }
        } catch (err) {
            console.error('Error al cargar stock:', err);
            setStockDisponible(0);
        }
    };

    const handleVarianteChange = async (variante) => {
        setVarianteSeleccionada(variante);
        await cargarStockVariante(variante.varianteId);
        setCantidad(1); // Resetear cantidad al cambiar variante
    };

    const handleAddToCart = () => {
        if (!varianteSeleccionada) {
            alert('Por favor selecciona una variante');
            return;
        }

        if (stockDisponible < cantidad) {
            alert(`Stock insuficiente. Disponible: ${stockDisponible}`);
            return;
        }

        const cartItem = {
            varianteId: varianteSeleccionada.varianteId,
            productoId: producto.id,
            nombre: producto.name,
            nombreVariante: varianteSeleccionada.nombre || 'Estándar',
            sku: varianteSeleccionada.sku,
            precio: varianteSeleccionada.precioBase || producto.price,
            imagen: producto.image,
            stock: stockDisponible
        };

        addToCart(cartItem, cantidad);
        alert(`✅ ${cantidad} x ${producto.name} agregado al carrito`);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando producto...</p>
            </Container>
        );
    }

    if (error || !producto) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error || 'Producto no encontrado'}</p>
                    <Button variant="outline-danger" onClick={() => navigate('/catalogo')}>
                        Volver al catálogo
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                    <li className="breadcrumb-item"><a href="/catalogo">Catálogo</a></li>
                    {producto.categorias?.[0] && (
                        <li className="breadcrumb-item">
                            <a href={`/catalogo?categoria=${producto.categorias[0].categoriaId}`}>
                                {producto.categorias[0].nombre}
                            </a>
                        </li>
                    )}
                    <li className="breadcrumb-item active">{producto.name}</li>
                </ol>
            </nav>

            <Row>
                {/* Imagen */}
                <Col md={6} className="mb-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <LazyImage
                                src={producto.image}
                                alt={producto.name}
                                style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                            />
                        </Card.Body>
                    </Card>

                    {/* Info adicional */}
                    <Card className="mt-3 border-0 shadow-sm">
                        <Card.Body>
                            <h6 className="fw-bold mb-3">Información del Producto</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Código:</span>
                                <span className="fw-semibold">{producto.sku || 'N/A'}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Peso:</span>
                                <span>{producto.peso ? `${producto.peso} kg` : 'N/A'}</span>
                            </div>
                            {producto.volumen && (
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Volumen:</span>
                                    <span>{producto.volumen} m³</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Disponibilidad:</span>
                                {producto.activo ? (
                                    <Badge bg="success">En Stock</Badge>
                                ) : (
                                    <Badge bg="danger">No Disponible</Badge>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Información */}
                <Col md={6}>
                    <div className="mb-3">
                        {producto.categorias?.map(cat => (
                            <Badge key={cat.categoriaId} bg="secondary" className="me-2">
                                {cat.nombre}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="mb-3">{producto.name}</h1>
                    {producto.description && <p className="text-muted mb-4">{producto.description}</p>}

                    {/* Selector de Variantes */}
                    {variantes.length > 1 && (
                        <Card className="mb-3 border-0 bg-light">
                            <Card.Body>
                                <h6 className="mb-3">Seleccione una variante:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {variantes.map((variante) => {
                                        const isGeneric = variante.sku?.startsWith('SKU-');
                                        const displayText = isGeneric ? 'Estándar' : variante.sku;
                                        const isSelected = varianteSeleccionada?.varianteId === variante.varianteId;
                                        
                                        return (
                                            <Button
                                                key={variante.varianteId}
                                                variant={isSelected ? 'primary' : 'outline-primary'}
                                                onClick={() => handleVarianteChange(variante)}
                                                className="px-3"
                                            >
                                                {displayText}
                                            </Button>
                                        );
                                    })}
                                </div>
                                {varianteSeleccionada && !varianteSeleccionada.sku?.startsWith('SKU-') && (
                                    <small className="text-muted d-block mt-2">
                                        SKU: {varianteSeleccionada.sku}
                                    </small>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    {/* Stock Disponible */}
                    {varianteSeleccionada && (
                        <Alert variant={stockDisponible > 0 ? 'success' : 'warning'} className="mb-3">
                            <i className="bi bi-box-seam me-2"></i>
                            <strong>Stock disponible:</strong> {stockDisponible} unidades
                        </Alert>
                    )}

                    {/* Precio */}
                    <div className="mb-4">
                        <h2 className="text-danger fw-bold mb-0">
                            S/ {varianteSeleccionada 
                                ? parseFloat(varianteSeleccionada.precioBase).toFixed(2)
                                : parseFloat(producto.price).toFixed(2)}
                        </h2>
                        <small className="text-muted">Precio incluye IGV</small>
                    </div>

                    {/* Añadir al carrito */}
                    {producto.activo && stockDisponible > 0 && (
                        <Card className="mb-4 border-0 bg-light">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={4}>
                                        <label className="form-label">Cantidad:</label>
                                        <div className="input-group">
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                                disabled={cantidad <= 1}
                                            >
                                                -
                                            </Button>
                                            <input 
                                                type="number" 
                                                className="form-control text-center" 
                                                value={cantidad}
                                                onChange={(e) => setCantidad(Math.min(stockDisponible, Math.max(1, parseInt(e.target.value) || 1)))} 
                                                min="1" 
                                                max={stockDisponible}
                                            />
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                                                disabled={cantidad >= stockDisponible}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <Button 
                                            variant="primary" 
                                            size="lg" 
                                            className="w-100" 
                                            onClick={handleAddToCart}
                                            disabled={!varianteSeleccionada || stockDisponible === 0}
                                        >
                                            <i className="bi bi-cart-plus me-2"></i>Añadir al Carrito
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {!producto.activo && (
                        <Alert variant="warning">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Producto no disponible actualmente
                        </Alert>
                    )}

                    {producto.activo && stockDisponible === 0 && (
                        <Alert variant="danger">
                            <i className="bi bi-x-circle me-2"></i>
                            Producto sin stock. Vuelve pronto.
                        </Alert>
                    )}

                    {/* Beneficios */}
                    <Row className="g-3">
                        <Col md={6}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-truck text-primary fs-4 me-3"></i>
                                <div>
                                    <div className="fw-semibold">Envío Gratis</div>
                                    <small className="text-muted">En compras &gt; S/ 150</small>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-arrow-repeat text-success fs-4 me-3"></i>
                                <div>
                                    <div className="fw-semibold">Cambios y Devoluciones</div>
                                    <small className="text-muted">Hasta 30 días</small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Tabs */}
            <Row className="mt-5">
                <Col>
                    <Tabs defaultActiveKey="descripcion" className="mb-3">
                        <Tab eventKey="descripcion" title="Descripción">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    {producto.description || <p className="text-muted">Sin descripción disponible</p>}
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="ficha" title="Ficha Técnica">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    {producto.fichaTecnica ? (
                                        <div dangerouslySetInnerHTML={{ __html: producto.fichaTecnica }} />
                                    ) : (
                                        <p className="text-muted">Sin ficha técnica disponible</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="reseñas" title="Reseñas">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <ProductReviews productoId={producto.id} />
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;