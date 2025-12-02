import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TerminosCondicionesPage = () => {
  return (
    <Container className="py-5" style={{ marginTop: '150px' }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="text-center mb-4">Términos y Condiciones</h2>
          <p className="text-center text-muted mb-5">
            Última actualización: 1 de diciembre de 2025
          </p>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>1. Aceptación de los Términos</h4>
              <p>
                Al acceder y utilizar el sitio web de MACROSUR E-Commerce, usted acepta estar sujeto a estos 
                términos y condiciones de uso. Si no está de acuerdo con alguno de estos términos, por favor 
                no utilice nuestro sitio.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>2. Uso del Sitio</h4>
              <p>El sitio web de MACROSUR está destinado para:</p>
              <ul>
                <li>La compra de productos y servicios ofrecidos por nuestra empresa</li>
                <li>La consulta de información sobre nuestros productos</li>
                <li>El seguimiento de pedidos y gestión de cuenta personal</li>
              </ul>
              <p className="mb-0">
                Usted se compromete a utilizar este sitio únicamente para fines legales y de manera que no 
                infrinja los derechos de terceros.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>3. Registro de Cuenta</h4>
              <p>Para realizar compras, debe:</p>
              <ul>
                <li>Crear una cuenta proporcionando información verídica y actualizada</li>
                <li>Mantener la confidencialidad de su contraseña</li>
                <li>Ser mayor de 18 años o contar con autorización de un adulto responsable</li>
                <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>4. Productos y Precios</h4>
              <p>
                <strong>Disponibilidad:</strong> Todos los productos están sujetos a disponibilidad. Nos 
                reservamos el derecho de limitar las cantidades de cualquier producto que ofrezcamos.
              </p>
              <p>
                <strong>Precios:</strong> Los precios mostrados incluyen IVA (19%) y están expresados en 
                pesos chilenos (CLP). Nos reservamos el derecho de modificar precios sin previo aviso.
              </p>
              <p className="mb-0">
                <strong>Errores:</strong> En caso de error en el precio publicado, nos reservamos el derecho 
                de cancelar o rechazar pedidos realizados a ese precio.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>5. Proceso de Compra</h4>
              <ol>
                <li><strong>Pedido:</strong> Al realizar un pedido, usted hace una oferta de compra</li>
                <li><strong>Confirmación:</strong> Enviaremos un email confirmando la recepción del pedido</li>
                <li><strong>Aceptación:</strong> El contrato se perfecciona cuando despachamos el producto</li>
                <li><strong>Pago:</strong> El pago debe realizarse en el momento de la compra mediante los métodos disponibles</li>
              </ol>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>6. Envíos y Entregas</h4>
              <p>
                <strong>Cobertura:</strong> Realizamos envíos a todo Chile continental e insular.
              </p>
              <p>
                <strong>Plazos:</strong>
              </p>
              <ul>
                <li>Santiago y alrededores: 24-48 horas hábiles</li>
                <li>Regiones principales: 3-5 días hábiles</li>
                <li>Zonas extremas: 5-7 días hábiles</li>
              </ul>
              <p className="mb-0">
                <strong>Costos:</strong> El costo de envío se calcula según destino y peso del pedido, 
                informándose antes de confirmar la compra.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>7. Derecho a Retracto</h4>
              <p>
                Conforme a la Ley del Consumidor chilena (Ley 19.496), usted tiene derecho a retractarse 
                de su compra dentro de los <strong>10 días corridos</strong> desde la recepción del producto, 
                sin necesidad de señalar causa.
              </p>
              <p>
                Para ejercer este derecho:
              </p>
              <ul>
                <li>El producto debe estar sin uso y en su empaque original</li>
                <li>Debe conservar la boleta o factura</li>
                <li>Debe notificar por escrito a soporte@macrosur.cl</li>
                <li>Los gastos de devolución corren por cuenta del cliente</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>8. Garantía Legal</h4>
              <p>
                Todos nuestros productos cuentan con:
              </p>
              <ul>
                <li><strong>Garantía legal:</strong> 6 meses (3 meses productos usados) según Ley 19.496</li>
                <li><strong>Garantía del fabricante:</strong> Según especificaciones de cada producto</li>
              </ul>
              <p className="mb-0">
                La garantía cubre defectos de fabricación, no incluye daños por mal uso, desgaste natural 
                o accidentes.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>9. Propiedad Intelectual</h4>
              <p>
                Todo el contenido de este sitio (textos, imágenes, logos, diseños) es propiedad de MACROSUR 
                o sus proveedores y está protegido por las leyes de propiedad intelectual chilenas e 
                internacionales.
              </p>
              <p className="mb-0">
                Queda prohibida su reproducción, distribución o modificación sin autorización expresa.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>10. Privacidad y Protección de Datos</h4>
              <p>
                El tratamiento de sus datos personales se rige por nuestra Política de Privacidad, 
                cumpliendo con la Ley 19.628 sobre Protección de Datos Personales.
              </p>
              <p className="mb-0">
                Sus datos serán utilizados únicamente para procesar pedidos, mejorar nuestro servicio 
                y comunicaciones relacionadas con su compra.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>11. Limitación de Responsabilidad</h4>
              <p>
                MACROSUR no será responsable por:
              </p>
              <ul>
                <li>Daños indirectos o consecuenciales derivados del uso de productos</li>
                <li>Interrupciones del servicio por mantenimiento o causas de fuerza mayor</li>
                <li>Errores tipográficos en descripciones de productos</li>
                <li>Retrasos en entrega causados por terceros (operadores logísticos)</li>
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>12. Modificaciones</h4>
              <p className="mb-0">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios serán efectivos desde su publicación en el sitio web. Es responsabilidad del 
                usuario revisar periódicamente estos términos.
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4>13. Ley Aplicable y Jurisdicción</h4>
              <p>
                Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia 
                será sometida a la jurisdicción de los tribunales ordinarios de justicia chilenos.
              </p>
              <p className="mb-0">
                Para reclamos, puede acudir al SERNAC (Servicio Nacional del Consumidor).
              </p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 bg-light">
            <Card.Body>
              <h5>Contacto</h5>
              <p className="mb-1">
                <strong>MACROSUR E-Commerce</strong>
              </p>
              <p className="mb-1">Email: soporte@macrosur.cl</p>
              <p className="mb-1">Teléfono: +56 2 1234 5678</p>
              <p className="mb-0">Dirección: Av. Providencia 1234, Santiago, Chile</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TerminosCondicionesPage;
