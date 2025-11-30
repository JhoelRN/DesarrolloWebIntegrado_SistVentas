# 📧 Guía de Configuración y Uso del Módulo de Emails

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Plantillas Disponibles](#plantillas-disponibles)
3. [Endpoints de Prueba](#endpoints-de-prueba)
4. [Integración en Servicios](#integración-en-servicios)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Configuración Inicial

### 1. Configurar Gmail App Password

Para usar Gmail SMTP, **NO uses tu contraseña normal**. Debes generar una "App Password":

#### Pasos para crear App Password en Gmail:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona **Seguridad** en el menú lateral
3. Activa **Verificación en dos pasos** (si no está activada)
4. Busca **Contraseñas de aplicaciones**
5. Selecciona **Aplicación**: Correo, **Dispositivo**: Otro (nombre personalizado)
6. Ingresa: "Macrosur Backend"
7. Copia la contraseña de 16 caracteres generada

### 2. Actualizar application.properties

Edita `src/main/resources/application.properties`:

```properties
# EMAIL CONFIGURATION - Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=abcd efgh ijkl mnop  # App Password de 16 caracteres
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email settings
mail.from=noreply@macrosur.com
mail.support=support@macrosur.com
mail.admin=admin@macrosur.com
```

**⚠️ IMPORTANTE:** 
- Usa la App Password, NO tu contraseña normal
- Espacios en la App Password son opcionales (Gmail los ignora)
- Asegúrate que la verificación en dos pasos esté activada

### 3. Reiniciar la Aplicación

```powershell
# Detener si está corriendo
# En VS Code: Ctrl+C en la terminal del backend

# Compilar y ejecutar
cd macrosur-ecommerce-backend
.\mvnw spring-boot:run
```

---

## 📬 Plantillas Disponibles

### 1. **Order Confirmation** (Confirmación de Pedido)
- **Template:** `emails/order-confirmation.html`
- **Uso:** Confirmación automática cuando un cliente hace un pedido
- **Variables:**
  - `customerName`: Nombre del cliente
  - `orderId`: ID del pedido (#ORD-12345)
  - `orderDate`: Fecha del pedido
  - `items[]`: Lista de productos (productName, variantName, quantity, price)
  - `subtotal`, `shipping`, `total`: Montos
  - `shippingAddress`: Dirección de envío
  - `trackingUrl`: URL para rastrear el pedido

### 2. **Welcome Email** (Bienvenida)
- **Template:** `emails/welcome.html`
- **Uso:** Cuando un usuario se registra en el sistema
- **Variables:**
  - `userName`: Nombre del usuario
  - `userEmail`: Email del usuario
  - `registrationDate`: Fecha de registro
  - `loginUrl`: URL para iniciar sesión

### 3. **Password Reset** (Recuperar Contraseña)
- **Template:** `emails/password-reset.html`
- **Uso:** Cuando un usuario solicita recuperar su contraseña
- **Variables:**
  - `userName`: Nombre del usuario
  - `resetUrl`: URL con token de recuperación
  - `expirationMinutes`: Minutos de validez (default: 30)
  - `expirationDate`: Fecha/hora de expiración

### 4. **Low Stock Alert** (Alerta de Stock Bajo)
- **Template:** `emails/low-stock-alert.html`
- **Uso:** Alerta automática para administradores cuando hay stock crítico
- **Variables:**
  - `alertDate`: Fecha de la alerta
  - `criticalCount`: Total de productos críticos
  - `lowStockCount`: Productos con stock bajo
  - `outOfStockCount`: Productos agotados
  - `criticalItems[]`: Lista de productos (productName, sku, ubicacion, currentStock, minStock)
  - `inventoryUrl`: URL al inventario
  - `createOrderUrl`: URL para crear orden de reposición

### 5. **Order Status Update** (Actualización de Estado)
- **Template:** `emails/order-status-update.html`
- **Uso:** Notificar al cliente sobre cambios en el estado de su pedido
- **Variables:**
  - `customerName`: Nombre del cliente
  - `orderId`: ID del pedido
  - `orderDate`: Fecha del pedido
  - `newStatus`: Nuevo estado (ej: "En Tránsito")
  - `statusColor`: Color del badge (ej: "#17a2b8")
  - `updateDate`: Fecha de actualización
  - `statusMessage`: Mensaje descriptivo
  - `trackingNumber`: (opcional) Número de guía
  - `carrier`: (opcional) Nombre del transportista
  - `estimatedDelivery`: (opcional) Fecha estimada de entrega
  - `statusStep`: Paso actual (1=Confirmado, 2=Preparando, 3=En Tránsito, 4=Entregado)
  - `trackingUrl`: URL para rastrear

### 6. **Reposition Order Approved** (Orden de Reposición Aprobada)
- **Template:** `emails/reposition-order-approved.html`
- **Uso:** Notificar al proveedor que su orden de compra fue aprobada
- **Variables:**
  - `supplierName`: Nombre del proveedor
  - `orderId`: ID de la orden
  - `approvalDate`: Fecha de aprobación
  - `expectedDate`: Fecha esperada de entrega
  - `deliveryLocation`: Ubicación de entrega
  - `contactPerson`: Persona de contacto
  - `contactPhone`: Teléfono de contacto
  - `items[]`: Productos (productName, sku, quantity, unitPrice, subtotal)
  - `totalAmount`: Monto total
  - `deliveryAddress`: Dirección completa de entrega
  - `specialInstructions`: (opcional) Instrucciones especiales
  - `paymentMethod`: Método de pago
  - `paymentTerms`: Términos de pago
  - `confirmUrl`: URL para confirmar recepción
  - `downloadUrl`: URL para descargar PDF

---

## 🧪 Endpoints de Prueba

El `EmailController` proporciona endpoints para probar cada tipo de email.

**Base URL:** `http://localhost:8081/api/email`

**⚠️ Autenticación requerida:** Todos los endpoints requieren rol ADMIN.

### 1. Probar Confirmación de Pedido
```http
POST http://localhost:8081/api/email/test/order-confirmation?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 2. Probar Bienvenida
```http
POST http://localhost:8081/api/email/test/welcome?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 3. Probar Recuperación de Contraseña
```http
POST http://localhost:8081/api/email/test/password-reset?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 4. Probar Alerta de Stock
```http
POST http://localhost:8081/api/email/test/low-stock-alert?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 5. Probar Actualización de Estado
```http
POST http://localhost:8081/api/email/test/order-status-update?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 6. Probar Orden de Reposición
```http
POST http://localhost:8081/api/email/test/reposition-order-approved?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

### 7. Probar TODOS los Emails a la Vez
```http
GET http://localhost:8081/api/email/test/all?email=tu-email@gmail.com
Authorization: Bearer {tu-token-jwt}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Proceso de envío completado. Revisa tu bandeja de entrada en tu-email@gmail.com",
  "results": {
    "orderConfirmation": "✓ Enviado",
    "welcome": "✓ Enviado",
    "passwordReset": "✓ Enviado",
    "lowStockAlert": "✓ Enviado",
    "orderStatusUpdate": "✓ Enviado",
    "repositionOrderApproved": "✓ Enviado"
  }
}
```

---

## 🔌 Integración en Servicios

### Ejemplo 1: Enviar confirmación al crear un pedido

En `OrderService.java` o `VentaService.java`:

```java
@Autowired
private EmailService emailService;

public Venta crearVenta(Venta venta) {
    // ... lógica de creación de venta ...
    
    Venta ventaGuardada = ventaRepository.save(venta);
    
    // Enviar email de confirmación
    try {
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("customerName", venta.getUsuario().getNombre());
        orderData.put("orderId", "#ORD-" + ventaGuardada.getId());
        orderData.put("orderDate", ventaGuardada.getFecha());
        
        // Preparar items
        List<Map<String, Object>> items = new ArrayList<>();
        for (DetalleVenta detalle : venta.getDetalles()) {
            Map<String, Object> item = new HashMap<>();
            item.put("productName", detalle.getProducto().getNombre());
            item.put("variantName", detalle.getVariante() != null ? detalle.getVariante().getNombre() : "");
            item.put("quantity", detalle.getCantidad());
            item.put("price", detalle.getPrecioUnitario());
            items.add(item);
        }
        orderData.put("items", items);
        orderData.put("subtotal", venta.getTotal());
        orderData.put("shipping", 0.0); // o calcular envío
        orderData.put("total", venta.getTotal());
        orderData.put("shippingAddress", venta.getDireccionEnvio());
        orderData.put("trackingUrl", "http://localhost:5173/profile/orders/" + ventaGuardada.getId());
        
        emailService.sendOrderConfirmation(venta.getUsuario().getEmail(), orderData);
    } catch (Exception e) {
        // Log error pero no fallar la transacción
        System.err.println("Error enviando email de confirmación: " + e.getMessage());
    }
    
    return ventaGuardada;
}
```

### Ejemplo 2: Enviar alerta de stock bajo

En `InventarioService.java`:

```java
@Autowired
private EmailService emailService;

@Value("${mail.admin}")
private String adminEmail;

public void verificarStockBajo() {
    // Obtener productos con stock bajo
    List<Inventario> stockBajo = inventarioRepository.findByStockActualLessThanStockMinimo();
    
    if (!stockBajo.isEmpty()) {
        Map<String, Object> stockData = new HashMap<>();
        stockData.put("alertDate", new Date());
        stockData.put("criticalCount", stockBajo.size());
        
        long outOfStock = stockBajo.stream().filter(i -> i.getStockActual() == 0).count();
        stockData.put("outOfStockCount", (int) outOfStock);
        stockData.put("lowStockCount", stockBajo.size() - (int) outOfStock);
        
        // Preparar items críticos
        List<Map<String, Object>> items = new ArrayList<>();
        for (Inventario inv : stockBajo) {
            Map<String, Object> item = new HashMap<>();
            item.put("productName", inv.getProducto().getNombre());
            item.put("sku", inv.getProducto().getSku());
            item.put("ubicacion", inv.getUbicacion().getNombre());
            item.put("currentStock", inv.getStockActual());
            item.put("minStock", inv.getStockMinimo());
            items.add(item);
        }
        stockData.put("criticalItems", items);
        stockData.put("inventoryUrl", "http://localhost:5173/admin/inventory");
        stockData.put("createOrderUrl", "http://localhost:5173/admin/logistica/ordenes-reposicion");
        
        emailService.sendLowStockAlert(adminEmail, stockData);
    }
}
```

### Ejemplo 3: Enviar bienvenida al registrar usuario

En `UsuarioService.java` o `AuthService.java`:

```java
@Autowired
private EmailService emailService;

public Usuario registrarUsuario(Usuario usuario) {
    // ... validaciones y encriptación de contraseña ...
    
    Usuario usuarioGuardado = usuarioRepository.save(usuario);
    
    // Enviar email de bienvenida
    try {
        emailService.sendWelcomeEmail(usuarioGuardado.getEmail(), usuarioGuardado.getNombre());
    } catch (Exception e) {
        System.err.println("Error enviando email de bienvenida: " + e.getMessage());
    }
    
    return usuarioGuardado;
}
```

---

## 🔍 Solución de Problemas

### Error: "Authentication failed"

**Causa:** Contraseña incorrecta o no es una App Password.

**Solución:**
1. Ve a https://myaccount.google.com/apppasswords
2. Genera una nueva App Password
3. Actualiza `application.properties` con la nueva password
4. Reinicia la aplicación

### Error: "Could not connect to SMTP host"

**Causa:** Firewall o puerto bloqueado.

**Solución:**
1. Verifica que el puerto 587 esté abierto
2. Prueba con otro puerto: 465 (SSL) o 25 (sin encriptación)
3. Si usas VPN, desactívala temporalmente

### Email no llega a la bandeja de entrada

**Solución:**
1. Revisa la carpeta de **SPAM** o **Correo no deseado**
2. Verifica los logs del backend para errores
3. Asegúrate que el email de `mail.from` sea válido
4. Añade `noreply@macrosur.com` a contactos de Gmail

### Template no se encuentra

**Error:** `TemplateNotFoundException`

**Solución:**
1. Verifica que el archivo exista en `src/main/resources/templates/`
2. Revisa que el nombre del template en el código coincida con el archivo
3. Recompila: `.\mvnw clean compile`

### Variables no se reemplazan en el email

**Causa:** Variables mal escritas en el template o en el código.

**Solución:**
1. Verifica que las variables en el template usen `th:text="${variableName}"`
2. Asegúrate que el Map en Java use las mismas keys
3. Revisa los logs de Thymeleaf para errores de parsing

---

## 📊 Monitoreo y Logs

### Ver logs de envío de emails

Los logs aparecerán en la consola del backend:

```
INFO  c.m.m.service.EmailService - Enviando email a: cliente@ejemplo.com
INFO  c.m.m.service.EmailService - Email enviado exitosamente: Confirmación de Pedido
```

### Verificar configuración SMTP

```java
// En EmailService.java, añade al método sendHtmlEmail():
logger.info("SMTP Host: " + javaMailSender.getJavaMailProperties().getProperty("mail.smtp.host"));
logger.info("SMTP Port: " + javaMailSender.getJavaMailProperties().getProperty("mail.smtp.port"));
```

---

## ✅ Checklist de Configuración

- [ ] Verificación en dos pasos activada en Gmail
- [ ] App Password generada en Google
- [ ] `application.properties` actualizado con email y App Password
- [ ] Backend reiniciado después de cambios
- [ ] Endpoint `/test/welcome` probado exitosamente
- [ ] Email recibido en bandeja de entrada (o spam)
- [ ] Templates funcionando correctamente
- [ ] Integración en servicios implementada

---

## 🎨 Personalización de Templates

Para personalizar los templates de email:

1. Edita los archivos en `src/main/resources/templates/emails/`
2. Modifica colores, fuentes, textos según tu marca
3. Añade o elimina secciones según necesites
4. Prueba los cambios con los endpoints de test

**Colores actuales (Macrosur):**
- Primario: `#dc3545` (rojo)
- Secundario: `#c82333` (rojo oscuro)
- Éxito: `#28a745` (verde)
- Advertencia: `#ffc107` (amarillo)
- Info: `#17a2b8` (cyan)

---

## 📚 Recursos Adicionales

- [Documentación Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html)
- [Spring Boot Mail](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.email)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [HTML Email Best Practices](https://www.campaignmonitor.com/css/)

---

**Última actualización:** 28/11/2025  
**Versión:** 1.0  
**Autor:** Sistema Macrosur E-commerce
