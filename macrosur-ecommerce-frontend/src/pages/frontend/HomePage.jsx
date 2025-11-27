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
        const fetchFeatured = async () => {
            try {
                const data = await productsApi.getFeaturedProducts(); 
                // Limitar a 8 productos para mejorar rendimiento
                setFeaturedProducts(data.slice(0, 8));
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
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

            {/* 2. Beneficios y Servicios */}
            <Container className="my-5">
                <h2 className="text-center mb-4 fw-light">¿Por qué comprar con nosotros?</h2>
                <Row className="text-center g-4">
                    {/* Envío Gratis */}
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm h-100 border-0">
                            <Card.Body>
                                <i className="bi bi-truck display-4 text-primary"></i>
                                <Card.Title className="mt-3">Envío Gratis</Card.Title>
                                <Card.Text className="small text-muted">En compras mayores a S/ 150 en Lima Metropolitana</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Cambios y Devoluciones */}
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm h-100 border-0">
                             <Card.Body>
                                <i className="bi bi-arrow-return-left display-4 text-success"></i>
                                <Card.Title className="mt-3">Cambios y Devoluciones</Card.Title>
                                <Card.Text className="small text-muted">30 días para cambios. Compra con confianza.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Atención al Cliente */}
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm h-100 border-0">
                            <Card.Body>
                                <i className="bi bi-headset display-4 text-info"></i>
                                <Card.Title className="mt-3">Atención al Cliente</Card.Title>
                                <Card.Text className="small text-muted">Te ayudamos en todo el proceso de compra</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 3. Listado de Productos Destacados */}
            <Container className="my-5">
                <h2 className="mb-4 fw-bold">Productos Destacados</h2>
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