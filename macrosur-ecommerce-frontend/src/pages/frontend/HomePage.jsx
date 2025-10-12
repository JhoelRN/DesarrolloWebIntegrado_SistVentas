import React, { useState, useEffect } from 'react';
import { Container, Carousel, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import * as productsApi from '../../api/products';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productsApi.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <>
      {/* Carrusel de Promociones */}
      <Container fluid className="px-0 mb-5">
        <Carousel fade>
          <Carousel.Item style={{ height: '400px' }}>
            <img
              className="d-block w-100 object-fit-cover rounded"
              src="https://placehold.co/1920x400/007bff/ffffff?text=OFERTA+30%25+Cortinas+Blackout"
              alt="Promoción 1"
              style={{ objectFit: 'cover', height: '100%' }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded text-white text-shadow">
              <h3 className="fw-bold">¡Semana de Descuentos en Cortinas!</h3>
              <p>Envío Gratis a partir de $150.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item style={{ height: '400px' }}>
            <img
              className="d-block w-100 object-fit-cover rounded"
              src="https://placehold.co/1920x400/28a745/ffffff?text=NUEVA+COLECCION+ALFOMBRAS+EUROPEAS"
              alt="Promoción 2"
              style={{ objectFit: 'cover', height: '100%' }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded text-white text-shadow">
              <h3 className="fw-bold">Alfombras Europeas de Lujo</h3>
              <p>¡Stock Consignado Exclusivo!</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* Productos Destacados */}
      <Container className="my-5">
        <h2 className="mb-4 fw-bold">Nuestros Más Vendidos</h2>
        <Row className="g-4">
          {featuredProducts.map(product => (
            <Col key={product.id} lg={3}>
              <ProductCard product={product} />
            </Col>
          ))}
          {featuredProducts.length === 0 && (
            <div className="text-center text-muted py-5 w-100">
              <i className="bi bi-box-seam fs-2"></i>
              <p>Cargando productos...</p>
            </div>
          )}
        </Row>
        <div className="text-center py-4">
          <Button variant="outline-primary" size="lg" as={Link} to="/catalogo">
            Ver Catálogo Completo
          </Button>
        </div>
      </Container>

      {/* Servicios y Categorías */}
      <Container className="my-5">
        <h2 className="text-center mb-4 fw-light">Servicios y Categorías Top</h2>
        <Row className="text-center">
          {[
            {
              icon: "bi-file-earmark-text text-warning",
              title: "Libro de Reclamaciones",
              text: "Formulario oficial para cualquier queja.",
              link: "/profile/claims",
              label: "Reclama Aquí",
              border: "border-warning"
            },
            {
              icon: "bi-box-seam text-info",
              title: "Stock Consignado",
              text: "Productos de proveedor con entrega rápida.",
              link: "/catalogo?tag=stock-consignado",
              label: "Ver Novedades"
            },
            {
              icon: "bi-shop text-success",
              title: "Retiro en Tienda",
              text: "Recoge tu pedido sin costo adicional.",
              link: "/info/nuestras-tiendas",
              label: "Puntos de Recojo"
            },
            {
              icon: "bi-arrow-return-left text-danger",
              title: "Cambios y Devoluciones",
              text: "Política de 30 días garantizada.",
              link: "/info/politica-devoluciones",
              label: "Leer Política"
            }
          ].map((card, idx) => (
            <Col md={3} className="mb-3" key={idx}>
              <Card className={`shadow-sm h-100 ${card.border || ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-center mb-3">
                    <i className={`bi ${card.icon} fs-1`}></i>
                  </div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text className="small text-muted">{card.text}</Card.Text>
                  <Button variant="link" as={Link} to={card.link}>
                    {card.label}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Sección Preguntas Frecuentes */}
      <Container fluid className="py-5 bg-primary bg-gradient text-white mt-5">
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Preguntas Frecuentes</h2>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            Encuentra respuestas rápidas sobre compras, pagos, envíos y devoluciones.
            Hemos preparado una sección de preguntas frecuentes para resolver tus dudas de forma inmediata.
          </p>
          <Button
            as={Link}
            to="/info/preguntas-frecuentes"
            variant="light"
            size="lg"
            className="mt-3 fw-semibold"
          >
            Ver todas las preguntas
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default HomePage;