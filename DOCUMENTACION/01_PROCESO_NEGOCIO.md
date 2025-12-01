# 📋 PROCESO DE NEGOCIO - SISTEMA E-COMMERCE MACROSUR

## 🎯 DESCRIPCIÓN GENERAL

**Macrosur E-Commerce** es una plataforma de comercio electrónico híbrida que combina tecnologías modernas (React + Spring Boot REST) con tecnologías tradicionales (JSF + JavaEE) para la gestión integral de ventas en línea, inventario, logística y administración.

---

## 🏪 MODELO DE NEGOCIO

### **Tipo de Negocio**
- **B2C (Business to Consumer)**: Venta directa al consumidor final
- **Retail Multi-Producto**: Enfoque en productos para el hogar
- **Modelo Híbrido**: Stock consignado + Inventario propio

### **Propuesta de Valor**
1. **Catálogo Amplio**: Muebles, cortinas, accesorios decorativos
2. **Gestión Logística Avanzada**: Control automático de stock, alertas de reposición
3. **Sistema de Promociones Dinámico**: Descuentos por temporada, categoría, cliente
4. **Experiencia Omnicanal**: Compra online, retiro en tienda, envío a domicilio
5. **Reseñas y Calificaciones**: Sistema de opiniones verificadas

---

## 👥 ACTORES DEL SISTEMA

### **1. Cliente (Usuario Final)**
**Objetivo**: Comprar productos de manera rápida y segura

**Funcionalidades**:
- Registro y autenticación (email/contraseña o OAuth2)
- Navegación de catálogo con filtros y búsqueda
- Visualización de productos con imágenes optimizadas
- Agregar productos al carrito de compras
- Aplicar promociones automáticas en checkout
- Realizar pedido con datos de envío
- Seguimiento de pedido en tiempo real
- Escribir reseñas de productos comprados
- Gestión de perfil y direcciones

### **2. Administrador**
**Objetivo**: Gestionar toda la operación del e-commerce

**Roles Especializados**:
- **Super Admin**: Acceso total
- **Gestor Ventas**: Productos, categorías, pedidos, reseñas
- **Gestor Logística**: Inventario, órdenes de reposición, alarmas
- **Moderador**: Reseñas, reclamos

**Funcionalidades por Módulo**:

#### **Gestión de Productos**
- CRUD completo de productos y categorías
- Subida masiva de imágenes
- Gestión de variantes (tallas, colores)
- Control de visibilidad (activo/inactivo)

#### **Gestión de Pedidos**
- Visualización de pedidos con estados
- Actualización manual de estados
- Descarga de PDF de orden de compra
- Historial completo de transacciones

#### **Gestión de Inventario**
- Visualización de stock por ubicación
- Ajustes manuales (mermas, correcciones)
- Transferencias entre ubicaciones
- Consulta de movimientos históricos

#### **Gestión de Logística**
- Alarmas de stock bajo/crítico
- Órdenes de reposición automáticas
- Autorización de órdenes de compra
- Recepción de mercancía
- Seguimiento de despachos con operadores

#### **Gestión de Promociones**
- Creación de reglas de descuento
- Descuentos por porcentaje, monto fijo, envío gratis
- Aplicación por categoría, producto o cliente
- Programación de fechas de vigencia
- Banner de promociones en homepage

#### **Gestión de Reseñas**
- Moderación de reseñas pendientes
- Aprobación/rechazo con comentarios
- Eliminación de reseñas inapropiadas
- Vista de estadísticas por producto

#### **Reportes y Analítica**
- Reporte de inventario (PDF/Excel)
- Reporte de ventas por período
- Reporte de órdenes de reposición
- Dashboard con KPIs en tiempo real

---

## 🔄 FLUJOS DE PROCESO PRINCIPALES

### **FLUJO 1: Compra de Cliente (E2E)**

```
1. NAVEGACIÓN Y SELECCIÓN
   ├─ Cliente accede al catálogo
   ├─ Aplica filtros (categoría, precio, búsqueda)
   ├─ Visualiza detalle del producto
   └─ Lee reseñas de otros clientes

2. CARRITO DE COMPRAS
   ├─ Agrega productos al carrito
   ├─ Sistema valida stock disponible
   ├─ Muestra descuentos aplicables
   └─ Calcula totales (subtotal + IVA + envío)

3. CHECKOUT
   ├─ Cliente inicia sesión (o continúa como invitado)
   ├─ Ingresa dirección de envío
   ├─ Selecciona método de pago
   └─ Confirma orden

4. PROCESAMIENTO BACKEND
   ├─ Sistema descuenta stock automáticamente
   ├─ Genera movimientos de stock (SALIDA_VENTA)
   ├─ Crea alarmas si stock < mínimo
   ├─ Envía email de confirmación al cliente
   └─ Asigna estado "PENDIENTE"

5. LOGÍSTICA
   ├─ Admin visualiza pedido en panel
   ├─ Prepara mercancía
   ├─ Crea seguimiento de despacho
   ├─ Asigna operador logístico (Chilexpress, Starken)
   └─ Actualiza estado a "DESPACHADO"

6. POST-VENTA
   ├─ Cliente recibe producto
   ├─ Admin actualiza estado a "ENTREGADO"
   ├─ Sistema habilita opción de reseña
   └─ Cliente escribe reseña → Moderación → Publicación
```

---

### **FLUJO 2: Gestión de Inventario Automática**

```
1. MONITOREO CONTINUO
   ├─ Sistema verifica stock cada pedido
   ├─ Compara cantidad vs stock mínimo
   └─ Genera alarma si stock < mínimo

2. GENERACIÓN DE ÓRDENES (CRON 2 AM)
   ├─ Job programado busca alarmas activas
   ├─ Agrupa productos por proveedor
   ├─ Calcula cantidad óptima de reposición
   ├─ Crea orden de reposición automática
   └─ Estado: PENDIENTE

3. AUTORIZACIÓN
   ├─ Admin revisa órdenes en panel
   ├─ Verifica costos y cantidades
   ├─ Autoriza orden → Estado: AUTORIZADA
   └─ Opcional: Rechaza orden → Estado: RECHAZADA

4. RECEPCIÓN DE MERCANCÍA
   ├─ Proveedor envía mercancía
   ├─ Admin registra recepción
   ├─ Ingresa cantidades recibidas por variante
   ├─ Sistema actualiza inventario:
   │   ├─ PROVEEDOR: Descuenta stock consignado
   │   └─ TIENDA: Incrementa stock disponible
   ├─ Genera movimientos de stock
   ├─ Resuelve alarmas asociadas
   └─ Estado: RECIBIDA
```

---

### **FLUJO 3: Promociones Dinámicas**

```
1. CREACIÓN DE REGLA
   ├─ Admin accede a módulo de promociones
   ├─ Define parámetros:
   │   ├─ Nombre: "Black Friday 2025"
   │   ├─ Tipo: PORCENTAJE / MONTO_FIJO / ENVIO_GRATIS
   │   ├─ Valor: 20%
   │   ├─ Aplicación: CATEGORIA (muebles)
   │   ├─ Fechas: 24/11/2025 - 30/11/2025
   │   └─ Prioridad: Alta
   └─ Guarda regla → Estado: Activa

2. VISUALIZACIÓN CLIENTE
   ├─ Banner de promociones en homepage (carousel)
   ├─ Badge de descuento en cards de productos
   └─ Precio tachado + precio final en detalle

3. APLICACIÓN EN CARRITO
   ├─ Cliente agrega productos al carrito
   ├─ Sistema busca reglas activas:
   │   ├─ Filtra por fecha vigente
   │   ├─ Filtra por categoría/producto
   │   └─ Ordena por prioridad
   ├─ Aplica descuento más favorable
   ├─ Muestra descuento en resumen de carrito
   └─ Guarda en base de datos al confirmar pedido
```

---

### **FLUJO 4: Reseñas y Moderación**

```
1. ESCRITURA DE RESEÑA
   ├─ Cliente accede a producto comprado
   ├─ Click en "Escribir Reseña"
   ├─ Sistema valida autenticación
   ├─ Cliente ingresa:
   │   ├─ Calificación (1-5 estrellas)
   │   └─ Comentario (opcional)
   ├─ Envía reseña → Estado: PENDIENTE
   └─ Notificación a admin

2. MODERACIÓN
   ├─ Admin accede a panel de reseñas
   ├─ Visualiza reseñas pendientes
   ├─ Lee contenido y calificación
   └─ Toma decisión:
       ├─ APROBAR → Estado: APROBADA (visible públicamente)
       └─ RECHAZAR → Estado: RECHAZADA (no visible)

3. VISUALIZACIÓN PÚBLICA
   ├─ Reseñas aprobadas aparecen en detalle de producto
   ├─ Sistema calcula promedio de calificaciones
   ├─ Muestra badge "Compra verificada"
   └─ Ordena por fecha (más recientes primero)
```

---

## 📊 INDICADORES CLAVE DE RENDIMIENTO (KPIs)

### **Operacionales**
| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **Tasa de Conversión** | (Pedidos / Visitas) × 100 | > 2% |
| **Valor Promedio de Orden** | Total ventas / Nº pedidos | > $50.000 CLP |
| **Tiempo de Fulfillment** | Tiempo desde pedido hasta entrega | < 48 horas |
| **Stock-Out Rate** | (Productos sin stock / Total) × 100 | < 5% |
| **Precisión de Inventario** | (Stock real / Stock sistema) × 100 | > 98% |

### **Financieros**
| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **Margen Bruto** | (Ventas - Costo) / Ventas × 100 | > 30% |
| **ROI Promociones** | (Ventas promoción - Costo) / Costo × 100 | > 150% |
| **Costo de Adquisición** | Gasto marketing / Nº clientes nuevos | < $5.000 CLP |

### **Satisfacción del Cliente**
| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **NPS (Net Promoter Score)** | % promotores - % detractores | > 50 |
| **Promedio de Reseñas** | Suma calificaciones / Nº reseñas | > 4.0 / 5.0 |
| **Tasa de Devoluciones** | (Devoluciones / Pedidos) × 100 | < 3% |

---

## 🔄 CICLO DE VIDA DEL PEDIDO

```
PENDIENTE (Recién creado)
   │
   ├─ Stock descontado automáticamente
   ├─ Email de confirmación enviado
   └─ Pedido visible en panel admin
   │
   ▼
EN_PROCESO (Admin prepara mercancía)
   │
   ├─ Operador logístico asignado
   └─ Seguimiento creado
   │
   ▼
DESPACHADO (Enviado al cliente)
   │
   ├─ Cliente puede rastrear con código
   └─ Notificación por email
   │
   ▼
ENTREGADO (Cliente recibió producto)
   │
   ├─ Opción de reseña habilitada
   └─ Proceso completo
   │
   ▼
CANCELADO (Cualquier estado previo)
   │
   ├─ Stock devuelto automáticamente
   ├─ Reembolso procesado (si aplica)
   └─ Notificación al cliente
```

---

## 💡 REGLAS DE NEGOCIO CRÍTICAS

### **Inventario**
1. **Stock nunca puede ser negativo**
2. **Alarma se genera automáticamente si stock < mínimo**
3. **Orden de reposición se crea solo para alarmas activas**
4. **Stock mínimo se calcula automáticamente (ventas últimos 30 días × 1.5)**
5. **Inventario se actualiza en tiempo real con cada pedido**

### **Promociones**
1. **Solo una promoción aplicable por producto** (la de mayor descuento)
2. **Promociones con prioridad mayor se aplican primero**
3. **Descuentos no se acumulan** (cliente elige uno)
4. **Envío gratis se combina con otros descuentos**
5. **Promociones caducadas no aparecen en frontend**

### **Pedidos**
1. **Stock se descuenta al crear pedido, no al pagar**
2. **Pedido cancelado devuelve stock automáticamente**
3. **IVA 19% se aplica siempre**
4. **Costo de envío se calcula por peso total**
5. **Cliente no puede cancelar pedido en estado DESPACHADO**

### **Reseñas**
1. **Solo clientes autenticados pueden reseñar**
2. **Cliente solo puede reseñar productos que compró**
3. **Una reseña por cliente por producto**
4. **Reseñas requieren moderación antes de publicarse**
5. **Admin no puede modificar contenido, solo aprobar/rechazar**

---

## 🎯 OBJETIVOS ESTRATÉGICOS

### **Corto Plazo (0-6 meses)**
- ✅ Lanzar MVP con módulos core funcionales
- ✅ Implementar sistema de promociones dinámico
- ✅ Automatizar gestión de inventario
- ⏳ Integrar pasarela de pagos (Webpay, Mercado Pago)
- ⏳ Implementar panel de reportes con BI

### **Mediano Plazo (6-12 meses)**
- ⏳ Desarrollar app móvil nativa
- ⏳ Implementar chat de soporte en vivo
- ⏳ Sistema de recomendaciones con ML
- ⏳ Programa de fidelización con puntos
- ⏳ Multi-tenancy para otras marcas

### **Largo Plazo (12+ meses)**
- ⏳ Expansión a marketplace (vendedores externos)
- ⏳ Logística propia (flota de reparto)
- ⏳ Integración con ERP corporativo
- ⏳ Sucursales físicas con kioscos digitales
- ⏳ Exportación a otros países (Perú, Colombia)

---

## 📈 MÉTRICAS DE ÉXITO

### **Lanzamiento Exitoso**
- [x] Sistema en producción estable (uptime > 99%)
- [x] Catálogo con > 100 productos activos
- [ ] > 1.000 usuarios registrados primer mes
- [ ] > 100 pedidos completados primer mes
- [ ] Promedio de reseñas > 4.0 estrellas

### **Crecimiento Sostenible**
- [ ] Crecimiento mensual de ventas > 15%
- [ ] Retención de clientes > 40%
- [ ] Tiempo de carga < 2 segundos
- [ ] Tasa de abandono de carrito < 60%
- [ ] ROI marketing > 200%

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

### **Datos Sensibles**
- Contraseñas encriptadas (BCrypt)
- Tokens JWT con expiración 24h
- Headers CORS restrictivos en producción
- HTTPS obligatorio para pagos
- PCI-DSS compliance para tarjetas

### **Auditoría**
- Log de todas las transacciones
- Registro de cambios de inventario
- Historial de actualizaciones de pedidos
- Tracking de acciones de admin

---

## 📞 CONTACTO Y SOPORTE

**Equipo de Desarrollo**
- Backend: Java/Spring Boot
- Frontend: React/Vite
- Base de Datos: MySQL 8.4
- DevOps: Docker, CI/CD

**Documentación Técnica**
- Ver archivos en carpeta `/DOCUMENTACION/`
- Diagramas de arquitectura en `/DOCUMENTACION/04_ARQUITECTURA_SOFTWARE.md`
- Patrones de diseño en `/DOCUMENTACION/05_PATRONES_DISEÑO.md`

---

**Última actualización**: 1 de diciembre de 2025  
**Versión del documento**: 1.0
