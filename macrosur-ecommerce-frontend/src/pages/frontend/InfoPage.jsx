import React from 'react';
import { Accordion, Container, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BsQuestionCircle } from 'react-icons/bs';

const InfoPage = () => {
  const { slug } = useParams();

  // Títulos para breadcrumb y encabezados
  const titleMap = {
    'preguntas-frecuentes': 'Preguntas Frecuentes',
    'soporte': 'Soporte',
    'terminos': 'Términos y Condiciones',
    'nuestras-tiendas': 'Nuestras Tiendas',
    'stock-consignado': 'Stock Consignado',
    'politica-devoluciones': 'Política de Devoluciones'
  };

  const pageTitle = titleMap[slug] || 'Contenido Informativo';

  // Contenidos estáticos por slug
  const contentMap = {
    'preguntas-frecuentes': {
      title: 'Preguntas Frecuentes',
      body: (
        <div>
          <p className="mb-4 text-muted text-center">
            Encuentra aquí respuestas rápidas a las dudas más comunes sobre compras, pagos, envíos y devoluciones.
          </p>
          <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0" className="mb-3 shadow-sm border rounded">
              <Accordion.Header>
                <BsQuestionCircle className="me-2 text-primary" />
                ¿Cómo realizo una compra?
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                Navega por el catálogo, añade productos al carrito y completa el pago en línea de forma segura.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="mb-3 shadow-sm border rounded">
              <Accordion.Header>
                <BsQuestionCircle className="me-2 text-success" />
                ¿Qué métodos de pago aceptan?
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                Aceptamos tarjetas de crédito, débito y pagos en línea mediante plataformas seguras.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="mb-3 shadow-sm border rounded">
              <Accordion.Header>
                <BsQuestionCircle className="me-2 text-warning" />
                ¿Hacen envíos a todo el país?
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                Sí, realizamos envíos a nivel nacional con diferentes opciones de entrega según tu ubicación.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="mb-3 shadow-sm border rounded">
              <Accordion.Header>
                <BsQuestionCircle className="me-2 text-danger" />
                ¿Puedo devolver un producto?
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                Contamos con una política de devoluciones dentro de los primeros 7 días hábiles posteriores a la compra.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className="mb-3 shadow-sm border rounded">
              <Accordion.Header>
                <BsQuestionCircle className="me-2 text-info" />
                ¿Cómo actualizo mis datos personales?
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                Puedes actualizar tu información desde tu perfil de usuario en la sección "Mi Cuenta".
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )
    },
    'soporte': {
      title: 'Soporte',
      body: (
        <>
          <p>¿Necesitas ayuda? Nuestro equipo de soporte está disponible para resolver tus dudas.</p>
          <p>Puedes contactarnos vía correo electrónico o a través del formulario de contacto.</p>
        </>
      )
    },
    'terminos': {
      title: 'Términos y Condiciones',
      body: (
        <>
          <p>Estos son los términos y condiciones de uso de nuestra plataforma.</p>
          <p>Al navegar en nuestro sitio aceptas estas políticas.</p>
        </>
      )
    },
    'nuestras-tiendas': {
      title: 'Nuestras Tiendas',
      body: (
        <>
          <p>Visítanos en nuestras tiendas físicas ubicadas en las principales ciudades.</p>
          <ul>
            <li>Lima</li>
            <li>Arequipa</li>
            <li>Cusco</li>
          </ul>
        </>
      )
    },
    'stock-consignado': {
      title: 'Stock en Consignación',
      body: (
        <>
          <p>Ofrecemos productos en consignación para distribuidores autorizados.</p>
          <p>Consulta las condiciones y beneficios de este servicio.</p>
        </>
      )
    }
  };

  const pageContent = contentMap[slug];

  return (
       
  <Container className="my-5">
    {/* Breadcrumb arriba a la izquierda */}
    <Breadcrumb className="custom-breadcrumb mb-4">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Inicio
      </Breadcrumb.Item>
      <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
    </Breadcrumb>

    {pageContent ? (
      <>
        <h1 className="fw-bold mb-4">{pageContent.title}</h1>
        {pageContent.body}
      </>
    ) : (
      <>
        <h1 className="fw-bold mb-4">Contenido Informativo</h1>
        <p>No se encontró información para <strong>{slug}</strong>.</p>
      </>
    )}
  </Container>     
 );
};

export default InfoPage;