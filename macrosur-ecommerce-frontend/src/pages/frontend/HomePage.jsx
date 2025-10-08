import React, { useState, useEffect } from 'react';
import { Container, Carousel, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // <-- ¡IMPORTACIÓN AÑADIDA!
// Asumimos que ProductCard es un componente reutilizable
import ProductCard from '../../components/product/ProductCard'; 
// Importamos la API para obtener productos destacados
import * as productsApi from '../../api/products'; 

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Cargar productos destacados y en promoción
        // Llama a la API (que consulta la tabla Productos, Variantes_Producto y Reglas_Descuento)
        const fetchFeatured = async () => {
            try {
                // productsApi es un stub que devuelve datos falsos
                const data = await productsApi.getFeaturedProducts(); 
                setFeaturedProducts(data);
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
                // Mostrar un mensaje amigable al usuario
            }
        };
        fetchFeatured();
    }, []);

    return (
        <>
            {/* 1. Carrusel de Promociones (Banner Principal) */}
            <Container fluid className="px-0 mb-5">
                <Carousel fade>
                    <Carousel.Item style={{ height: '400px' }}>
                        <img className="d-block w-100 object-fit-cover" src="https://placehold.co/1920x400/007bff/ffffff?text=OFERTA+30%25+Cortinas+Blackout" alt="Promoción 1" />
                        <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
                            <h3 className="fw-bold">¡Semana de Descuentos en Cortinas!</h3>
                            <p>Envío Gratis a partir de $150.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item style={{ height: '400px' }}>
                           <img className="d-block w-100 object-fit-cover" src="https://placehold.co/1920x400/28a745/ffffff?text=NUEVA+COLECCION+ALFOMBRAS+EUROPEAS" alt="Promoción 2" />
                         <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
                            <h3 className="fw-bold">Alfombras Europeas de Lujo</h3>
                            <p>¡Stock Consignado Exclusivo!</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Container>

            {/* 2. Categorías Principales Destacadas (Servicios) */}
            <Container className="my-5">
                <h2 className="text-center mb-4 fw-light">Servicios y Categorías Top</h2>
                <Row className="text-center">
                    {/* Enlace a Libro de Reclamaciones (Contenido_Informativo) */}
                    <Col md={3} className="mb-3">
                        <Card className="shadow-sm h-100 border-warning">
                            <Card.Body>
                                <i className="bi bi-file-earmark-text display-4 text-warning"></i>
                                <Card.Title className="mt-3">Libro de Reclamaciones</Card.Title>
                                <Card.Text className="small text-muted">Formulario oficial para cualquier queja.</Card.Text>
                                <Button variant="link" as={Link} to="/profile/claims">Reclama Aquí</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Enlace a Novedades */}
                    <Col md={3} className="mb-3">
                        <Card className="shadow-sm h-100">
                             <Card.Body>
                                <i className="bi bi-box-seam display-4 text-info"></i>
                                <Card.Title className="mt-3">Stock Consignado</Card.Title>
                                <Card.Text className="small text-muted">Productos de proveedor con entrega rápida.</Card.Text>
                                <Button variant="link" as={Link} to="/catalogo?tag=stock-consignado">Ver Novedades</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Enlace a Retiro en Tienda */}
                    <Col md={3} className="mb-3">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <i className="bi bi-shop display-4 text-success"></i>
                                <Card.Title className="mt-3">Retiro en Tienda</Card.Title>
                                <Card.Text className="small text-muted">Recoge tu pedido sin costo adicional.</Card.Text>
                                <Button variant="link" as={Link} to="/info/nuestras-tiendas">Puntos de Recojo</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Enlace a Devoluciones */}
                    <Col md={3} className="mb-3">
                        <Card className="shadow-sm h-100">
                             <Card.Body>
                                <i className="bi bi-arrow-return-left display-4 text-danger"></i>
                                <Card.Title className="mt-3">Cambios y Devoluciones</Card.Title>
                                <Card.Text className="small text-muted">Política de 30 días garantizada.</Card.Text>
                                <Button variant="link" as={Link} to="/info/politica-devoluciones">Leer Política</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 3. Listado de Productos Destacados */}
            <Container className="my-5">
                <h2 className="mb-4 fw-bold">Nuestros Más Vendidos</h2>
                <Row>
                    {featuredProducts.map(product => (
                        <Col key={product.id} sm={6} md={4} lg={3} className="mb-4">
                            <ProductCard product={product} /> 
                        </Col>
                    ))}
                    {featuredProducts.length === 0 && (
                         <div className="text-center text-muted py-5">
                              <i className="bi bi-box-seam fs-2"></i>
                              <p>Cargando productos...</p>
                          </div>
                    )}
                </Row>
                <div className="text-center mt-4">
                    <Button variant="outline-primary" size="lg" as={Link} to="/catalogo">
                        Ver Catálogo Completo
                    </Button>
                </div>
            </Container>
        </>
    );
};

export default HomePage;