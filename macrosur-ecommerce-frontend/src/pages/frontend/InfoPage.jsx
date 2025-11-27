import React from 'react';
import { Container, Row, Col, Card, Accordion, Form, InputGroup, Button, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const InfoPage = () => {
    const { slug } = useParams();

    if (slug === 'soporte') {
        return <HelpCenter />;
    }

    return <GenericContent slug={slug} />;
};

const HelpCenter = () => {
    const { isAuthenticated } = useAuth(); 

    const commonTopics = [
        { 
            icon: 'bi-box-seam', 
            title: 'Mis Pedidos', 
            text: 'Rastrear paquetes, editar o cancelar pedidos.', 
            link: isAuthenticated ? '/cliente/perfil/orders' : '/login' 
        },
        { 
            icon: 'bi-arrow-counterclockwise', 
            title: 'Devoluciones', 
            text: 'Política de devoluciones y reembolsos.', 
            link: '/info/politica-devoluciones' 
        },
        { 
            icon: 'bi-credit-card', 
            title: 'Pagos y Facturas', 
            text: 'Métodos de pago, comprobantes y seguridad.', 
            link: '/info/pagos' 
        },
        { 
            icon: 'bi-person-gear', 
            title: 'Mi Cuenta', 
            text: 'Gestionar perfil, direcciones y contraseñas.', 
            link: isAuthenticated ? '/cliente/perfil' : '/login' 
        },
    ];

    const faqs = [
        { 
            q: '¿Cuánto tarda en llegar mi pedido?', 
            a: 'El tiempo de entrega estándar en Lima es de 24 a 48 horas. Para provincias, depende del destino, generalmente entre 3 a 5 días hábiles. Puedes ver el estado exacto en la sección "Mis Pedidos".' 
        },
        { 
            q: '¿Cómo puedo solicitar una factura?', 
            a: 'Al momento de realizar el pago (Checkout), selecciona la opción "Factura" e ingresa tu RUC. El documento electrónico se enviará automáticamente a tu correo registrado una vez confirmado el pago.' 
        },
        { 
            q: '¿Tienen tienda física donde pueda ver los productos?', 
            a: 'Sí, nuestra sede principal está en Mollendo, Arequipa. También contamos con almacenes en Lima para distribución rápida. Revisa la página de "Contacto" para ver las direcciones exactas.' 
        },
        { 
            q: '¿Qué hago si mi producto llegó dañado o incompleto?', 
            a: 'Lo sentimos mucho. Tienes 48 horas desde la recepción para reportarlo. Por favor, toma fotos del producto y del empaque, y contáctanos inmediatamente por WhatsApp o correo para gestionar el cambio sin costo.' 
        },
        {
            q: '¿Aceptan pagos contra entrega?',
            a: 'Por el momento solo aceptamos pagos contra entrega en Lima Metropolitana y Arequipa Ciudad. Para otras provincias, el pago debe realizarse al 100% antes del despacho.'
        }
    ];

    return (
        <div className="bg-light min-vh-100 pb-5">
            <div className="bg-primary text-white py-5 text-center mb-5">
                <Container>
                    <h1 className="fw-bold mb-3">¿En qué podemos ayudarte?</h1>
                    <div className="row justify-content-center">
                        <Col md={6}>
                            <InputGroup size="lg">
                                <InputGroup.Text className="bg-white border-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                                <Form.Control 
                                    placeholder="Buscar ayuda (ej: devoluciones, envíos...)" 
                                    className="border-0 shadow-none"
                                />
                                <Button variant="dark">Buscar</Button>
                            </InputGroup>
                        </Col>
                    </div>
                </Container>
            </div>

            <Container>
                <h4 className="fw-bold mb-4">Temas frecuentes</h4>
                <Row className="g-4 mb-5">
                    {commonTopics.map((topic, idx) => (
                        <Col md={3} key={idx}>
                            <Card className="h-100 border-0 shadow-sm text-center hover-up transition">
                                <Card.Body className="py-4">
                                    <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-primary">
                                        <i className={`bi ${topic.icon} fs-2`}></i>
                                    </div>
                                    <h5 className="fw-bold">{topic.title}</h5>
                                    <p className="text-muted small mb-3">{topic.text}</p>
                                    <Link to={topic.link} className="btn btn-outline-primary btn-sm stretched-link">
                                        Ver más
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-5">
                    <Col lg={8}>
                        <h4 className="fw-bold mb-4">Preguntas Frecuentes</h4>
                        <Accordion defaultActiveKey="0" flush className="bg-white rounded shadow-sm">
                            {faqs.map((faq, idx) => (
                                <Accordion.Item eventKey={idx.toString()} key={idx}>
                                    <Accordion.Header>
                                        <span className="fw-semibold">{faq.q}</span>
                                    </Accordion.Header>
                                    <Accordion.Body className="text-muted small">
                                        {faq.a}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 shadow-sm bg-white sticky-top" style={{ top: '100px' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">¿Aún necesitas ayuda?</h5>
                                <p className="text-muted small mb-4">Nuestro equipo de atención al cliente está disponible de Lunes a Sábado de 9am a 6pm.</p>
                                
                                <div className="d-grid gap-3">
                                    <Button 
                                        variant="success" 
                                        className="d-flex align-items-center justify-content-center"
                                        href="https://wa.me/51987654321" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-whatsapp me-2 fs-5"></i> Chat por WhatsApp
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
                                        className="d-flex align-items-center justify-content-center"
                                        href="mailto:soporte@macrosur.com"
                                    >
                                        <i className="bi bi-envelope me-2 fs-5"></i> Enviar Correo
                                    </Button>
                                    <div className="text-center mt-2">
                                        <small className="text-muted fw-bold">O llámanos al:</small>
                                        <div className="fs-5 text-dark fw-bold">+51 987 654 321</div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const GenericContent = ({ slug }) => {
    const titles = {
        'terminos': 'Términos y Condiciones',
        'politica-devoluciones': 'Política de Cambios y Devoluciones',
        'privacidad': 'Política de Privacidad',
        'contacto': 'Contáctanos',
        'pagos': 'Métodos de Pago y Facturación',
        'nosotros': 'Sobre Nosotros - MACROSUR'
    };

    const title = titles[slug] || 'Información';

    const renderContent = () => {
        switch (slug) {
            case 'nosotros':
                return (
                    <div className="text-muted lh-lg">
                        <p className="lead text-dark fw-semibold">Equipando hogares, construyendo sueños.</p>
                        <p>En MACROSUR, somos más que una tienda de mejoramiento del hogar. Somos una empresa peruana con raíces en el sur, dedicada a brindar soluciones integrales para la construcción, decoración y equipamiento de espacios.</p>
                        
                        <div className="my-4 p-4 bg-light rounded border-start border-4 border-primary">
                            <h5 className="text-primary fw-bold mb-2">Nuestra Misión</h5>
                            <p className="mb-0">Mejorar la calidad de vida de las familias peruanas ofreciendo productos de alta calidad, asesoría experta y precios justos, contribuyendo al desarrollo sostenible de nuestra región.</p>
                        </div>

                        <h5 className="text-dark mt-4 mb-3">Nuestra Historia</h5>
                        <p>Fundada en Mollendo, Arequipa, MACROSUR comenzó como una pequeña ferretería familiar. Gracias a la confianza de nuestros clientes y al esfuerzo de nuestro equipo, hemos crecido para convertirnos en un referente regional en retail y distribución logística.</p>

                        <h5 className="text-dark mt-4 mb-3">¿Por qué elegirnos?</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Logística Propia:</strong> Garantizamos entregas rápidas y seguras con nuestra propia flota.</li>
                            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Stock Garantizado:</strong> Trabajamos con las mejores marcas nacionales e importadas.</li>
                            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> <strong>Atención Personalizada:</strong> Asesores reales listos para ayudarte en cada paso.</li>
                        </ul>
                    </div>
                );

            case 'pagos':
                return (
                    <div className="text-muted lh-lg">
                        <p>Bienvenido a la sección de Métodos de Pago y Facturación de MACROSUR. En MACROSUR, nos dedicamos a equipar tu hogar con los mejores productos, y queremos que tu experiencia de compra sea tan cómoda y segura como tu casa. A continuación, detallamos las opciones disponibles para procesar tus pedidos y cómo gestionamos tus comprobantes de pago.</p>
                        
                        <h5 className="text-dark mt-4 mb-3">1. Generalidades</h5>
                        <p>En MACROSUR nos comprometemos a garantizar la seguridad de tus transacciones. Utilizamos pasarelas de pago certificadas y protocolos de seguridad (SSL) para encriptar tus datos bancarios y personales. Ninguna información de tu tarjeta de crédito o débito queda guardada en nuestros servidores.</p>
                        <p>Todos los precios publicados en nuestro sitio web incluyen el Impuesto General a las Ventas (IGV) y están expresados en la moneda nacional (S/ o USD, según corresponda).</p>

                        <h5 className="text-dark mt-4 mb-3">2. Métodos de Pago Aceptados</h5>
                        <p>Para facilitar tu compra de muebles, electrodomésticos y decoración, aceptamos las siguientes formas de pago:</p>
                        <ul className="mb-3">
                            <li className="mb-2"><strong>Tarjetas de Crédito y Débito:</strong> Aceptamos Visa, MasterCard, American Express y Diners Club. Puedes realizar tus compras en cuotas si tu banco lo permite.</li>
                            <li className="mb-2"><strong>Transferencia Bancaria Directa:</strong> Puedes realizar el pago directamente a nuestras cuentas corporativas. El pedido se procesará una vez acreditado el fondo.
                                <br/><small className="text-info">BCP Cuenta Corriente N° 215-XXXX-XXXX / CCI: 002-215-XXXX-XXXX</small>
                            </li>
                            <li className="mb-2"><strong>Billeteras Digitales:</strong> Aceptamos Yape y Plin para compras rápidas de menor cuantía.</li>
                            <li><strong>Pago Contra Entrega:</strong> Disponible solo para ciertas zonas de reparto en Lima y Arequipa (Consultar cobertura).</li>
                        </ul>

                        <h5 className="text-dark mt-4 mb-3">3. Condiciones de Facturación</h5>
                        <p>En MACROSUR cumplimos con todas las normativas tributarias vigentes. Al finalizar tu compra, podrás solicitar:</p>
                        <ul>
                            <li><strong>Boleta de Venta Electrónica:</strong> Para consumidores finales (DNI).</li>
                            <li><strong>Factura Electrónica:</strong> Para empresas (RUC). Requisito indispensable ingresar RUC activo y Razón Social correcta en el Checkout.</li>
                        </ul>
                        <div className="alert alert-warning py-2 small">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Importante: No se podrán realizar cambios de Boleta a Factura una vez emitido el comprobante y despachado el producto.
                        </div>

                        <h5 className="text-dark mt-4 mb-3">4. Tiempos de Validación</h5>
                        <p><strong>Pagos con Tarjeta:</strong> Validación inmediata (máx 24 horas en casos excepcionales por seguridad antifraude).</p>
                        <p><strong>Transferencias:</strong> Validación de lunes a viernes de 9:00 am a 6:00 pm. Fines de semana se validan el siguiente día hábil.</p>

                        <h5 className="text-dark mt-4 mb-3">5. Seguridad y Fraude</h5>
                        <p>MACROSUR se reserva el derecho de cancelar cualquier orden que presente indicios de fraude. En tal caso, nos pondremos en contacto para verificar la identidad antes de proceder.</p>

                        <div className="alert alert-info mt-4">
                            <h6 className="alert-heading fw-bold"><i className="bi bi-headset me-2"></i>¿Necesitas ayuda con tu pago?</h6>
                            <p className="mb-0 small">Si tienes problemas al procesar tu tarjeta o dudas sobre tu factura, nuestro equipo está listo para ayudarte.</p>
                            <hr />
                            <p className="mb-0 small"><strong>Correo:</strong> facturacion@macrosur.com <span className="mx-2">|</span> <strong>WhatsApp:</strong> +51 987 654 321</p>
                        </div>
                    </div>
                );

            case 'politica-devoluciones':
                return (
                    <div className="text-muted lh-lg">
                        <p>Bienvenido a la sección de Política de Cambios y Devoluciones de MACROSUR. Nuestro objetivo es ayudarte a crear el hogar de tus sueños. Entendemos que a veces un producto puede no encajar en tu espacio como esperabas. A continuación, te explicamos cómo gestionamos estos procesos.</p>

                        <h5 className="text-dark mt-4 mb-3">1. Generalidades y Plazos</h5>
                        <ul>
                            <li><strong>Plazo de solicitud:</strong> Tienes un plazo máximo de 7 días calendario contados a partir de la fecha de recepción para solicitar cambio o devolución por satisfacción.</li>
                            <li><strong>Garantía por defecto:</strong> Si el producto presenta fallas de fábrica, el plazo se extiende según la garantía específica de cada marca.</li>
                        </ul>

                        <h5 className="text-dark mt-4 mb-3">2. Requisitos Indispensables</h5>
                        <p>Para que tu solicitud sea aceptada, el producto debe cumplir obligatoriamente con:</p>
                        <ul>
                            <li><strong>Estado del Producto:</strong> Nuevo, sin señales de uso, sin manchas ni daños.</li>
                            <li><strong>Embalaje Original:</strong> Caja, empaques y tecnopor originales en buen estado.</li>
                            <li><strong>Accesorios Completos:</strong> Manuales, guías y etiquetas originales.</li>
                            <li><strong>Productos Desarmados:</strong> En muebles, NO se aceptan devoluciones si ya fue armado o si se dañaron piezas al intentar armarlo.</li>
                        </ul>

                        <h5 className="text-dark mt-4 mb-3">3. Excepciones</h5>
                        <p>Por higiene y seguridad, no aceptamos cambios en: Ropa de cama abierta, Colchones sin plástico protector, Productos en Liquidación/Outlet, y Pedidos Personalizados.</p>

                        <h5 className="text-dark mt-4 mb-3">4. Procedimiento de Devolución</h5>
                        <ol>
                            <li><strong>Contacto:</strong> Escríbenos a soporte@macrosur.com o WhatsApp indicando tu Pedido y motivo.</li>
                            <li><strong>Evidencia:</strong> Adjunta fotos del producto y empaque.</li>
                            <li><strong>Recolección:</strong> Productos pequeños pueden dejarse en almacén/courier. Productos grandes (muebles) se coordinará recojo a domicilio.</li>
                        </ol>

                        <h5 className="text-dark mt-4 mb-3">5. Costos de Transporte</h5>
                        <ul>
                            <li><strong>Error de MACROSUR o Falla:</strong> Asumimos el 100% de los costos logísticos.</li>
                            <li><strong>Cambio de Opinión:</strong> El cliente deberá asumir el costo del flete de la devolución.</li>
                        </ul>

                        <h5 className="text-dark mt-4 mb-3">6. Reembolsos</h5>
                        <p>Una vez recibido y verificado el producto (Control de Calidad), se procesará la devolución al mismo medio de pago en un plazo de 7 a 15 días hábiles.</p>

                        <div className="alert alert-info mt-4">
                            <i className="bi bi-question-circle me-2"></i>
                            <strong>¿Tienes dudas?</strong> Contáctanos antes de enviar nada y te orientaremos: <strong>+51 987 654 321</strong>.
                        </div>
                    </div>
                );

            case 'terminos':
                return (
                    <div className="text-muted lh-lg">
                        <p>Bienvenido al sitio web de MACROSUR. Al acceder y utilizar este sitio, aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente.</p>

                        <h5 className="text-dark mt-4 mb-3">1. Aceptación de los Términos</h5>
                        <p>Al utilizar este sitio web, confirmas que has leído, entendido y aceptado estos términos. Si no estás de acuerdo con alguno de ellos, por favor abstente de utilizar nuestros servicios.</p>

                        <h5 className="text-dark mt-4 mb-3">2. Registro de Usuario</h5>
                        <p>Para realizar compras, es necesario registrarse proporcionando información veraz y actual. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</p>

                        <h5 className="text-dark mt-4 mb-3">3. Precios y Disponibilidad</h5>
                        <p>Todos los precios están expresados en Soles (S/) e incluyen IGV. Nos reservamos el derecho de modificar precios y stock sin previo aviso. En caso de error tipográfico en un precio, nos reservamos el derecho de cancelar el pedido.</p>

                        <h5 className="text-dark mt-4 mb-3">4. Propiedad Intelectual</h5>
                        <p>Todo el contenido de este sitio (imágenes, textos, logos) es propiedad de MACROSUR o de sus proveedores y está protegido por las leyes de derechos de autor.</p>

                        <h5 className="text-dark mt-4 mb-3">5. Envíos y Entregas</h5>
                        <p>Los tiempos de envío son estimados y pueden variar. MACROSUR no se hace responsable por retrasos causados por fuerza mayor o terceros (couriers).</p>

                        <div className="alert alert-light border mt-4">
                            <i className="bi bi-info-circle me-2"></i>
                            Última actualización: Noviembre 2025. MACROSUR se reserva el derecho de actualizar estos términos en cualquier momento.
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-muted lh-lg">
                        <p>Bienvenido a la sección de <strong>{title}</strong> de MACROSUR.</p>
                        <p>Estamos comprometidos con brindarte la mejor experiencia y transparencia en nuestros servicios.</p>
                        
                        <h5 className="text-dark mt-4 mb-3">Información General</h5>
                        <p>Esta sección contiene información legal y operativa importante sobre el uso de nuestro sitio web y servicios. Te recomendamos leerla detenidamente.</p>
                        
                        <div className="alert alert-light border mt-4">
                            <i className="bi bi-info-circle me-2"></i>
                            El contenido detallado de esta sección se encuentra en actualización. Para consultas específicas, por favor contacta a nuestro soporte.
                        </div>
                    </div>
                );
        }
    };

    return (
        <Container className="py-5">
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/info/soporte" }}>Ayuda</Breadcrumb.Item>
                <Breadcrumb.Item active>{title}</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-5">
                            <h1 className="fw-bold mb-4 text-primary">{title}</h1>
                            {renderContent()}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InfoPage;