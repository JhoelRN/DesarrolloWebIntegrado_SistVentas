import React from 'react';
import { Carousel, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  // Datos simulados de banners (luego vendrán de la base de datos o config)
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
      title: "Herramientas Industriales",
      subtitle: "Equipamiento de alta potencia para minería y construcción.",
      buttonText: "Ver Catálogo",
      link: "/catalogo?categoria=herramientas",
      align: "start" // start, center, end
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
      title: "Materiales de Construcción",
      subtitle: "Calidad garantizada para grandes proyectos de infraestructura.",
      buttonText: "Cotizar Ahora",
      link: "/catalogo?categoria=construccion",
      align: "center"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      title: "Decoración de Interiores",
      subtitle: "Renueva tus espacios con nuestra nueva colección.",
      buttonText: "Inspirarme",
      link: "/catalogo?categoria=decoracion",
      align: "end"
    }
  ];

  return (
    <Carousel fade className="shadow-sm mb-5">
      {slides.map((slide) => (
        <Carousel.Item key={slide.id} style={{ height: '500px' }}>
          {/* Overlay oscuro para mejorar legibilidad del texto */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
              zIndex: 1
            }} 
          />
          <img
            className="d-block w-100 h-100"
            src={slide.image}
            alt={slide.title}
            style={{ objectFit: 'cover' }}
          />
          <Carousel.Caption 
            className={`h-100 d-flex flex-column justify-content-center align-items-${slide.align}`}
            style={{ zIndex: 2, paddingBottom: '0' }}
          >
            <Container>
                <div style={{ maxWidth: '600px', margin: slide.align === 'center' ? '0 auto' : undefined, textAlign: slide.align }}>
                    <h1 className="display-4 fw-bold text-white mb-3 text-shadow">{slide.title}</h1>
                    <p className="lead text-white mb-4 fs-5 text-shadow">{slide.subtitle}</p>
                    <Button 
                        as={Link} 
                        to={slide.link} 
                        variant="warning" 
                        size="lg" 
                        className="fw-bold px-4 rounded-pill"
                    >
                        {slide.buttonText}
                    </Button>
                </div>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;