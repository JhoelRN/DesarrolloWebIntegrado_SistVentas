# 📚 ARQUITECTURA Y GUÍA DE DESARROLLO - MACROSUR E-COMMERCE

## 📋 ÍNDICE
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Sistema de Autenticación](#sistema-de-autenticación)
3. [Sistema de Navegación](#sistema-de-navegación)
4. [Sistema de Permisos](#sistema-de-permisos)
5. [Backend - Spring Boot](#backend---spring-boot)
6. [Frontend - React + Vite](#frontend---react--vite)
7. [Base de Datos - MySQL + Flyway](#base-de-datos---mysql--flyway)
8. [Guía para Nuevos Módulos](#guía-para-nuevos-módulos)
9. [Patrones y Estándares](#patrones-y-estándares)

---

## 📂 ESTRUCTURA DEL PROYECTO

```
DesarrolloWebIntegrado_SistVentas/
│
├── macrosur-ecommerce-backend/          # Spring Boot 3.5.6
│   ├── src/main/
│   │   ├── java/com/macrosur/ecommerce/
│   │   │   ├── config/                   # Configuraciones (CORS, Security)
│   │   │   ├── controller/               # REST Controllers
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── entity/                   # JPA Entities
│   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   ├── security/                 # JWT, Filters, SecurityConfig
│   │   │   ├── service/                  # Lógica de negocio
│   │   │   └── util/                     # Utilidades
│   │   └── resources/
│   │       ├── application.properties    # Configuración principal
│   │       └── db/migration/             # Migraciones Flyway (V1__, V2__, etc)
│   └── pom.xml                           # Dependencias Maven
│
├── macrosur-ecommerce-frontend/         # React 18 + Vite
│   ├── src/
│   │   ├── api/                          # Funciones para llamadas HTTP
│   │   │   ├── admin.js                  # API admin (users, roles, etc)
│   │   │   ├── auth.js                   # API autenticación
│   │   │   ├── products.js               # API productos
│   │   │   └── orders.js                 # API pedidos
│   │   ├── components/                   # Componentes reutilizables
│   │   │   ├── common/                   # Header, Footer, PermissionGuard
│   │   │   ├── layout/                   # LayoutAdmin, LayoutCliente
│   │   │   ├── forms/                    # Formularios compartidos
│   │   │   ├── product/                  # Componentes de producto
│   │   │   ├── profile/                  # Componentes de perfil
│   │   │   └── ui/                       # Componentes UI genéricos
│   │   ├── contexts/                     # Context API de React
│   │   │   ├── AuthContext.jsx           # Manejo de sesión (CRÍTICO)
│   │   │   └── CartContext.jsx           # Manejo de carrito
│   │   ├── hooks/                        # Custom Hooks
│   │   │   └── usePermissions.js         # Hook de permisos granulares
│   │   ├── pages/                        # Páginas completas
│   │   │   ├── admin/                    # Páginas del panel admin
│   │   │   ├── auth/                     # Login, Register
│   │   │   └── frontend/                 # Páginas públicas/cliente
│   │   ├── router/                       # Configuración de rutas
│   │   │   ├── AppRouter.jsx             # Router principal + ProtectedRoute
│   │   │   ├── AdminRouter.jsx           # Sub-router /admin/*
│   │   │   └── ProfileRouter.jsx         # Sub-router /profile/*
│   │   ├── App.jsx                       # Componente raíz con Providers
│   │   └── main.jsx                      # Entry point
│   └── package.json                      # Dependencias npm
│
└── macrosur_ecommerce_DB/               # Scripts de base de datos
    ├── V1__baseline.sql                  # Schema completo (30 tablas + 2 vistas)
    ├── insert_admin_FROM_BACKUP.sql      # Seed data (roles, permisos, usuarios)
    └── extract_schema_simple.ps1         # Script extracción desde Workbench

```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### **Arquitectura actual:**

#### **Backend (Spring Security + JWT)**
- **Archivo clave:** `AuthController.java`
- **Endpoints:**
  - `POST /api/auth/login` - Login (devuelve JWT)
  - `GET /api/auth/me` - Obtener usuario actual
  - `POST /api/auth/validate` - Validar token

#### **Frontend (AuthContext.jsx)**
- **Storage dinámico:**
  - ✅ **localStorage**: Si marca "Recordarme" (24 horas)
  - ✅ **sessionStorage**: Si NO marca (2 horas, se borra al cerrar navegador)

#### **Flujo de autenticación:**

```javascript
// 1. Usuario hace login
login(email, password, isAdmin, rememberMe)
  ↓
// 2. Backend valida y devuelve JWT
{ token: "eyJhbGc...", usuario_admin_id: 1, nombre: "Admin", ... }
  ↓
// 3. Frontend guarda según rememberMe
if (rememberMe) {
  localStorage.setItem('authToken', token)  // Persiste
} else {
  sessionStorage.setItem('authToken', token) // Temporal
}
  ↓
// 4. AuthContext carga datos del usuario
getCurrentUser(token) → setUser(), setUserRole(), setUserPermissions()
  ↓
// 5. Configura timers
setupAutoLogout(rememberMe)      // Expira en 2h o 24h
setupInactivityDetection()       // 30 min sin actividad
```

#### **Características implementadas:**

| Feature | Implementación |
|---------|----------------|
| **Recordarme** | Checkbox en login → localStorage (24h) vs sessionStorage (2h) |
| **Inactividad** | Listeners de mouse/teclado → logout automático a 30 min |
| **Expiración** | Timer automático → Alert antes de logout |
| **Multi-storage** | Verifica localStorage Y sessionStorage al cargar app |
| **Limpieza total** | `clearAuthData()` elimina tokens, timers, listeners |
| **Persistencia** | F5 mantiene sesión si token válido |

---

## 🧭 SISTEMA DE NAVEGACIÓN

### **Estructura de rutas:**

```
AppRouter.jsx (Router principal)
│
├── / (Home) ────────────────────────── Público
├── /catalogo ───────────────────────── Público
├── /producto/:sku ──────────────────── Público
├── /cart ───────────────────────────── Público
├── /login ──────────────────────────── Público (cliente)
├── /register ───────────────────────── Público (cliente)
├── /admin/login ────────────────────── Público (admin)
│
├── /profile/* ──────────────────────── ProtectedRoute (CLIENTE)
│   └── ProfileRouter.jsx
│       ├── /profile/dashboard
│       ├── /profile/orders
│       └── /profile/settings
│
└── /admin/* ────────────────────────── ProtectedRoute (ADMIN/GESTOR)
    └── AdminRouter.jsx
        ├── /admin/dashboard
        ├── /admin/products
        ├── /admin/categories
        ├── /admin/orders
        ├── /admin/customers
        ├── /admin/inventory
        ├── /admin/logistics
        ├── /admin/promotions
        ├── /admin/users ──────────── Solo ADMIN
        ├── /admin/reviews
        ├── /admin/claims
        └── /admin/reports
```

### **ProtectedRoute Component:**

```jsx
// Ubicación: src/router/AppRouter.jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  // Sin autenticación → Redirige a login correspondiente
  if (!isAuthenticated) {
    if (requiredRole === 'ADMIN') return <Navigate to="/admin/login" />;
    return <Navigate to="/login" />;
  }
  
  // Con autenticación pero rol incorrecto → Home
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(userRole)) {
      return <Navigate to="/" />;
    }
  }
  
  return children;
};
```

### **Layouts:**

| Layout | Usado en | Características |
|--------|----------|-----------------|
| **LayoutCliente** | Rutas públicas y /profile/* | Header + Footer + Outlet |
| **LayoutAdmin** | Rutas /admin/* | Sidebar + Header admin + Outlet |

---

## 🛡️ SISTEMA DE PERMISOS

### **Roles en base de datos:**

```sql
-- Tabla: Roles
1 | ADMIN                    -- Acceso total
2 | GESTOR_LOGISTICA        -- Inventario, Stock, Operadores
3 | GESTOR_PRODUCTOS        -- Productos, Categorías
4 | GESTOR_COMERCIAL        -- Pedidos, Clientes, Promociones
```

### **Permisos granulares (29 en total):**

```sql
-- Tabla: Permisos
VER_DASHBOARD_ADMIN
GESTIONAR_USUARIOS

-- Catálogo
VER_PRODUCTOS, CREAR_PRODUCTOS, EDITAR_PRODUCTOS, ELIMINAR_PRODUCTOS
VER_CATEGORIAS, CREAR_CATEGORIAS, EDITAR_CATEGORIAS

-- Inventario y Logística
VER_INVENTARIO, GESTIONAR_STOCK, AUTORIZAR_REPOSICION
VER_LOGISTICA, GESTIONAR_OPERADORES

-- Ventas
VER_PEDIDOS, GESTIONAR_PEDIDOS
VER_CLIENTES
VER_PROMOCIONES, CREAR_PROMOCIONES

-- Administración
VER_RESENAS, GESTIONAR_RESENAS
VER_RECLAMOS, GESTIONAR_RECLAMOS

-- Reportes
REPORTE_PRODUCTOS, REPORTE_INVENTARIO, REPORTE_VENTAS, REPORTE_USUARIOS
```

### **Hook usePermissions.js:**

```javascript
// Uso en componentes
const { canAccessPage, canPerformAction, isAdmin } = usePermissions();

// Ejemplos
if (canAccessPage('products')) { /* mostrar link */ }
if (canPerformAction('create_product')) { /* mostrar botón */ }
if (isAdmin) { /* mostrar opciones admin */ }
```

### **PermissionGuard Component:**

```jsx
// Oculta elementos según permisos
<PermissionGuard requiredPermission="VER_PRODUCTOS">
  <Nav.Link to="/admin/products">Productos</Nav.Link>
</PermissionGuard>

// Múltiples permisos (OR)
<PermissionGuard requiredPermissions={['VER_PRODUCTOS', 'CREAR_PRODUCTOS']}>
  {/* Contenido */}
</PermissionGuard>

// Por rol
<PermissionGuard requiredRole="ADMIN">
  <Button>Solo Admin</Button>
</PermissionGuard>
```

---

## ⚙️ BACKEND - SPRING BOOT

### **Estructura por capas:**

```
Controller → Service → Repository → Entity
    ↓          ↓          ↓           ↓
  REST     Lógica    Spring Data   JPA/DB
```

### **Ejemplo completo: Módulo de Usuarios Admin**

#### **1. Entity (usuarios_admin tabla)**
```java
// src/main/java/com/macrosur/ecommerce/entity/UsuarioAdmin.java
@Entity
@Table(name = "usuarios_admin")
public class UsuarioAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_admin_id")
    private Long usuario_admin_id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id")
    private Role role;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "apellido", nullable = false)
    private String apellido;
    
    @Column(name = "correo_corporativo", nullable = false, unique = true)
    private String correo_corporativo;
    
    @Column(name = "contrasena_hash", nullable = false)
    private String contrasena_hash;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    // Getters y Setters...
}
```

#### **2. Repository**
```java
// src/main/java/com/macrosur/ecommerce/repository/UsuarioAdminRepository.java
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    
    Optional<UsuarioAdmin> findByCorreo_corporativo(String correo);
    
    @Query("SELECT u FROM UsuarioAdmin u LEFT JOIN FETCH u.role r " +
           "LEFT JOIN FETCH r.permissions WHERE u.correo_corporativo = :correo")
    Optional<UsuarioAdmin> findByCorreoWithRoleAndPermissions(@Param("correo") String correo);
    
    boolean existsByCorreo_corporativo(String correo);
}
```

#### **3. DTOs**
```java
// src/main/java/com/macrosur/ecommerce/dto/UsuarioAdminDto.java
public class UsuarioAdminDto {
    public Long usuario_admin_id;
    public String nombre;
    public String apellido;
    public String correo_corporativo;
    public Boolean activo;
    public Long rol_id;
    public RoleDto role;
    public Set<PermissionDto> permissions;
}

// CreateUserRequest.java
public class CreateUserRequest {
    public String nombre;
    public String apellido;
    public String correo_corporativo;
    public String contrasena;
    public Long rol_id;
}

// UpdateUserRequest.java
public class UpdateUserRequest {
    public String nombre;
    public String apellido;
    public String correo_corporativo;
    public String contrasena; // Opcional
    public Long rol_id;
}
```

#### **4. Service**
```java
// src/main/java/com/macrosur/ecommerce/service/AdminUserService.java
@Service
public class AdminUserService {
    
    private final UsuarioAdminRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    
    public List<UsuarioAdminDto> getAdminUsers() {
        return userRepo.findAll().stream()
            .map(this::toDtoMinimal)
            .collect(Collectors.toList());
    }
    
    public UsuarioAdminDto createAdminUser(CreateUserRequest req) {
        // Validaciones
        validateMacroCorreo(req.correo_corporativo);
        if (userRepo.existsByCorreo_corporativo(req.correo_corporativo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Correo ya existe");
        }
        
        // Crear usuario
        UsuarioAdmin u = new UsuarioAdmin();
        u.setNombre(req.nombre);
        u.setApellido(req.apellido);
        u.setCorreo_corporativo(req.correo_corporativo);
        u.setContrasena_hash(passwordEncoder.encode(req.contrasena));
        u.setRole(roleRepo.findById(req.rol_id).orElseThrow());
        u.setActivo(true);
        
        return toDtoMinimal(userRepo.save(u));
    }
    
    public UsuarioAdminDto activateUser(Long id) { /* ... */ }
    public UsuarioAdminDto deactivateUser(Long id) { /* ... */ }
    public void deleteAdminUser(Long id) { /* ... */ }
    
    private UsuarioAdminDto toDtoMinimal(UsuarioAdmin u) { /* Mapping */ }
}
```

#### **5. Controller**
```java
// src/main/java/com/macrosur/ecommerce/controller/AdminController.java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final AdminUserService userService;
    
    @GetMapping("/users")
    public List<UsuarioAdminDto> getAdminUsers() {
        return userService.getAdminUsers();
    }
    
    @PostMapping("/users")
    public ResponseEntity<UsuarioAdminDto> createAdminUser(@RequestBody CreateUserRequest req) {
        UsuarioAdminDto dto = userService.createAdminUser(req);
        return ResponseEntity.status(201).body(dto);
    }
    
    @PutMapping("/users/{id}")
    public UsuarioAdminDto updateAdminUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return userService.updateAdminUser(id, req);
    }
    
    @PutMapping("/users/{id}/activate")
    public UsuarioAdminDto activateUser(@PathVariable Long id) {
        return userService.activateUser(id);
    }
    
    @PutMapping("/users/{id}/deactivate")
    public UsuarioAdminDto deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteAdminUser(@PathVariable Long id) {
        userService.deleteAdminUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

### **Convenciones de nombrado Backend:**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Clase Entity** | PascalCase singular | `UsuarioAdmin`, `Producto` |
| **Tabla DB** | snake_case plural | `usuarios_admin`, `productos` |
| **Campo Entity** | snake_case | `usuario_admin_id`, `correo_corporativo` |
| **DTO** | PascalCase + Dto sufijo | `UsuarioAdminDto`, `CreateUserRequest` |
| **Repository** | Entity + Repository | `UsuarioAdminRepository` |
| **Service** | Entity + Service | `AdminUserService`, `ProductService` |
| **Controller** | Descriptivo + Controller | `AdminController`, `AuthController` |
| **Endpoint** | kebab-case | `/api/admin/users`, `/api/products` |

---

## ⚛️ FRONTEND - REACT + VITE

### **Ejemplo completo: Página de Usuarios Admin**

#### **1. API Layer (admin.js)**
```javascript
// src/api/admin.js
const API_BASE = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAdminUsers = async () => {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};

export const createAdminUser = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const activateUser = async (userId) => {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/activate`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

#### **2. Page Component (UsersPage.jsx)**
```jsx
// src/pages/admin/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import * as adminApi from '../../api/admin';
import PermissionGuard from '../../components/common/PermissionGuard';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_corporativo: '',
    contrasena: '',
    rol_id: 3
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const data = await adminApi.getAdminUsers();
    setUsers(data);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminApi.createAdminUser(formData);
    setShowModal(false);
    await loadData();
  };
  
  return (
    <Container fluid>
      <h1>Gestión de Usuarios</h1>
      
      <PermissionGuard requiredPermission="GESTIONAR_USUARIOS">
        <Button onClick={() => setShowModal(true)}>Nuevo Usuario</Button>
      </PermissionGuard>
      
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.usuario_admin_id}>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.correo_corporativo}</td>
              <td>{user.role?.nombre_rol}</td>
              <td>{user.activo ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Button size="sm" variant="outline-primary">Editar</Button>
                <Button size="sm" variant="outline-warning">Desactivar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>
            {/* Más campos... */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Crear</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UsersPage;
```

### **Convenciones Frontend:**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Componente** | PascalCase | `UsersPage.jsx`, `Header.jsx` |
| **Hook** | camelCase con use- | `usePermissions.js`, `useAuth.js` |
| **Context** | PascalCase + Context | `AuthContext.jsx` |
| **API file** | camelCase | `admin.js`, `products.js` |
| **Variable estado** | camelCase | `users`, `formData`, `showModal` |
| **Función handler** | handleVerboNombre | `handleSubmit`, `handleEdit`, `handleDelete` |

---

## 🗄️ BASE DE DATOS - MYSQL + FLYWAY

### **Sistema de migraciones:**

```
db/migration/
├── V1__baseline.sql              # Schema completo (30 tablas + 2 vistas)
├── V2__add_destacado_column.sql  # Agregar columna destacado a Productos
└── V3__new_migration.sql         # Próximas migraciones
```

### **Convenciones Flyway:**

- ✅ Nombre: `V{version}__{descripcion}.sql`
- ✅ Version: Número incremental (1, 2, 3...)
- ✅ Descripción: snake_case o palabras separadas por guiones bajos
- ❌ NO editar migraciones ya aplicadas
- ✅ Crear nueva migración para cualquier cambio

### **Tablas principales:**

```sql
-- MÓDULO DE SEGURIDAD
Roles (rol_id, nombre_rol)
Permisos (permiso_id, nombre_permiso)
Rol_Permiso (rol_id, permiso_id)
Usuarios_Admin (usuario_admin_id, rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)

-- MÓDULO DE CATÁLOGO
Productos (producto_id, categoria_id, sku, nombre, descripcion, precio_base, destacado, activo)
Categorias (categoria_id, nombre_categoria, categoria_padre_id, activo)
Atributos_Producto (atributo_id, nombre_atributo)
Valores_Atributo (valor_id, atributo_id, nombre_valor)
Producto_Atributo (producto_id, valor_id)
Imagenes_Producto (imagen_id, producto_id, url_imagen, es_principal, orden)

-- MÓDULO DE INVENTARIO
Almacenes (almacen_id, nombre_almacen, tipo_almacen, direccion)
Stock (stock_id, producto_id, almacen_id, cantidad_disponible, stock_minimo)
Movimientos_Stock (movimiento_id, producto_id, almacen_id, tipo_movimiento, cantidad, fecha)
Stock_Consignado (stock_consignado_id, producto_id, cliente_id, cantidad, estado)
Operadores_Logisticos (operador_id, nombre_operador, contacto)

-- MÓDULO DE VENTAS
Clientes (cliente_id, nombre, apellido, correo, contrasena_hash, telefono, activo)
Pedidos (pedido_id, cliente_id, operador_id, fecha, estado, total)
Detalle_Pedido (detalle_id, pedido_id, producto_id, cantidad, precio_unitario, subtotal)
Seguimiento_Pedido (seguimiento_id, pedido_id, estado, fecha, ubicacion)
Promociones (promocion_id, tipo_promocion, descripcion, fecha_inicio, fecha_fin, activo)
Promocion_Producto (promocion_id, producto_id, descuento)

-- MÓDULO DE CONTENIDO
Contenido_Informativo (contenido_id, titulo, contenido, slug, activo)
Resenas_Producto (resena_id, producto_id, cliente_id, calificacion, comentario, fecha)
Reclamaciones (reclamo_id, cliente_id, pedido_id, tipo, descripcion, estado)
```

### **Seed data importante:**

```sql
-- 4 Roles
1 | ADMIN
2 | GESTOR_LOGISTICA
3 | GESTOR_PRODUCTOS
4 | GESTOR_COMERCIAL

-- 29 Permisos
VER_DASHBOARD_ADMIN, GESTIONAR_USUARIOS, VER_PRODUCTOS, CREAR_PRODUCTOS...

-- 4 Usuarios test (contraseña: "admin123")
admin@macrosur.com       | ADMIN
logistica@macrosur.com   | GESTOR_LOGISTICA
productos@macrosur.com   | GESTOR_PRODUCTOS
comercial@macrosur.com   | GESTOR_COMERCIAL
```

---

## 🚀 GUÍA PARA NUEVOS MÓDULOS

### **CHECKLIST COMPLETO PARA CREAR UN MÓDULO**

#### **📊 FASE 1: PLANIFICACIÓN**

- [ ] Definir entidades de base de datos
- [ ] Diseñar relaciones (FK, cardinalidad)
- [ ] Identificar permisos necesarios
- [ ] Definir operaciones CRUD
- [ ] Diseñar DTOs y validaciones

#### **🗄️ FASE 2: BASE DE DATOS**

1. **Crear migración Flyway:**
```sql
-- db/migration/V{X}__create_{module}_tables.sql
DROP TABLE IF EXISTS `nueva_tabla`;
CREATE TABLE `nueva_tabla` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `activo` TINYINT(1) DEFAULT '1',
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

2. **Agregar permisos si es necesario:**
```sql
-- V{X+1}__add_{module}_permissions.sql
INSERT INTO Permisos (nombre_permiso) VALUES
  ('VER_MODULO'),
  ('CREAR_MODULO'),
  ('EDITAR_MODULO'),
  ('ELIMINAR_MODULO');

-- Asignar a roles
INSERT INTO Rol_Permiso (rol_id, permiso_id) VALUES
  (1, LAST_INSERT_ID()),     -- ADMIN
  (3, LAST_INSERT_ID() + 1); -- GESTOR_PRODUCTOS puede ver
```

3. **Reiniciar backend para aplicar migración**

#### **⚙️ FASE 3: BACKEND**

1. **Crear Entity:**
```java
// entity/NuevaEntidad.java
@Entity
@Table(name = "nueva_tabla")
public class NuevaEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    // Getters y Setters
}
```

2. **Crear Repository:**
```java
// repository/NuevaEntidadRepository.java
public interface NuevaEntidadRepository extends JpaRepository<NuevaEntidad, Long> {
    List<NuevaEntidad> findByActivoTrue();
    Optional<NuevaEntidad> findByNombre(String nombre);
}
```

3. **Crear DTOs:**
```java
// dto/NuevaEntidadDto.java
public class NuevaEntidadDto {
    public Long id;
    public String nombre;
    public Boolean activo;
}

// dto/CreateNuevaEntidadRequest.java
public class CreateNuevaEntidadRequest {
    public String nombre;
}
```

4. **Crear Service:**
```java
// service/NuevaEntidadService.java
@Service
public class NuevaEntidadService {
    
    private final NuevaEntidadRepository repository;
    
    public List<NuevaEntidadDto> getAll() {
        return repository.findByActivoTrue().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    public NuevaEntidadDto create(CreateNuevaEntidadRequest req) {
        NuevaEntidad entity = new NuevaEntidad();
        entity.setNombre(req.nombre);
        entity.setActivo(true);
        return toDto(repository.save(entity));
    }
    
    private NuevaEntidadDto toDto(NuevaEntidad e) {
        NuevaEntidadDto dto = new NuevaEntidadDto();
        dto.id = e.getId();
        dto.nombre = e.getNombre();
        dto.activo = e.getActivo();
        return dto;
    }
}
```

5. **Crear Controller:**
```java
// controller/NuevaEntidadController.java
@RestController
@RequestMapping("/api/admin/nueva-entidad")
@PreAuthorize("hasAuthority('ROLE_VER_MODULO')")
public class NuevaEntidadController {
    
    private final NuevaEntidadService service;
    
    @GetMapping
    public List<NuevaEntidadDto> getAll() {
        return service.getAll();
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CREAR_MODULO')")
    public ResponseEntity<NuevaEntidadDto> create(@RequestBody CreateNuevaEntidadRequest req) {
        return ResponseEntity.status(201).body(service.create(req));
    }
}
```

6. **Probar endpoints:**
```bash
# GET
curl -H "Authorization: Bearer {token}" http://localhost:8081/api/admin/nueva-entidad

# POST
curl -X POST -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Test"}' \
     http://localhost:8081/api/admin/nueva-entidad
```

#### **⚛️ FASE 4: FRONTEND**

1. **Crear archivo API:**
```javascript
// src/api/nuevaEntidad.js
const API_BASE = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAllNuevaEntidad = async () => {
  const res = await fetch(`${API_BASE}/admin/nueva-entidad`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};

export const createNuevaEntidad = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/nueva-entidad`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
```

2. **Crear página:**
```jsx
// src/pages/admin/NuevaEntidadPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import * as api from '../../api/nuevaEntidad';
import PermissionGuard from '../../components/common/PermissionGuard';

const NuevaEntidadPage = () => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const data = await api.getAllNuevaEntidad();
    setItems(data);
  };
  
  return (
    <Container fluid>
      <h1>Nueva Entidad</h1>
      
      <PermissionGuard requiredPermission="CREAR_MODULO">
        <Button variant="primary">Crear Nuevo</Button>
      </PermissionGuard>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.activo ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Button size="sm" variant="outline-primary">Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default NuevaEntidadPage;
```

3. **Agregar ruta en AdminRouter.jsx:**
```jsx
import NuevaEntidadPage from '../pages/admin/NuevaEntidadPage';

// Dentro de <Routes>
<Route path="/nueva-entidad" element={<NuevaEntidadPage />} />
```

4. **Agregar link en LayoutAdmin.jsx:**
```jsx
<PermissionGuard requiredPermission="VER_MODULO">
  <Nav.Link as={Link} to="/admin/nueva-entidad" className="text-white">
    <i className="bi bi-box me-2"></i>Nueva Entidad
  </Nav.Link>
</PermissionGuard>
```

5. **Actualizar usePermissions.js:**
```javascript
const PAGE_PERMISSIONS = {
  // ... existentes
  'nueva_entidad': ['VER_MODULO']
};

const ACTION_PERMISSIONS = {
  // ... existentes
  'create_nueva_entidad': ['CREAR_MODULO'],
  'edit_nueva_entidad': ['EDITAR_MODULO']
};
```

#### **✅ FASE 5: TESTING**

- [ ] Probar CRUD completo desde frontend
- [ ] Verificar permisos (usuario sin permiso debe ver botones ocultos)
- [ ] Validar navegación correcta
- [ ] Comprobar que datos se guardan en DB
- [ ] Revisar consola de errores

---

## 📋 PATRONES Y ESTÁNDARES

### **🔒 Seguridad:**

1. **Siempre validar permisos en backend:**
```java
@PreAuthorize("hasAuthority('ROLE_CREAR_PRODUCTOS')")
public ResponseEntity<ProductoDto> createProduct() { }
```

2. **No confiar solo en frontend:**
```jsx
// ❌ MAL: Solo ocultar botón
{isAdmin && <Button>Eliminar</Button>}

// ✅ BIEN: Ocultar + validar backend
<PermissionGuard requiredPermission="ELIMINAR_PRODUCTOS">
  <Button onClick={handleDelete}>Eliminar</Button>
</PermissionGuard>
// + Backend valida permiso en endpoint DELETE
```

3. **Token JWT en todas las peticiones:**
```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return { 'Authorization': `Bearer ${token}` };
};
```

### **📦 Manejo de estado:**

1. **localStorage vs sessionStorage:**
```javascript
// ✅ Usuario marca "Recordarme"
localStorage.setItem('authToken', token); // Persiste

// ✅ Usuario NO marca
sessionStorage.setItem('authToken', token); // Se borra al cerrar
```

2. **Context para estado global:**
```jsx
// AuthContext → Sesión, usuario, permisos
// CartContext → Carrito de compras
// Crear contextos específicos por módulo si es necesario
```

### **🔄 Manejo de errores:**

1. **Backend:**
```java
if (!found) {
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No encontrado");
}
```

2. **Frontend:**
```javascript
try {
  const data = await api.getData();
  setData(data);
} catch (error) {
  setError('Error cargando datos: ' + error.message);
  console.error(error);
}
```

### **📱 Responsive Design:**

- Usar clases Bootstrap: `d-none d-lg-block`, `col-md-6`, etc.
- Mobile first: diseñar para móvil, expandir a desktop
- Probar en pantallas: 320px (móvil), 768px (tablet), 1920px (desktop)

### **♿ Accesibilidad:**

- Labels en todos los inputs
- Títulos descriptivos en botones: `title="Editar usuario"`
- Contraste de colores adecuado
- Navegación por teclado funcional

---

## 📚 RECURSOS Y COMANDOS ÚTILES

### **Backend - Spring Boot:**

```bash
# Compilar y ejecutar
mvn clean install
mvn spring-boot:run

# Ver logs de Flyway
# Buscar en consola: "Successfully applied X migration"

# Forzar re-migración (CUIDADO: solo desarrollo)
# DROP DATABASE macrosur_ecommerce;
# CREATE DATABASE macrosur_ecommerce;
# mvn spring-boot:run
```

### **Frontend - React:**

```bash
# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

### **Git:**

```bash
# Crear rama para feature
git checkout -b feature/nueva-entidad

# Ver cambios
git status
git diff

# Commit
git add .
git commit -m "feat: implementar módulo nueva entidad"

# Push
git push origin feature/nueva-entidad
```

---

## 🎯 PRÓXIMOS MÓDULOS A IMPLEMENTAR

### **1. Productos y Categorías (PRIORITARIO)**
- Backend: `ProductoController`, `CategoriaController`
- Frontend: `ProductsPage.jsx`, `CategoriesPage.jsx`
- Permisos: `VER_PRODUCTOS`, `CREAR_PRODUCTOS`, `EDITAR_PRODUCTOS`

### **2. Inventario y Stock**
- Backend: `StockController`, `AlmacenController`
- Frontend: `InventoryPage.jsx`, `RestockPage.jsx`
- Permisos: `VER_INVENTARIO`, `GESTIONAR_STOCK`

### **3. Pedidos y Clientes**
- Backend: `PedidoController`, `ClienteController`
- Frontend: `OrdersPage.jsx`, `CustomersPage.jsx`
- Permisos: `VER_PEDIDOS`, `GESTIONAR_PEDIDOS`

### **4. Promociones**
- Backend: `PromocionController`
- Frontend: `PromotionsPage.jsx`
- Permisos: `VER_PROMOCIONES`, `CREAR_PROMOCIONES`

---

## 📞 CONTACTO Y SOPORTE

- **Repositorio:** JhoelRN/DesarrolloWebIntegrado_SistVentas
- **Branch activa:** Rodrigo
- **Stack:** Spring Boot 3.5.6 + React 18 + MySQL 8.4.6 + Flyway 9.x

---

**Última actualización:** 26 de noviembre de 2025
