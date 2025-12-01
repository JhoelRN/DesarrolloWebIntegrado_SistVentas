import React from 'react';
import { Container, Row, Col, Accordion, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AyudaPage = () => {
  return (
    <Container className="py-5" style={{ marginTop: '150px' }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="text-center mb-4">
            <i className="bi bi-headset me-2"></i>
            Centro de Ayuda
          </h2>
          <p className="text-center text-muted mb-5">
            Encuentra respuestas a las preguntas más frecuentes sobre nuestros productos y servicios
          </p>

          {/* Preguntas Frecuentes */}
          <h4 className="mb-3">Preguntas Frecuentes</h4>
          <Accordion className="mb-5">
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Cómo realizar un pedido?</Accordion.Header>
              <Accordion.Body>
                <ol>
                  <li>Navega por nuestro catálogo de productos</li>
                  <li>Agrega los productos deseados al carrito</li>
                  <li>Ve al carrito y revisa tu pedido</li>
                  <li>Haz clic en "Proceder al Pago"</li>
                  <li>Ingresa tu dirección de envío</li>
                  <li>Selecciona tu método de pago preferido</li>
                  <li>Confirma tu pedido</li>
                </ol>
                <p className="mb-0">Recibirás un correo de confirmación con los detalles de tu pedido.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Cuáles son los métodos de pago disponibles?</Accordion.Header>
              <Accordion.Body>
                <p>Aceptamos los siguientes métodos de pago:</p>
                <ul>
                  <li><strong>Tarjetas de crédito:</strong> Visa, Mastercard, American Express</li>
                  <li><strong>Tarjetas de débito:</strong> RedCompra</li>
                  <li><strong>Transferencia bancaria:</strong> A través de nuestra plataforma de pago segura</li>
                  <li><strong>WebPay:</strong> Pago en línea con respaldo de Transbank</li>
                </ul>
                <p className="mb-0">Todos los pagos son procesados de forma segura mediante encriptación SSL.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Cuánto tarda en llegar mi pedido?</Accordion.Header>
              <Accordion.Body>
                <p>Los tiempos de entrega varían según tu ubicación:</p>
                <ul>
                  <li><strong>Santiago y alrededores:</strong> 24-48 horas hábiles</li>
                  <li><strong>Regiones principales:</strong> 3-5 días hábiles</li>
                  <li><strong>Zonas extremas:</strong> 5-7 días hábiles</li>
                </ul>
                <p className="mb-0">
                  Una vez despachado, recibirás un número de seguimiento para rastrear tu pedido en tiempo real.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>¿Cómo puedo rastrear mi pedido?</Accordion.Header>
              <Accordion.Body>
                <p>Tienes dos opciones para rastrear tu pedido:</p>
                <ol>
                  <li>
                    <strong>Con número de guía:</strong> Usa nuestra{' '}
                    <Link to="/seguimiento">herramienta de rastreo</Link> ingresando el número que recibiste por correo
                  </li>
                  <li>
                    <strong>Desde tu cuenta:</strong> Inicia sesión y ve a{' '}
                    <Link to="/mis-pedidos">Mis Pedidos</Link> para ver el estado de todos tus pedidos
                  </li>
                </ol>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>¿Cuál es la política de devoluciones?</Accordion.Header>
              <Accordion.Body>
                <p>Aceptamos devoluciones bajo las siguientes condiciones:</p>
                <ul>
                  <li>Tienes <strong>30 días</strong> desde la recepción del producto para solicitar una devolución</li>
                  <li>El producto debe estar <strong>sin uso y en su empaque original</strong></li>
                  <li>Debes conservar la <strong>boleta o factura</strong> de compra</li>
                  <li>Los productos en oferta o liquidación tienen condiciones especiales</li>
                </ul>
                <p className="mb-0">
                  Para iniciar una devolución, contacta con nuestro servicio de atención al cliente.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>¿Cómo cambio mi contraseña?</Accordion.Header>
              <Accordion.Body>
                <ol>
                  <li>Inicia sesión en tu cuenta</li>
                  <li>Ve a <Link to="/cliente/perfil">Mi Perfil</Link></li>
                  <li>Haz clic en "Cambiar Contraseña"</li>
                  <li>Ingresa tu contraseña actual y la nueva contraseña</li>
                  <li>Confirma los cambios</li>
                </ol>
                <p className="mb-0">
                  Si olvidaste tu contraseña, usa la opción "¿Olvidaste tu contraseña?" en la página de inicio de sesión.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>¿Los productos tienen garantía?</Accordion.Header>
              <Accordion.Body>
                <p>Todos nuestros productos cuentan con garantía:</p>
                <ul>
                  <li><strong>Garantía legal:</strong> 6 meses según la ley del consumidor chilena</li>
                  <li><strong>Garantía del fabricante:</strong> Varía según el producto (12-36 meses)</li>
                  <li><strong>Productos defectuosos:</strong> Cambio inmediato o reembolso</li>
                </ul>
                <p className="mb-0">La garantía cubre defectos de fabricación, no daños por mal uso.</p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>¿Puedo cancelar mi pedido?</Accordion.Header>
              <Accordion.Body>
                <p>Puedes cancelar tu pedido según el estado en que se encuentre:</p>
                <ul>
                  <li><strong>Pedido pendiente:</strong> Cancelación inmediata sin costo</li>
                  <li><strong>En preparación:</strong> Contacta con atención al cliente</li>
                  <li><strong>Despachado:</strong> Puedes rechazar la entrega o solicitar devolución una vez recibido</li>
                </ul>
                <p className="mb-0">
                  Para cancelar, ve a <Link to="/mis-pedidos">Mis Pedidos</Link> o contáctanos directamente.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Contacto Directo */}
          <Row className="mt-5">
            <Col md={6} className="mb-4">
              <Card className="h-100 border-primary">
                <Card.Body className="text-center">
                  <i className="bi bi-telephone-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">Llámanos</h5>
                  <p className="text-muted">Lunes a Viernes: 9:00 - 18:00</p>
                  <p className="fs-5 fw-bold text-primary">+56 2 1234 5678</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100 border-success">
                <Card.Body className="text-center">
                  <i className="bi bi-envelope-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">Escríbenos</h5>
                  <p className="text-muted">Respuesta en 24 horas</p>
                  <p className="fs-5 fw-bold text-success">soporte@macrosur.cl</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Botón de Rastreo */}
          <Card className="bg-light text-center mt-4">
            <Card.Body>
              <h5 className="mb-3">¿Ya tienes tu número de guía?</h5>
              <Button as={Link} to="/seguimiento" variant="primary" size="lg">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Rastrea tu Pedido Aquí
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AyudaPage;
