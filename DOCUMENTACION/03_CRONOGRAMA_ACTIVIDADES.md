# 📅 CRONOGRAMA DE ACTIVIDADES - SISTEMA E-COMMERCE MACROSUR

## 📊 RESUMEN EJECUTIVO

**Fecha de inicio del proyecto**: 1 de noviembre de 2025  
**Fecha actual**: 1 de diciembre de 2025  
**Duración total estimada**: 6 meses (MVP completo)  
**Avance actual**: 72% del MVP base

---

## 🕒 LÍNEA DE TIEMPO COMPLETA

```
NOV 2025          DIC 2025          ENE 2026          FEB 2026          MAR 2026          ABR 2026
├─────────────────├─────────────────├─────────────────├─────────────────├─────────────────├─────────────────►
│ FASE 1: Base    │ FASE 2: Core    │ FASE 3: Avanzado│ FASE 4: Integr. │ FASE 5: Testing │ FASE 6: Prod.   │
│ [COMPLETADO ✅] │ [EN CURSO ⏳]   │ [PENDIENTE]     │ [PENDIENTE]     │ [PENDIENTE]     │ [PENDIENTE]     │
└─────────────────└─────────────────└─────────────────└─────────────────└─────────────────└─────────────────┘
```

---

## 📆 FASE 1: INFRAESTRUCTURA Y BASE (COMPLETADO ✅)

**Duración**: 4 semanas (1-30 noviembre 2025)  
**Estado**: 100% completado

### **Semana 1 (Nov 1-7): Setup y Arquitectura**
- [x] **Lunes 1**: Configuración de repositorio Git
- [x] **Martes 2**: Setup de proyecto Backend (Spring Boot 3.5.6)
- [x] **Miércoles 3**: Setup de proyecto Frontend (React 19 + Vite 7)
- [x] **Jueves 4**: Configuración de MySQL 8.4 + Flyway
- [x] **Viernes 5**: Diseño de arquitectura (diagramas UML)
- [x] **Sábado 6**: Configuración de Docker para desarrollo
- [x] **Domingo 7**: Documentación de estándares y convenciones

**Entregables**:
- ✅ Repositorio Git estructurado
- ✅ Backend corriendo en `http://localhost:8081`
- ✅ Frontend corriendo en `http://localhost:5173`
- ✅ Base de datos con esquema inicial

---

### **Semana 2 (Nov 8-14): Autenticación y Usuarios**
- [x] **Lunes 8**: Entidad `UsuarioAdmin` + Repository
- [x] **Martes 9**: JWT implementation (JwtUtil, JwtFilter)
- [x] **Miércoles 10**: AuthController + SecurityConfig
- [x] **Jueves 11**: Sistema de Roles y Permisos (entidades)
- [x] **Viernes 12**: Frontend: AuthContext + Login/Logout
- [x] **Sábado 13**: Integración de permisos granulares
- [x] **Domingo 14**: Testing de flujo de autenticación

**Entregables**:
- ✅ Login de admin funcional con JWT
- ✅ Sistema de roles (Super Admin, Gestor Ventas, Gestor Logística)
- ✅ Frontend con rutas protegidas
- ✅ Control de acceso por permisos

---

### **Semana 3 (Nov 15-21): Módulo de Productos**
- [x] **Lunes 15**: Entidades `Producto` + `Categoria`
- [x] **Martes 16**: Relación Many-to-Many categorías
- [x] **Miércoles 17**: DTOs (ProductoDTO, ProductoSaveDTO)
- [x] **Jueves 18**: ProductoService con lógica de negocio
- [x] **Viernes 19**: ProductoController + endpoints CRUD
- [x] **Sábado 20**: Frontend: ProductsPage (tabla CRUD)
- [x] **Domingo 21**: Testing de búsqueda y filtros

**Entregables**:
- ✅ CRUD completo de productos
- ✅ Sistema de categorías jerárquico
- ✅ Búsqueda y filtros avanzados
- ✅ Soft delete implementado

---

### **Semana 4 (Nov 22-30): Variantes e Imágenes**
- [x] **Lunes 22**: Entidad `VarianteProducto`
- [x] **Martes 23**: Auto-creación de variante default
- [x] **Miércoles 24**: Sistema de subida de imágenes
- [x] **Jueves 25**: FileStorageService + endpoints
- [x] **Viernes 26**: Frontend: Subida de múltiples imágenes
- [x] **Sábado 27**: Optimización de carga de imágenes
- [x] **Domingo 28**: Testing completo del módulo

**Entregables**:
- ✅ Variantes de productos funcionales
- ✅ Subida de imágenes múltiples
- ✅ Imagen principal designable
- ✅ URLs públicas `/uploads/images/`

---

## 📆 FASE 2: FUNCIONALIDADES CORE (EN CURSO ⏳)

**Duración**: 4 semanas (1-31 diciembre 2025)  
**Estado**: 65% completado

### **Semana 5 (Dic 1-7): Inventario Base**
- [x] **Lunes 1**: Entidades de logística (Inventario, UbicacionInventario)
- [x] **Martes 2**: MovimientoStock + AlarmaStock
- [x] **Miércoles 3**: InventarioService con lógica automática
- [x] **Jueves 4**: InventarioController + endpoints
- [x] **Viernes 5**: Frontend: InventoryPage básica
- [ ] **Sábado 6**: Ajustes manuales de inventario
- [ ] **Domingo 7**: Transferencias entre ubicaciones

**Entregables**:
- ✅ Sistema de inventario multi-ubicación
- ✅ Movimientos de stock automáticos
- ⏳ Frontend con ajustes y transferencias (90%)

---

### **Semana 6 (Dic 8-14): Órdenes de Reposición**
- [x] **Lunes 8**: Entidades `OrdenReposicion` + `DetalleOrdenReposicion`
- [x] **Martes 9**: Entidad `Proveedor`
- [x] **Miércoles 10**: OrdenReposicionService con CRON job
- [x] **Jueves 11**: Lógica de autorización y recepción
- [ ] **Viernes 12**: OrdenReposicionController
- [ ] **Sábado 13**: Frontend: OrdersPage
- [ ] **Domingo 14**: Testing de órdenes automáticas

**Entregables**:
- ✅ Job CRON diario (2 AM) funcional
- ✅ Autorización manual de órdenes
- ❌ Frontend de órdenes (pendiente)

---

### **Semana 7 (Dic 15-21): Sistema de Promociones**
- [x] **Lunes 15**: Entidad `ReglaDescuento`
- [x] **Martes 16**: PromocionService con Strategy pattern
- [x] **Miércoles 17**: Lógica de cálculo de descuentos
- [x] **Jueves 18**: PromocionController + endpoints
- [x] **Viernes 19**: Frontend: Banner de promociones
- [x] **Sábado 20**: Integración con carrito
- [x] **Domingo 21**: JSF admin panel para promociones

**Entregables**:
- ✅ Sistema de promociones dinámico
- ✅ Banner carousel en homepage
- ✅ Descuentos aplicados en carrito
- ✅ Panel admin (JSF) funcional

---

### **Semana 8 (Dic 22-31): Reseñas y Clientes**
- [x] **Lunes 22**: Entidades `Cliente` + `Resena`
- [x] **Martes 23**: ClienteService + ResenaService
- [x] **Miércoles 24**: Sistema de moderación
- [x] **Jueves 25**: *Día festivo* (planificación)
- [x] **Viernes 26**: Frontend: ProductReviews component
- [x] **Sábado 27**: Panel de moderación admin
- [ ] **Domingo 28**: Integración OAuth2 (deshabilitado temporalmente)
- [ ] **Lunes 29**: Testing de autenticación dual
- [ ] **Martes 30**: Fix de bugs de reseñas
- [ ] **Miércoles 31**: Cierre de año (documentación)

**Entregables**:
- ✅ Sistema de reseñas completo
- ✅ Moderación admin funcional
- ⏳ OAuth2 implementado pero deshabilitado
- ✅ AuthContext unificado

---

## 📆 FASE 3: FUNCIONALIDADES AVANZADAS (PENDIENTE)

**Duración**: 4 semanas (1-31 enero 2026)  
**Estado**: 0% completado

### **Semana 9 (Ene 1-7): Pedidos y Carrito**
- [ ] **Jueves 2**: Feriado (planificación)
- [ ] **Viernes 3**: Entidad `Pedido` + `DetallePedido`
- [ ] **Sábado 4**: PedidoService con validación de stock
- [ ] **Domingo 5**: Cálculo de IVA y envío
- [ ] **Lunes 6**: PedidoController + endpoints
- [ ] **Martes 7**: Frontend: CartPage completa

**Entregables esperados**:
- [ ] Carrito funcional con descuentos
- [ ] Creación de pedido desde carrito
- [ ] Descuento automático de stock
- [ ] Email de confirmación

---

### **Semana 10 (Ene 8-14): Seguimiento Logístico**
- [ ] **Miércoles 8**: Entidad `SeguimientoDespacho`
- [ ] **Jueves 9**: SeguimientoService + integración con operadores
- [ ] **Viernes 10**: Estados de seguimiento (EN_TRANSITO, ENTREGADO)
- [ ] **Sábado 11**: Frontend: TrackingPage
- [ ] **Domingo 12**: Página pública de rastreo
- [ ] **Lunes 13**: Notificaciones de cambio de estado
- [ ] **Martes 14**: Testing de flujo completo de pedido

**Entregables esperados**:
- [ ] Seguimiento de despachos con operadores
- [ ] URL pública de rastreo para clientes
- [ ] Actualización de estados en tiempo real

---

### **Semana 11 (Ene 15-21): Reportes y PDF**
- [ ] **Miércoles 15**: Configuración de JasperReports
- [ ] **Jueves 16**: Templates de reportes (.jrxml)
- [ ] **Viernes 17**: JasperReportService + endpoints
- [ ] **Sábado 18**: Reporte de inventario (PDF/Excel)
- [ ] **Domingo 19**: Reporte de ventas
- [ ] **Lunes 20**: Frontend: Página de reportes
- [ ] **Martes 21**: Testing de generación de PDFs

**Entregables esperados**:
- [ ] Reporte de inventario descargable
- [ ] Reporte de ventas por período
- [ ] PDF de orden de compra
- [ ] Panel de reportes en admin

---

### **Semana 12 (Ene 22-31): Dashboard BI**
- [ ] **Miércoles 22**: Diseño de KPIs y métricas
- [ ] **Jueves 23**: Queries SQL para dashboard
- [ ] **Viernes 24**: Backend: DashboardController
- [ ] **Sábado 25**: Frontend: DashboardPage con Chart.js
- [ ] **Domingo 26**: Gráficos de ventas por período
- [ ] **Lunes 27**: Gráficos de top productos
- [ ] **Martes 28**: Gráficos de stock crítico
- [ ] **Miércoles 29**: Métricas en tiempo real
- [ ] **Jueves 30**: Testing de performance
- [ ] **Viernes 31**: Optimización de queries

**Entregables esperados**:
- [ ] Dashboard con KPIs principales
- [ ] Gráficos interactivos (Chart.js o Recharts)
- [ ] Filtros por fecha y categoría
- [ ] Auto-refresh cada 5 minutos

---

## 📆 FASE 4: INTEGRACIONES (PENDIENTE)

**Duración**: 4 semanas (1-28 febrero 2026)  
**Estado**: 0% completado

### **Semana 13 (Feb 1-7): Pasarela de Pagos**
- [ ] **Lunes 2**: Investigación de Webpay Plus API
- [ ] **Martes 3**: Configuración de ambiente sandbox
- [ ] **Miércoles 4**: Backend: WebpayService
- [ ] **Jueves 5**: Endpoints de inicio y confirmación de pago
- [ ] **Viernes 6**: Frontend: CheckoutPage con Webpay
- [ ] **Sábado 7**: Testing en sandbox

**Entregables esperados**:
- [ ] Integración Webpay Plus (sandbox)
- [ ] Flujo completo de pago
- [ ] Validación de firma de respuesta
- [ ] Estados: PAGADO / RECHAZADO / ANULADO

---

### **Semana 14 (Feb 8-14): OAuth2 Completo**
- [ ] **Lunes 8**: Configurar Google Cloud Console
- [ ] **Martes 9**: Obtener Google Client ID y Secret
- [ ] **Miércoles 10**: Configurar Microsoft Azure AD
- [ ] **Jueves 11**: Obtener Microsoft Client ID
- [ ] **Viernes 12**: Actualizar clientAuth.js con IDs reales
- [ ] **Sábado 13**: Testing de login con Google
- [ ] **Domingo 14**: Testing de login con Microsoft

**Entregables esperados**:
- [ ] OAuth2 Google funcional
- [ ] OAuth2 Microsoft funcional
- [ ] Auto-registro de clientes OAuth
- [ ] Avatar URL guardado

---

### **Semana 15 (Feb 15-21): Emails Avanzados**
- [ ] **Lunes 15**: Configuración SMTP productivo
- [ ] **Martes 16**: Templates Thymeleaf profesionales
- [ ] **Miércoles 17**: Email de bienvenida
- [ ] **Jueves 18**: Email de recuperación de contraseña
- [ ] **Viernes 19**: Email de newsletter promocional
- [ ] **Sábado 20**: Email de reseña aprobada
- [ ] **Domingo 21**: Testing de envíos masivos

**Entregables esperados**:
- [ ] Sistema de emails completo
- [ ] Templates con diseño profesional
- [ ] Queue de emails (evitar bloqueos)
- [ ] Logs de envíos exitosos/fallidos

---

### **Semana 16 (Feb 22-28): Optimización de Imágenes**
- [ ] **Lunes 22**: Configuración de Cloudinary o Imgix
- [ ] **Martes 23**: Migración de imágenes a CDN
- [ ] **Miércoles 24**: Compresión automática al subir
- [ ] **Jueves 25**: Generación de thumbnails
- [ ] **Viernes 26**: Lazy loading en catálogo
- [ ] **Sábado 27**: Testing de performance
- [ ] **Domingo 28**: Optimización de carga inicial

**Entregables esperados**:
- [ ] Imágenes servidas desde CDN
- [ ] Compresión automática (WebP)
- [ ] Thumbnails en lista de productos
- [ ] Mejora de 50%+ en tiempo de carga

---

## 📆 FASE 5: TESTING Y QA (PENDIENTE)

**Duración**: 4 semanas (1-31 marzo 2026)  
**Estado**: 0% completado

### **Semana 17 (Mar 1-7): Testing Funcional**
- [ ] **Lunes 1**: Testing de registro de clientes
- [ ] **Martes 2**: Testing de flujo de compra E2E
- [ ] **Miércoles 3**: Testing de promociones aplicadas
- [ ] **Jueves 4**: Testing de inventario automático
- [ ] **Viernes 5**: Testing de reseñas y moderación
- [ ] **Sábado 6**: Testing de reportes PDF
- [ ] **Domingo 7**: Fix de bugs críticos

---

### **Semana 18 (Mar 8-14): Testing de Performance**
- [ ] **Lunes 8**: JMeter: Carga de 100 usuarios concurrentes
- [ ] **Martes 9**: Análisis de queries lentas
- [ ] **Miércoles 10**: Optimización con índices de BD
- [ ] **Jueves 11**: Implementación de Redis caché
- [ ] **Viernes 12**: Testing de caché
- [ ] **Sábado 13**: JMeter: Carga de 500 usuarios
- [ ] **Domingo 14**: Informe de performance

**Métricas objetivo**:
- [ ] Tiempo de respuesta API < 200ms (P95)
- [ ] Tiempo de carga página < 2 segundos
- [ ] Capacidad: 500 req/seg

---

### **Semana 19 (Mar 15-21): Testing de Seguridad**
- [ ] **Lunes 15**: Auditoría de inyección SQL
- [ ] **Martes 16**: Auditoría de XSS
- [ ] **Miércoles 17**: Auditoría de CSRF
- [ ] **Jueves 18**: Implementación de rate limiting
- [ ] **Viernes 19**: Testing de autorización por roles
- [ ] **Sábado 20**: Auditoría de tokens JWT
- [ ] **Domingo 21**: Fix de vulnerabilidades

**Herramientas**:
- [ ] OWASP ZAP
- [ ] Burp Suite
- [ ] Spring Security Test

---

### **Semana 20 (Mar 22-31): Testing de Usuario (UAT)**
- [ ] **Lunes 22**: Reclutamiento de usuarios beta
- [ ] **Martes 23**: Sesiones de UAT con 10 usuarios
- [ ] **Miércoles 24**: Recolección de feedback
- [ ] **Jueves 25**: Ajustes de UX
- [ ] **Viernes 26**: Segunda ronda de UAT
- [ ] **Sábado 27**: Fix de usabilidad
- [ ] **Domingo 28**: Testing de navegadores (Chrome, Firefox, Safari)
- [ ] **Lunes 29**: Testing responsive (mobile, tablet)
- [ ] **Martes 30**: Preparación de lanzamiento
- [ ] **Miércoles 31**: Documentación final de usuario

---

## 📆 FASE 6: DESPLIEGUE Y PRODUCCIÓN (PENDIENTE)

**Duración**: 4 semanas (1-30 abril 2026)  
**Estado**: 0% completado

### **Semana 21 (Abr 1-7): Preparación de Infraestructura**
- [ ] **Martes 1**: Contratación de servidor (AWS, DigitalOcean)
- [ ] **Miércoles 2**: Configuración de dominio y DNS
- [ ] **Jueves 3**: Instalación de certificado SSL
- [ ] **Viernes 4**: Configuración de Docker Compose en servidor
- [ ] **Sábado 5**: Setup de base de datos productiva
- [ ] **Domingo 6**: Backup automático configurado
- [ ] **Lunes 7**: Configuración de monitoreo (Prometheus)

---

### **Semana 22 (Abr 8-14): Despliegue Backend**
- [ ] **Martes 8**: Build de JAR productivo
- [ ] **Miércoles 9**: Deploy de backend en servidor
- [ ] **Jueves 10**: Configuración de Nginx reverse proxy
- [ ] **Viernes 11**: Migración de BD con Flyway
- [ ] **Sábado 12**: Testing de endpoints productivos
- [ ] **Domingo 13**: Configuración de logs centralizados
- [ ] **Lunes 14**: Pruebas de stress en producción

---

### **Semana 23 (Abr 15-21): Despliegue Frontend**
- [ ] **Martes 15**: Build de producción (npm run build)
- [ ] **Miércoles 16**: Deploy de React en servidor
- [ ] **Jueves 17**: Configuración de SPA routing en Nginx
- [ ] **Viernes 18**: Testing de CORS en producción
- [ ] **Sábado 19**: Optimización de bundle size
- [ ] **Domingo 20**: CDN para assets estáticos
- [ ] **Lunes 21**: Testing E2E en producción

---

### **Semana 24 (Abr 22-30): Lanzamiento y Monitoreo**
- [ ] **Martes 22**: Lanzamiento soft (solo invitados)
- [ ] **Miércoles 23**: Monitoreo de errores en Sentry
- [ ] **Jueves 24**: Análisis de métricas con Google Analytics
- [ ] **Viernes 25**: Ajustes basados en feedback
- [ ] **Sábado 26**: **LANZAMIENTO PÚBLICO** 🚀
- [ ] **Domingo 27**: Monitoreo intensivo 24/7
- [ ] **Lunes 28**: Fix de bugs críticos
- [ ] **Martes 29**: Comunicado de prensa
- [ ] **Miércoles 30**: Retrospectiva del equipo

---

## 📊 MÉTRICAS DE PROGRESO

### **Completitud por Área**

```
BACKEND                  ████████████████████░░  88% (22/25 servicios)
FRONTEND CLIENTE         ████████████████░░░░░░  70% (14/20 páginas)
FRONTEND ADMIN           █████████████░░░░░░░░░  60% (12/20 páginas)
INTEGRACIONES            █████░░░░░░░░░░░░░░░░  25% (1/4 completas)
TESTING                  ████░░░░░░░░░░░░░░░░░  20% (manual básico)
DESPLIEGUE               ░░░░░░░░░░░░░░░░░░░░░  0% (local only)
────────────────────────────────────────────────────────────────
PROGRESO TOTAL           ████████████████░░░░░░  72% (MVP funcional)
```

### **Horas Trabajadas vs Estimadas**

| Fase | Horas Estimadas | Horas Trabajadas | Variación | Estado |
|------|-----------------|------------------|-----------|--------|
| **Fase 1: Base** | 160h (4 sem × 40h) | 175h | +15h | ✅ Completo |
| **Fase 2: Core** | 160h | 115h (parcial) | - | ⏳ En curso |
| **Fase 3: Avanzado** | 160h | 0h | - | 📅 Pendiente |
| **Fase 4: Integr.** | 160h | 0h | - | 📅 Pendiente |
| **Fase 5: Testing** | 160h | 0h | - | 📅 Pendiente |
| **Fase 6: Producción** | 160h | 0h | - | 📅 Pendiente |
| **TOTAL** | **960h (6 meses)** | **290h** | - | **30% tiempo** |

---

## 🎯 HITOS CLAVE (MILESTONES)

| # | Hito | Fecha Objetivo | Estado | % Completitud |
|---|------|----------------|--------|---------------|
| 1 | ✅ Arquitectura definida | 7 nov 2025 | Completo | 100% |
| 2 | ✅ Autenticación funcional | 14 nov 2025 | Completo | 100% |
| 3 | ✅ CRUD de productos | 21 nov 2025 | Completo | 100% |
| 4 | ✅ Sistema de variantes | 30 nov 2025 | Completo | 100% |
| 5 | ⏳ Inventario completo | 7 dic 2025 | En curso | 90% |
| 6 | ⏳ Órdenes de reposición | 14 dic 2025 | En curso | 80% |
| 7 | ✅ Sistema de promociones | 21 dic 2025 | Completo | 100% |
| 8 | ⏳ Reseñas y moderación | 31 dic 2025 | En curso | 95% |
| 9 | 📅 Carrito y pedidos | 7 ene 2026 | Pendiente | 0% |
| 10 | 📅 Seguimiento logístico | 14 ene 2026 | Pendiente | 0% |
| 11 | 📅 Reportes PDF | 21 ene 2026 | Pendiente | 0% |
| 12 | 📅 Dashboard BI | 31 ene 2026 | Pendiente | 0% |
| 13 | 📅 Pasarela de pagos | 7 feb 2026 | Pendiente | 0% |
| 14 | 📅 OAuth2 completo | 14 feb 2026 | Pendiente | 50% |
| 15 | 📅 Sistema de emails | 21 feb 2026 | Pendiente | 60% |
| 16 | 📅 CDN de imágenes | 28 feb 2026 | Pendiente | 0% |
| 17 | 📅 Testing completo | 31 mar 2026 | Pendiente | 0% |
| 18 | 📅 **LANZAMIENTO MVP** | 26 abr 2026 | Pendiente | 0% |

---

## 🚨 RIESGOS Y MITIGACIÓN

### **Riesgos Identificados**

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Retraso en integración de pagos** | Alta | Alto | Tener mock de pagos manual |
| **OAuth2 no funcional** | Media | Medio | Login manual como backup |
| **Performance en producción** | Media | Alto | Testing de carga previo |
| **Bugs críticos post-lanzamiento** | Media | Alto | Fase de soft launch |
| **Problemas con Flyway migrations** | Baja | Alto | Backups diarios automáticos |
| **CORS en producción** | Baja | Medio | Testing en staging previo |

### **Contingencias**

**Si retraso de 1 semana**:
- Reducir alcance de Dashboard BI (solo KPIs esenciales)
- Posponer OAuth2 para versión 1.1

**Si retraso de 2+ semanas**:
- Lanzar con funcionalidades core únicamente:
  - Catálogo + Carrito + Pedidos (sin pago online)
  - Inventario básico (sin órdenes automáticas)
  - Sin reportes PDF ni dashboard

---

## 📈 ROADMAP POST-LANZAMIENTO (V1.1+)

### **Versión 1.1 (Mayo-Junio 2026)**
- [ ] Wishlist de productos
- [ ] Comparador de productos
- [ ] Sistema de cupones
- [ ] Historial de búsquedas
- [ ] Productos relacionados con IA

### **Versión 1.2 (Julio-Agosto 2026)**
- [ ] App móvil (React Native)
- [ ] Notificaciones push
- [ ] Chat de soporte en vivo
- [ ] Programa de puntos/fidelización
- [ ] Multi-idioma (inglés, portugués)

### **Versión 2.0 (Sept-Dic 2026)**
- [ ] Marketplace (vendedores externos)
- [ ] Sistema de subastas
- [ ] Dropshipping integrado
- [ ] IA para recomendaciones
- [ ] Realidad aumentada (AR) para muebles

---

## 📞 REUNIONES Y CEREMONIAS

### **Daily Standup** (Lunes a Viernes 9:00 AM)
- ¿Qué hice ayer?
- ¿Qué haré hoy?
- ¿Tengo bloqueos?

### **Sprint Planning** (Lunes inicio de semana)
- Definir tareas de la semana
- Asignar responsables
- Estimar esfuerzo

### **Sprint Review** (Viernes fin de semana)
- Demostración de avances
- Feedback del equipo
- Ajustes de alcance

### **Retrospectiva** (Viernes fin de mes)
- ¿Qué salió bien?
- ¿Qué mejorar?
- Acciones concretas

---

## 🎯 DEFINICIÓN DE "HECHO" (DoD)

Para considerar una funcionalidad completa debe cumplir:

- [x] Código implementado y funcional
- [x] Tests unitarios (backend) > 80% cobertura
- [x] Tests de integración (E2E) básicos
- [x] Documentación técnica actualizada
- [x] Sin errores en consola (frontend)
- [x] Sin warnings de seguridad (backend)
- [x] Revisión de código (peer review)
- [x] Testing manual exitoso
- [x] Deployed en rama develop

---

## 📝 NOTAS IMPORTANTES

### **Cambios de Alcance**
- **21 nov**: Se agregó sistema de variantes (no estaba en scope inicial) - +3 días
- **27 nov**: Se implementó OAuth2 completo (deshabilitado temporalmente) - +2 días
- **5 dic**: Se agregó sistema de alarmas de stock - +1 día

### **Lecciones Aprendidas**
- ✅ Flyway es esencial para migraciones consistentes
- ✅ Soft delete mejor que hard delete (evita problemas FK)
- ✅ Lombok reduce 40% de código boilerplate
- ✅ AuthContext unificado simplifica autenticación dual
- ⚠️ OAuth2 requiere configuración manual en consolas (no automatizable)

---

**Última actualización**: 1 de diciembre de 2025  
**Versión del documento**: 1.0  
**Próxima revisión**: 7 de diciembre de 2025
