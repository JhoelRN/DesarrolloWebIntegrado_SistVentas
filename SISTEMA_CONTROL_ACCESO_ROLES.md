# 🔐 SISTEMA DE CONTROL DE ACCESO POR ROLES

## 📊 MATRIZ DE PERMISOS POR ROL

### **ROL: Admin (Superadmin)**
✅ **ACCESO TOTAL** a todas las áreas del sistema

### **ROL: Gestor Comercial**
Gestión de ventas, productos y atención al cliente

| Área | Acceso | Rutas |
|------|--------|-------|
| **Dashboard** | ✅ Sí | `/admin/dashboard` |
| **Productos** | ✅ Sí | `/admin/products` |
| **Categorías** | ✅ Sí | `/admin/categories` |
| **Pedidos** | ✅ Sí | `/admin/orders` |
| **Promociones** | ✅ Sí | `/admin/promotions` |
| **Clientes** | ✅ Sí | `/admin/customers` |
| **Reseñas** | ✅ Sí | `/admin/reviews` |
| **Reclamos** | ✅ Sí | `/admin/claims` |
| **Reportes** | ✅ Sí | `/admin/reports` |
| **Inventario** | ❌ No | `/admin/inventory` |
| **Logística** | ❌ No | `/admin/logistica/*` |
| **Usuarios** | ❌ No | `/admin/users` |

### **ROL: Gestor Logística**
Gestión de inventario, despachos y seguimiento

| Área | Acceso | Rutas |
|------|--------|-------|
| **Dashboard** | ✅ Sí | `/admin/dashboard` |
| **Inventario** | ✅ Sí | `/admin/inventory` |
| **Logística** | ✅ Sí | `/admin/logistics` |
| **Pedidos Logística** | ✅ Sí | `/admin/logistica/pedidos` |
| **Órdenes Reposición** | ✅ Sí | `/admin/logistica/ordenes-reposicion` |
| **Alarmas** | ✅ Sí | `/admin/logistica/alarmas` |
| **Seguimiento** | ✅ Sí | `/admin/logistica/seguimiento` |
| **Reportes** | ✅ Sí | `/admin/reports` |
| **Productos** | ❌ No | `/admin/products` |
| **Pedidos Comercial** | ❌ No | `/admin/orders` |
| **Clientes** | ❌ No | `/admin/customers` |
| **Usuarios** | ❌ No | `/admin/users` |

---

## 🚨 COMPORTAMIENTO DEL SISTEMA

### **Escenario 1: Usuario con rol correcto**
```
Usuario: juan@macrosur.cl
Rol: Gestor Comercial
URL: /admin/orders

RESULTADO: ✅ Acceso permitido
```

### **Escenario 2: Usuario sin permisos**
```
Usuario: pedro@macrosur.cl
Rol: Gestor Logística
URL: /admin/orders

RESULTADO: ❌ Acceso denegado
PANTALLA:
┌─────────────────────────────────────────┐
│ 🛡️ Acceso Denegado                     │
├─────────────────────────────────────────┤
│ No tienes permisos para acceder        │
│ a esta sección.                         │
│                                         │
│ Tu rol actual: Gestor Logística        │
│ Roles permitidos: Admin, Gestor Com... │
│                                         │
│ [← Volver]  [🏠 Ir al Dashboard]       │
└─────────────────────────────────────────┘
```

### **Escenario 3: Admin (Superadmin)**
```
Usuario: admin@macrosur.cl
Rol: Admin
URL: Cualquier ruta

RESULTADO: ✅ Acceso permitido a TODO
```

---

## 🔄 FLUJO DE VALIDACIÓN

```
1. Usuario intenta acceder a ruta protegida
         ↓
2. ProtectedRoute intercepta la petición
         ↓
3. Verifica autenticación (isAuthenticated)
   ❌ No → Redirige a /admin/login
   ✅ Sí → Continúa
         ↓
4. Verifica rol (userRole in allowedRoles)
   ❌ No → Muestra "Acceso Denegado"
   ✅ Sí → Renderiza componente
```

---

## 🎯 CASOS DE USO

### **Caso 1: Gestor Comercial intenta acceder a Logística**
```
URL: /admin/logistica/pedidos
Rol: Gestor Comercial

1. Click en menú "Logística"
2. Sistema verifica: "Gestor Comercial" NOT IN ["Admin", "Gestor Logística"]
3. Muestra pantalla de acceso denegado
4. Usuario ve mensaje claro de por qué no tiene acceso
5. Botones para volver o ir al dashboard
```

### **Caso 2: Gestor Logística intenta gestionar productos**
```
URL: /admin/products
Rol: Gestor Logística

1. Intenta acceder directamente (URL o link)
2. Sistema verifica: "Gestor Logística" NOT IN ["Admin", "Gestor Comercial"]
3. Acceso denegado
4. No puede ver ni modificar productos
```

### **Caso 3: Admin puede ir a cualquier lugar**
```
URL: Cualquier ruta
Rol: Admin

1. Click en cualquier menú
2. Sistema verifica: "Admin" IN allowedRoles
3. ✅ Siempre permitido
4. Acceso total sin restricciones
```

---

## 🛠️ IMPLEMENTACIÓN TÉCNICA

### **Componente ProtectedRoute**
```jsx
<ProtectedRoute allowedRoles={['Admin', 'Gestor Comercial']}>
  <CustomerOrdersPage />
</ProtectedRoute>
```

**Props:**
- `allowedRoles`: Array de roles permitidos
- `requiredPermissions`: Array de permisos específicos (opcional)
- `children`: Componente a proteger

**Lógica:**
1. Obtiene `userRole` y `userPermissions` de AuthContext
2. Verifica si rol está en `allowedRoles`
3. Verifica si tiene todos los `requiredPermissions`
4. Si cumple ambos → Renderiza children
5. Si falla → Muestra pantalla de acceso denegado

---

## 🔐 SEGURIDAD ADICIONAL

### **Frontend (Actual)**
✅ Control de acceso a rutas
✅ Validación de roles antes de renderizar
✅ Mensajes claros de error
✅ Botones de navegación seguros

### **Backend (Recomendado - A implementar)**
```java
@PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_COMERCIAL')")
@GetMapping("/api/pedidos")
public ResponseEntity<List<Pedido>> obtenerPedidos() {
    // ...
}
```

**⚠️ IMPORTANTE:** 
El control en frontend es para UX. El backend DEBE validar también los permisos en cada endpoint para seguridad real.

---

## 📝 NOTAS DE DESARROLLO

### **Agregar nuevo rol:**
1. Agregar rol en base de datos (tabla `roles`)
2. Actualizar `allowedRoles` en las rutas correspondientes
3. Probar acceso y restricciones

### **Agregar nueva ruta protegida:**
```jsx
<Route 
  path="/nueva-ruta" 
  element={
    <ProtectedRoute allowedRoles={['Admin', 'NuevoRol']}>
      <NuevaPagina />
    </ProtectedRoute>
  } 
/>
```

### **Usar permisos específicos:**
```jsx
<ProtectedRoute 
  allowedRoles={['Admin', 'Gestor Comercial']}
  requiredPermissions={['EDITAR_PEDIDOS', 'VER_CLIENTES']}
>
  <CustomerOrdersPage />
</ProtectedRoute>
```

---

## ✅ ESTADO ACTUAL

- ✅ Sistema de roles implementado
- ✅ Protección de rutas activa
- ✅ Mensajes de error claros
- ✅ Separación por áreas funcionales
- ⏳ Pendiente: Validación en backend (Spring Security)
- ⏳ Pendiente: Tests de roles

---

## 🎯 RESUMEN

| Característica | Estado |
|---------------|--------|
| Control de acceso por roles | ✅ Implementado |
| Validación en frontend | ✅ Activo |
| Mensajes de error | ✅ Claros |
| Admin tiene acceso total | ✅ Sí |
| Gestores solo su área | ✅ Sí |
| Validación en backend | ⏳ Pendiente |

**El sistema está listo para pruebas. Los gestores YA NO pueden saltar entre áreas.**
