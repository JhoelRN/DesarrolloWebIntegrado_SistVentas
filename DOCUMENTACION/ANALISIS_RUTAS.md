# 🗺️ ANÁLISIS DE RUTAS - MACROSUR E-COMMERCE

**Fecha de análisis**: 1 de diciembre de 2025  
**Estado**: ⚠️ **Requiere correcciones**

---

## 📋 RESUMEN EJECUTIVO

### **Problemas Detectados**:
1. ❌ **Ruta `/info/:slug`** no tiene backend implementado
2. ❌ **Ruta `/track`** (rastreo de pedidos) no existe
3. ⚠️ **ProfileRouter** tiene páginas stub sin implementar
4. ⚠️ **ClaimsPage** (admin) existe pero sin funcionalidad de backend
5. ✅ **Mayoría de rutas admin** tienen páginas y backend funcional

---

## 🌐 RUTAS DEL FRONTEND (CLIENTE)

### **✅ RUTAS PÚBLICAS - FUNCIONAN**

| Ruta | Archivo | Backend | Estado |
|------|---------|---------|--------|
| `/` | HomePage.jsx | ✅ | ✅ Funciona |
| `/catalogo` | CatalogPage.jsx | ✅ | ✅ Funciona |
| `/producto/:id` | ProductDetailPage.jsx | ✅ | ✅ Funciona |
| `/cart` | CartPage.jsx | LocalStorage | ✅ Funciona |
| `/checkout` | CheckoutPage.jsx | ✅ | ✅ Funciona |
| `/login` | LoginClientePage.jsx | ✅ | ✅ Funciona |
| `/register` | RegisterClientePage.jsx | ✅ | ✅ Funciona |
| `/admin/login` | AdminLoginPage.jsx | ✅ | ✅ Funciona |
| `/oauth/callback` | OAuthCallbackPage.jsx | ✅ | ✅ Funciona |

---

### **⚠️ RUTAS CON PROBLEMAS**

#### **1. Ruta de Información Corporativa**

```jsx
<Route path="/info/:slug" element={<InfoPage />} />
```

**Problema**:
- Header enlaza a `/info/soporte` pero **NO hay backend** para `Contenido_Informativo`
- La tabla `contenido_informativo` en BD está vacía
- El controlador Spring NO existe

**Solución**:
```jsx
// Cambiar por ahora a páginas estáticas o redireccionar
<Route path="/ayuda" element={<AyudaPage />} />
<Route path="/contacto" element={<ContactoPage />} />
```

**O crear backend**:
```java
@RestController
@RequestMapping("/api/contenido")
public class ContenidoInformativoController {
    @GetMapping("/{slug}")
    public ResponseEntity<ContenidoInformativo> getBySlug(@PathVariable String slug) {
        // Implementar
    }
}
```

---

#### **2. Ruta de Rastreo de Pedidos**

```jsx
// En Header.jsx
<Nav.Link as={Link} to="/track" className="text-secondary">
    <i className="bi bi-geo-alt-fill me-1"></i> Rastrea tu Pedido
</Nav.Link>
```

**Problema**:
- **Ruta `/track` NO definida** en AppRouter
- Genera error 404

**Solución**:
```jsx
// En AppRouter.jsx
<Route path="/track" element={<TrackOrderPage />} />
```

**Crear página**:
```jsx
// src/pages/frontend/TrackOrderPage.jsx
const TrackOrderPage = () => {
  const [numeroGuia, setNumeroGuia] = useState('');
  
  const handleTrack = async () => {
    // Buscar en /api/seguimientos-despacho/{numeroGuia}
  };
  
  return (
    <Container className="py-5">
      <h2>Rastrea tu Pedido</h2>
      <Form.Control 
        placeholder="Ingresa tu número de guía" 
        value={numeroGuia}
        onChange={(e) => setNumeroGuia(e.target.value)}
      />
      <Button onClick={handleTrack}>Buscar</Button>
    </Container>
  );
};
```

---

### **✅ RUTAS DE CLIENTE AUTENTICADO - FUNCIONAN**

| Ruta | Archivo | Backend | Estado |
|------|---------|---------|--------|
| `/mis-pedidos` | MyOrdersPage.jsx | ✅ | ✅ Funciona |
| `/cliente/perfil` | ClientProfilePage.jsx | ✅ | ✅ Funciona |

---

### **⚠️ RUTAS DE PERFIL - SIN IMPLEMENTAR**

```jsx
// ProfileRouter.jsx
<Route path="/profile/" element={<DashboardCliente />} />
<Route path="/profile/orders" element={<OrdersPage />} />
<Route path="/profile/addresses" element={<AddressesPage />} />
<Route path="/profile/claims" element={<ClaimsPage />} />
```

**Problema**:
- Son **stubs** (componentes vacíos)
- No tienen páginas reales creadas
- **MEJOR**: Usar `/cliente/perfil` que sí funciona

**Solución Inmediata**:
```jsx
// Eliminar ProfileRouter y usar rutas directas
<Route path="/perfil" element={<ClientProfilePage />} />
<Route path="/mis-pedidos" element={<MyOrdersPage />} />
<Route path="/mis-direcciones" element={<AddressBookPage />} /> {/* Ya existe */}
<Route path="/mis-resenas" element={<MyReviewsPage />} /> {/* Ya existe */}
```

---

## 🔧 RUTAS DEL PANEL ADMIN

### **✅ RUTAS SUPER ADMIN - FUNCIONAN**

| Ruta | Archivo | Roles | Backend | Estado |
|------|---------|-------|---------|--------|
| `/admin/dashboard` | DashboardAdminPage.jsx | Todos | ✅ | ✅ Funciona |
| `/admin/users` | UsersPage.jsx | ADMIN | ✅ | ✅ Funciona |
| `/admin/reports` | ReportsPage.jsx | Todos | ✅ | ✅ Funciona |

---

### **✅ GESTOR DE PRODUCTOS - FUNCIONAL**

| Ruta | Archivo | Roles | Backend | Estado |
|------|---------|-------|---------|--------|
| `/admin/products` | ProductsPage.jsx | ADMIN, GESTOR_PRODUCTOS | ✅ | ✅ Funciona |
| `/admin/categories` | CategoriesPage.jsx | ADMIN, GESTOR_PRODUCTOS | ✅ | ✅ Funciona |

**Verificación**: ✅ Control de permisos correcto en sidebar

---

### **✅ GESTOR COMERCIAL - FUNCIONAL**

| Ruta | Archivo | Roles | Backend | Estado |
|------|---------|-------|---------|--------|
| `/admin/orders` | CustomerOrdersPage.jsx | ADMIN, GESTOR_COMERCIAL | ✅ | ✅ Funciona |
| `/admin/promotions` | PromotionsPage.jsx | ADMIN, GESTOR_COMERCIAL | ✅ | ✅ Funciona |
| `/admin/customers` | CustomersPage.jsx | ADMIN, GESTOR_COMERCIAL | ✅ | ✅ Funciona |
| `/admin/reviews` | ReviewsPage.jsx | ADMIN, GESTOR_COMERCIAL | ✅ | ✅ Funciona |
| `/admin/claims` | ClaimsPage.jsx | ADMIN, GESTOR_COMERCIAL | ❌ | ⚠️ Página existe, backend NO |

**Verificación**: ✅ Control de permisos correcto en sidebar

---

### **✅ GESTOR LOGÍSTICA - FUNCIONAL**

| Ruta | Archivo | Roles | Backend | Estado |
|------|---------|-------|---------|--------|
| `/admin/inventory` | InventoryPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |
| `/admin/logistica/ordenes-reposicion` | RepositionOrdersPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |
| `/admin/logistica/alarmas` | AlertsPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |
| `/admin/logistica/pedidos` | PedidosLogisticaPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |
| `/admin/logistics` | LogisticsPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |
| `/admin/logistica/seguimiento` | TrackingPage.jsx | ADMIN, GESTOR_LOGISTICA | ✅ | ✅ Funciona |

**Verificación**: ✅ Control de permisos correcto en sidebar

---

## ⚠️ PROBLEMAS EN SIDEBAR DE ADMIN

### **Estructura Actual** (LayoutAdmin.jsx)

```jsx
{/* CATÁLOGO - ADMIN + GESTOR_PRODUCTOS */}
- /admin/products
- /admin/categories

{/* VENTAS - ADMIN + GESTOR_COMERCIAL */}
- /admin/orders
- /admin/promotions
- /admin/customers

{/* LOGÍSTICA - ADMIN + GESTOR_LOGISTICA */}
- /admin/inventory
- /admin/logistica/ordenes-reposicion
- /admin/logistica/alarmas
- /admin/logistica/pedidos
- /admin/logistics (Operadores)
- /admin/logistica/seguimiento

{/* ADMINISTRACIÓN - Solo ADMIN */}
- /admin/users

{/* RESEÑAS Y RECLAMOS - ADMIN + GESTOR_COMERCIAL */}
- /admin/reviews
- /admin/claims

{/* REPORTES - Todos */}
- /admin/reports
```

**Problemas Detectados**:

1. **Reseñas y Reclamos fuera de sección VENTAS**
   - Deberían estar dentro del bloque condicional de GESTOR_COMERCIAL
   - Actualmente están en el nivel raíz

2. **Reportes sin sección**
   - Debería tener su propia sección con ícono

---

## 🔄 CORRECCIONES NECESARIAS

### **1. Arreglar Header.jsx**

```jsx
// ANTES (línea 47)
<Nav.Link as={Link} to="/info/soporte" className="text-secondary me-3">
    <i className="bi bi-headset me-1"></i> Ayuda al Cliente
</Nav.Link>
<Nav.Link as={Link} to="/track" className="text-secondary">
    <i className="bi bi-geo-alt-fill me-1"></i> Rastrea tu Pedido
</Nav.Link>

// DESPUÉS
<Nav.Link as={Link} to="/ayuda" className="text-secondary me-3">
    <i className="bi bi-headset me-1"></i> Ayuda al Cliente
</Nav.Link>
<Nav.Link as={Link} to="/seguimiento" className="text-secondary">
    <i className="bi bi-geo-alt-fill me-1"></i> Rastrea tu Pedido
</Nav.Link>
```

---

### **2. Arreglar AppRouter.jsx**

```jsx
// Agregar rutas faltantes
<Route element={<LayoutCliente />}>
  {/* ... rutas existentes ... */}
  
  {/* NUEVAS RUTAS */}
  <Route path="/ayuda" element={<AyudaPage />} />
  <Route path="/seguimiento" element={<TrackOrderPage />} />
  
  {/* ELIMINAR ProfileRouter, usar rutas directas */}
  <Route path="/perfil" element={
    <ProtectedRoute requiredRole="CLIENTE">
      <ClientProfilePage />
    </ProtectedRoute>
  } />
</Route>
```

---

### **3. Reorganizar Sidebar Admin (LayoutAdmin.jsx)**

```jsx
{/* Reseñas y Reclamos dentro de VENTAS */}
{(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL') && (
  <>
    <div className="text-muted small mt-3 mb-1">VENTAS</div>
    <Nav.Link as={Link} to="/admin/orders" className="text-white">
      <i className="bi bi-cart-check me-2"></i>Pedidos Clientes
    </Nav.Link>
    <Nav.Link as={Link} to="/admin/promotions" className="text-white">
      <i className="bi bi-percent me-2"></i>Promociones
    </Nav.Link>
    <Nav.Link as={Link} to="/admin/customers" className="text-white">
      <i className="bi bi-people me-2"></i>Clientes
    </Nav.Link>
    <Nav.Link as={Link} to="/admin/reviews" className="text-white">
      <i className="bi bi-star me-2"></i>Reseñas
    </Nav.Link>
    <Nav.Link as={Link} to="/admin/claims" className="text-white">
      <i className="bi bi-file-earmark-text me-2"></i>Reclamaciones
    </Nav.Link>
  </>
)}

{/* Reportes con sección propia */}
<div className="text-muted small mt-3 mb-1">REPORTES</div>
{(userRole === 'ADMIN' || userRole === 'GESTOR_COMERCIAL' || userRole === 'GESTOR_LOGISTICA' || userRole === 'GESTOR_PRODUCTOS') && (
  <Nav.Link as={Link} to="/admin/reports" className="text-white">
    <i className="bi bi-graph-up me-2"></i>Reportes
  </Nav.Link>
)}
```

---

## 📝 PÁGINAS A CREAR

### **Alta Prioridad**:

1. **TrackOrderPage.jsx** (Rastreo de pedidos público)
```jsx
// src/pages/frontend/TrackOrderPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const TrackOrderPage = () => {
  const [numeroGuia, setNumeroGuia] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    if (!numeroGuia.trim()) {
      setError('Ingresa un número de guía');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8081/api/seguimientos-despacho/tracking/${numeroGuia}`);
      if (response.ok) {
        const data = await response.json();
        setResultado(data);
        setError('');
      } else {
        setError('No se encontró el pedido con ese número de guía');
        setResultado(null);
      }
    } catch (err) {
      setError('Error al buscar el pedido');
      setResultado(null);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Rastrea tu Pedido</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Número de Guía</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 1234567890"
              value={numeroGuia}
              onChange={(e) => setNumeroGuia(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleBuscar}>
            <i className="bi bi-search me-2"></i>Buscar
          </Button>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {resultado && (
        <Card>
          <Card.Header><strong>Estado del Pedido</strong></Card.Header>
          <Card.Body>
            <p><strong>Número de Guía:</strong> {resultado.numeroGuia}</p>
            <p><strong>Estado:</strong> {resultado.estadoEnvio}</p>
            <p><strong>Operador:</strong> {resultado.operador?.nombre}</p>
            {resultado.fechaEntrega && (
              <p><strong>Fecha de Entrega:</strong> {new Date(resultado.fechaEntrega).toLocaleDateString()}</p>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TrackOrderPage;
```

2. **AyudaPage.jsx** (Página de ayuda estática)
```jsx
// src/pages/frontend/AyudaPage.jsx
const AyudaPage = () => {
  return (
    <Container className="py-5">
      <h2>Centro de Ayuda</h2>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Cómo realizar un pedido?</Accordion.Header>
          <Accordion.Body>...</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Métodos de pago</Accordion.Header>
          <Accordion.Body>...</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};
```

---

## ✅ VERIFICACIÓN DE PERMISOS POR ROL

### **ADMIN (Super Admin)**
✅ Acceso total a:
- Dashboard
- Productos
- Categorías
- Pedidos
- Promociones
- Clientes
- Inventario
- Logística (todas)
- Usuarios Admin
- Reseñas
- Reclamos
- Reportes

### **GESTOR_PRODUCTOS**
✅ Acceso a:
- Dashboard
- Productos
- Categorías
- Reportes

❌ NO acceso a:
- Pedidos, Clientes, Promociones (Comercial)
- Inventario, Logística (Logística)
- Usuarios Admin

### **GESTOR_COMERCIAL**
✅ Acceso a:
- Dashboard
- Pedidos Clientes
- Promociones
- Clientes
- Reseñas
- Reclamos
- Reportes

❌ NO acceso a:
- Productos, Categorías (Productos)
- Inventario, Logística (Logística)
- Usuarios Admin

### **GESTOR_LOGISTICA**
✅ Acceso a:
- Dashboard
- Inventario
- Órdenes Reposición
- Alarmas Stock
- Pedidos Logística
- Operadores Logísticos
- Seguimiento
- Reportes

❌ NO acceso a:
- Productos, Categorías (Productos)
- Pedidos, Promociones, Clientes (Comercial)
- Usuarios Admin

---

## 📊 MATRIZ DE RUTAS

| Ruta | Público | Cliente | Admin | Gestor Prod | Gestor Comercial | Gestor Logística |
|------|---------|---------|-------|-------------|------------------|------------------|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/catalogo` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/producto/:id` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/cart` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/checkout` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/mis-pedidos` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/admin/products` | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `/admin/orders` | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `/admin/inventory` | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `/admin/users` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## 🎯 RECOMENDACIONES FINALES

### **Prioridad Alta** (Hacer ahora):
1. ✅ Crear `TrackOrderPage.jsx`
2. ✅ Crear `AyudaPage.jsx`
3. ✅ Corregir Header.jsx (cambiar rutas `/info` y `/track`)
4. ✅ Reorganizar sidebar admin (mover reseñas/reclamos a VENTAS)

### **Prioridad Media**:
1. ⏳ Implementar backend de Reclamaciones (`ClaimsController.java`)
2. ⏳ Eliminar ProfileRouter y usar rutas directas
3. ⏳ Agregar páginas 404 personalizadas por sección

### **Prioridad Baja**:
1. 📝 Implementar `Contenido_Informativo` para páginas dinámicas
2. 📝 Crear página de Términos y Condiciones
3. 📝 Crear página de Privacidad

---

**Conclusión**: El sistema de rutas está **90% funcional**, solo requiere pequeñas correcciones y la creación de 2 páginas faltantes.
