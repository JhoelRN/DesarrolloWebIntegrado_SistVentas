# 🏗️ ARQUITECTURA DE SOFTWARE - SISTEMA E-COMMERCE MACROSUR

## 📊 ARQUITECTURA GENERAL DEL SISTEMA

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CAPA DE PRESENTACIÓN                          │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │   REACT 19 + VITE 7        │  │    JSF + PRIMEFACES (Admin)        │ │
│  │  - SPA moderna              │  │  - Panel admin tradicional         │ │
│  │  - React Router DOM         │  │  - Componentes PrimeFaces          │ │
│  │  - Bootstrap 5.3            │  │  - AJAX con JSF                   │ │
│  │  - Axios HTTP Client        │  │  - WebSockets (futuro)            │ │
│  │  - Context API (Estado)     │  │                                    │ │
│  └────────────────────────────┘  └────────────────────────────────────┘ │
│            │                                    │                         │
│            │ HTTP/REST                          │ HTTP (same origin)      │
│            ▼                                    ▼                         │
└──────────────────────────────────────────────────────────────────────────┘
             │                                    │
             └──────────────┬─────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────────────────┐
│                          CAPA DE APLICACIÓN                                │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │               SPRING BOOT 3.5.6 (Backend Monolítico)                 │ │
│  │                                                                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │ │
│  │  │   Controllers   │  │   Controllers   │  │   Controllers   │     │ │
│  │  │      REST       │  │      JSF        │  │   WebSocket     │     │ │
│  │  │                 │  │   ManagedBeans  │  │   (futuro)      │     │ │
│  │  └────────┬────────┘  └────────┬────────┘  └─────────────────┘     │ │
│  │           │                     │                                    │ │
│  │  ┌────────▼─────────────────────▼────────────────────────────────┐  │ │
│  │  │                    CAPA DE SERVICIOS (NEGOCIO)                 │  │ │
│  │  │                                                                 │  │ │
│  │  │  • ProductoService       • InventarioService                   │  │ │
│  │  │  • CategoriaService      • AlarmaStockService                  │  │ │
│  │  │  • PedidoService         • OrdenReposicionService              │  │ │
│  │  │  • ClienteService        • SeguimientoService                  │  │ │
│  │  │  • PromocionService      • ResenaService                       │  │ │
│  │  │  • AdminUserService      • RolePermissionService               │  │ │
│  │  │  • JasperReportService   • EmailService                        │  │ │
│  │  │  • FileStorageService    • ImageSearchService                  │  │ │
│  │  │                                                                 │  │ │
│  │  └────────────────────────────┬──────────────────────────────────┘  │ │
│  │                               │                                      │ │
│  │  ┌────────────────────────────▼──────────────────────────────────┐  │ │
│  │  │              CAPA DE PERSISTENCIA (DATA ACCESS)               │  │ │
│  │  │                                                                │  │ │
│  │  │  Spring Data JPA (Repositories)                               │  │ │
│  │  │  • ProductoRepository     • InventarioRepository              │  │ │
│  │  │  • CategoriaRepository    • AlarmaStockRepository             │  │ │
│  │  │  • PedidoRepository       • OrdenReposicionRepository         │  │ │
│  │  │  • ClienteRepository      • ResenaRepository                  │  │ │
│  │  │  • UsuarioAdminRepository • ReglaDescuentoRepository          │  │ │
│  │  │                                                                │  │ │
│  │  │  + Queries personalizadas (JPQL)                              │  │ │
│  │  │  + Specifications para filtros dinámicos                      │  │ │
│  │  └────────────────────────────┬──────────────────────────────────┘  │ │
│  └───────────────────────────────┼──────────────────────────────────────┘ │
└────────────────────────────────────┼──────────────────────────────────────┘
                                     │ JDBC
┌────────────────────────────────────▼──────────────────────────────────────┐
│                        CAPA DE DATOS (DATABASE)                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                        MYSQL 8.4 (InnoDB)                             │ │
│  │                                                                        │ │
│  │  • 20+ Tablas normalizadas (3NF)                                      │ │
│  │  • Índices optimizados para búsquedas                                 │ │
│  │  • Foreign Keys con CASCADE                                           │ │
│  │  • Triggers para auditoría                                            │ │
│  │  • Vistas materializadas para reportes                                │ │
│  │  • Flyway para control de versiones de esquema                        │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                        SERVICIOS EXTERNOS (INTEGRACIONES)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   OAuth2     │  │   Pasarela   │  │     SMTP     │  │     CDN      │ │
│  │              │  │   de Pagos   │  │   (Email)    │  │  (Imágenes)  │ │
│  │ • Google     │  │              │  │              │  │              │ │
│  │ • Microsoft  │  │ • Webpay     │  │ • Gmail      │  │ • Cloudinary │ │
│  │   (futuro)   │  │   Plus       │  │ • SendGrid   │  │   (futuro)   │ │
│  └──────────────┘  │   (futuro)   │  └──────────────┘  └──────────────┘ │
│                    └──────────────┘                                       │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                      INFRAESTRUCTURA Y HERRAMIENTAS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Docker    │  │     Git      │  │   Maven      │  │     NPM      │ │
│  │  Containers  │  │  (Control    │  │  (Build      │  │  (Build      │ │
│  │              │  │   Versiones) │  │   Backend)   │  │   Frontend)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Flyway DB   │  │  Lombok      │  │ React DevTools│ │  Postman     │ │
│  │  Migrations  │  │  (Reduce     │  │  (Debug)     │  │  (Testing    │ │
│  │              │  │   Boilerplate│  │              │  │   API)       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 ARQUITECTURA POR CAPAS (N-TIER)

### **1. CAPA DE PRESENTACIÓN** 

#### **Frontend React (Cliente)**
```
RESPONSABILIDADES:
- Renderizado de UI/UX
- Gestión de estado local (Context API)
- Validación de formularios (client-side)
- Navegación (React Router)
- Consumo de APIs REST

TECNOLOGÍAS:
- React 19.1.1 (UI Library)
- Vite 7.1.7 (Build tool)
- Bootstrap 5.3.8 (CSS Framework)
- Axios 1.13.2 (HTTP Client)
- React Router DOM 7.9.3
- React Icons 5.5.0
- React Select 5.10.2

COMPONENTES PRINCIPALES:
/src/pages/
  ├── frontend/
  │   ├── HomePage.jsx
  │   ├── CatalogPage.jsx
  │   ├── ProductDetailPage.jsx
  │   ├── CartPage.jsx
  │   └── CheckoutPage.jsx
  ├── admin/
  │   ├── DashboardPage.jsx
  │   ├── ProductsPage.jsx
  │   ├── OrdersPage.jsx
  │   ├── InventoryPage.jsx
  │   └── AlertsPage.jsx
  └── auth/
      ├── LoginClientePage.jsx
      ├── AdminLoginPage.jsx
      └── OAuthCallbackPage.jsx

/src/components/
  ├── common/
  │   ├── Header.jsx
  │   ├── Footer.jsx
  │   └── ProductCard.jsx
  └── layout/
      ├── LayoutCliente.jsx
      └── LayoutAdmin.jsx

/src/contexts/
  └── AuthContext.jsx         # Estado global de autenticación

/src/api/
  ├── products.js             # Productos API
  ├── auth.js                 # Autenticación API
  ├── inventory.js            # Inventario API
  └── resenas.js              # Reseñas API
```

#### **Frontend JSF (Admin Tradicional)**
```
RESPONSABILIDADES:
- Panel de administración legacy
- Gestión de promociones (CRUD completo)
- Reportes complejos
- Integración con backend Java directo

TECNOLOGÍAS:
- Jakarta Faces 3.0.3 (JSF)
- PrimeFaces 12.0.0 (UI Components)
- BootFaces 1.5.0 (Bootstrap para JSF)
- OmniFaces 4.0 (Utilidades JSF)

ESTRUCTURA:
/src/main/webapp/
  ├── promociones.jsp          # CRUD promociones
  ├── reportes.jsp             # Generación de reportes
  └── WEB-INF/
      ├── web.xml              # Configuración servlets
      └── faces-config.xml     # Configuración JSF
```

---

### **2. CAPA DE APLICACIÓN (BACKEND)**

#### **Controllers REST**
```
RESPONSABILIDAD:
- Recibir requests HTTP
- Validar entrada (Bean Validation)
- Invocar servicios
- Serializar respuestas JSON
- Manejo de excepciones

ESTRUCTURA:
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173"})
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<Page<ProductoListDTO>> listar(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoriaId,
        Pageable pageable
    ) {
        Page<ProductoListDTO> productos = 
            productoService.buscarProductos(search, categoriaId, pageable);
        return ResponseEntity.ok(productos);
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('CREAR_PRODUCTOS')")
    public ResponseEntity<ProductoDTO> crear(
        @Valid @RequestBody ProductoSaveDTO dto
    ) {
        ProductoDTO created = productoService.crearProducto(dto);
        return ResponseEntity.status(201).body(created);
    }
}

CONTROLLERS IMPLEMENTADOS:
- AuthController                # JWT login
- ProductoController            # CRUD productos
- CategoriaController           # CRUD categorías
- PedidoController              # Gestión de pedidos
- InventarioController          # Stock y movimientos
- AlarmaStockController         # Alertas de stock
- OrdenReposicionController     # Órdenes de reposición
- SeguimientoController         # Tracking de despachos
- PromocionController           # Promociones y descuentos
- ResenaController              # Reseñas de productos
- ClienteController             # Gestión de clientes
- AdminController               # Gestión de admins
- ReportController              # Generación de reportes
```

#### **Managed Beans (JSF)**
```java
@Named("promocionBean")
@ViewScoped
public class PromocionBean implements Serializable {
    
    @Inject
    private PromocionService promocionService;
    
    private List<PromocionDTO> promociones;
    private PromocionDTO selectedPromocion;
    
    @PostConstruct
    public void init() {
        cargarPromociones();
    }
    
    public void cargarPromociones() {
        promociones = promocionService.obtenerTodasPromociones();
    }
    
    public void guardar() {
        promocionService.guardarPromocion(selectedPromocion);
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage("Promoción guardada exitosamente"));
    }
}
```

---

### **3. CAPA DE SERVICIOS (BUSINESS LOGIC)**

```
RESPONSABILIDAD:
- Implementar reglas de negocio
- Coordinar múltiples repositorios
- Transacciones (@Transactional)
- Validaciones de negocio
- Lógica de cálculo

EJEMPLO COMPLETO:
@Service
@Transactional
@RequiredArgsConstructor
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;
    private final InventarioService inventarioService;
    private final EmailService emailService;
    
    public PedidoResponseDTO crearPedido(CrearPedidoDTO dto) {
        // 1. Validar stock disponible
        for (ItemDTO item : dto.getItems()) {
            if (!inventarioService.hayStockDisponible(
                item.getVarianteId(), item.getCantidad())) {
                throw new StockInsuficienteException(
                    "Stock insuficiente para variante: " + item.getVarianteId());
            }
        }
        
        // 2. Crear pedido
        Pedido pedido = new Pedido();
        pedido.setCliente_id(dto.getClienteId());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (ItemDTO item : dto.getItems()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setVariante_id(item.getVarianteId());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecio_unitario(item.getPrecioUnitario());
            
            BigDecimal totalItem = item.getPrecioUnitario()
                .multiply(new BigDecimal(item.getCantidad()));
            detalle.setSubtotal(totalItem);
            
            pedido.getDetalles().add(detalle);
            subtotal = subtotal.add(totalItem);
        }
        
        // 3. Calcular totales
        BigDecimal iva = subtotal.multiply(new BigDecimal("0.19"));
        BigDecimal costoEnvio = calcularCostoEnvio(pedido.getPesoTotal());
        BigDecimal total = subtotal.add(iva).add(costoEnvio);
        
        pedido.setSubtotal(subtotal);
        pedido.setIva(iva);
        pedido.setCosto_envio(costoEnvio);
        pedido.setTotal(total);
        
        // 4. Descontar stock automáticamente
        for (ItemDTO item : dto.getItems()) {
            inventarioService.descontarStock(
                item.getVarianteId(), 
                item.getCantidad(),
                "SALIDA_VENTA",
                pedido.getPedido_id()
            );
        }
        
        // 5. Guardar pedido
        Pedido savedPedido = pedidoRepository.save(pedido);
        
        // 6. Enviar email de confirmación
        emailService.enviarConfirmacionPedido(savedPedido);
        
        // 7. Retornar DTO
        return PedidoResponseDTO.fromEntity(savedPedido);
    }
    
    private BigDecimal calcularCostoEnvio(BigDecimal pesoKg) {
        // Tarifa base + peso adicional
        BigDecimal tarifaBase = new BigDecimal("3000");
        BigDecimal costoPorKg = new BigDecimal("500");
        
        if (pesoKg.compareTo(new BigDecimal("5")) <= 0) {
            return tarifaBase;
        }
        
        BigDecimal pesoAdicional = pesoKg.subtract(new BigDecimal("5"));
        BigDecimal costoAdicional = pesoAdicional.multiply(costoPorKg);
        
        return tarifaBase.add(costoAdicional);
    }
}
```

---

### **4. CAPA DE PERSISTENCIA (DATA ACCESS)**

#### **Repositories (Spring Data JPA)**
```java
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Query methods (Spring Data genera implementación automáticamente)
    List<Producto> findByActivoTrue();
    
    Optional<Producto> findByCodigo_producto(String codigo);
    
    boolean existsByCodigo_producto(String codigo);
    
    // Query personalizada con @Query
    @Query("SELECT p FROM Producto p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.codigo_producto) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Producto> buscarPorNombreOCodigo(
        @Param("search") String search, 
        Pageable pageable
    );
    
    // Query con JOIN
    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN FETCH p.categorias c " +
           "WHERE c.categoria_id = :categoriaId AND p.activo = true")
    List<Producto> findByCategoria(@Param("categoriaId") Long categoriaId);
    
    // Native query para queries complejas
    @Query(value = "SELECT p.* FROM productos p " +
                   "WHERE p.precio_base BETWEEN :min AND :max " +
                   "AND p.activo = true " +
                   "ORDER BY p.precio_base ASC", 
           nativeQuery = true)
    List<Producto> findByPrecioRange(
        @Param("min") BigDecimal min, 
        @Param("max") BigDecimal max
    );
}
```

#### **Specifications (Filtros Dinámicos)**
```java
public class ProductoSpecification {
    
    public static Specification<Producto> conNombre(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isEmpty()) {
                return null;
            }
            return cb.like(
                cb.lower(root.get("nombre")), 
                "%" + nombre.toLowerCase() + "%"
            );
        };
    }
    
    public static Specification<Producto> conCategoria(Long categoriaId) {
        return (root, query, cb) -> {
            if (categoriaId == null) {
                return null;
            }
            Join<Producto, Categoria> categorias = root.join("categorias");
            return cb.equal(categorias.get("categoria_id"), categoriaId);
        };
    }
    
    public static Specification<Producto> entrePrecio(
        BigDecimal min, BigDecimal max
    ) {
        return (root, query, cb) -> {
            if (min == null && max == null) {
                return null;
            }
            if (min != null && max != null) {
                return cb.between(root.get("precio_base"), min, max);
            }
            if (min != null) {
                return cb.greaterThanOrEqualTo(root.get("precio_base"), min);
            }
            return cb.lessThanOrEqualTo(root.get("precio_base"), max);
        };
    }
    
    // Combinar specifications
    public static Specification<Producto> busquedaCompleta(
        String search, Long categoriaId, BigDecimal min, BigDecimal max
    ) {
        return Specification
            .where(conNombre(search))
            .and(conCategoria(categoriaId))
            .and(entrePrecio(min, max))
            .and((root, query, cb) -> cb.equal(root.get("activo"), true));
    }
}
```

---

### **5. CAPA DE DATOS (DATABASE)**

#### **Esquema de Base de Datos (MySQL 8.4)**

```sql
-- MÓDULO DE AUTENTICACIÓN
CREATE TABLE Usuarios_Admin (
    usuario_admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_corporativo VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id)
) ENGINE=InnoDB;

CREATE TABLE Roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Permisos (
    permiso_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_permiso VARCHAR(100) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    modulo VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE Roles_Permisos (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id),
    FOREIGN KEY (permiso_id) REFERENCES Permisos(permiso_id)
) ENGINE=InnoDB;

-- MÓDULO DE PRODUCTOS
CREATE TABLE productos (
    producto_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion_corta VARCHAR(500),
    descripcion_larga TEXT,
    precio_base DECIMAL(10,2) NOT NULL,
    peso_kg DECIMAL(8,2) NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo_producto),
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

CREATE TABLE categorias (
    categoria_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) UNIQUE NOT NULL,
    descripcion VARCHAR(500),
    categoria_padre_id BIGINT,
    visible BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    orden_visualizacion INT DEFAULT 0,
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(categoria_id),
    INDEX idx_padre (categoria_padre_id)
) ENGINE=InnoDB;

CREATE TABLE Producto_Categoria (
    producto_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (producto_id, categoria_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
) ENGINE=InnoDB;

-- MÓDULO DE INVENTARIO
CREATE TABLE inventario (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY,
    variante_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    stock_minimo_seguridad INT NOT NULL DEFAULT 10,
    FOREIGN KEY (variante_id) REFERENCES variantes_producto(variante_id),
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones_inventario(ubicacion_id),
    UNIQUE KEY unique_variante_ubicacion (variante_id, ubicacion_id),
    INDEX idx_variante (variante_id),
    INDEX idx_ubicacion (ubicacion_id),
    CHECK (cantidad >= 0)
) ENGINE=InnoDB;

-- ... (más tablas)
```

---

## 🔐 ARQUITECTURA DE SEGURIDAD

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Usuario ingresa credenciales                     │   │
│  │  2. POST /api/auth/login                             │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────│───────────────────────────────────┘
                          │ HTTP/HTTPS
┌─────────────────────────▼───────────────────────────────────┐
│               SPRING SECURITY FILTER CHAIN                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. JwtFilter                                        │   │
│  │     - Extrae token del header "Authorization"       │   │
│  │     - Valida firma y expiración                      │   │
│  │     - Carga usuario al SecurityContext              │   │
│  │                                                       │   │
│  │  2. UsernamePasswordAuthenticationFilter             │   │
│  │     - Solo para endpoint /login                      │   │
│  │     - Autentica con UserDetailsService               │   │
│  │                                                       │   │
│  │  3. AuthorizationFilter                              │   │
│  │     - Verifica @PreAuthorize                         │   │
│  │     - Verifica roles y permisos                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  CONTROLLERS PROTEGIDOS                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  @PreAuthorize("hasAuthority('CREAR_PRODUCTOS')")   │   │
│  │  public ResponseEntity<ProductoDTO> crear(...) {     │   │
│  │      // Solo usuarios con permiso CREAR_PRODUCTOS   │   │
│  │  }                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Flujo de Autenticación JWT**:
1. Usuario envía credenciales → `POST /api/auth/login`
2. Backend valida con `AuthenticationManager`
3. Si válido, genera JWT token con `JwtUtil.generateToken()`
4. Token enviado al frontend: `{ token: "eyJhbGc..." }`
5. Frontend guarda en localStorage/sessionStorage
6. Cada request subsecuente incluye: `Authorization: Bearer <token>`
7. `JwtFilter` valida token antes de cada request
8. Si válido, establece `Authentication` en `SecurityContext`
9. `@PreAuthorize` verifica permisos
10. Si todo OK, controller ejecuta lógica

---

## 📊 ARQUITECTURA DE DATOS

### **Modelo Entidad-Relación (ER) Simplificado**

```
┌──────────────────┐         ┌──────────────────┐
│  Usuarios_Admin  │────1:N──│      Roles       │
│  =============== │         │  ==============  │
│  - usuario_id PK │         │  - rol_id PK     │
│  - rol_id FK     │         │  - nombre_rol    │
│  - nombre        │         └────────┬─────────┘
│  - correo        │                  │ N:M
└──────────────────┘                  │
                              ┌───────▼─────────┐
                              │    Permisos     │
                              │  =============  │
                              │  - permiso_id PK│
                              │  - codigo       │
                              └─────────────────┘

┌──────────────────┐         ┌──────────────────┐
│    Productos     │────N:M──│   Categorias     │
│  ==============  │         │  ==============  │
│  - producto_id PK│         │  - categoria_id  │
│  - codigo        │         │  - nombre        │
│  - nombre        │         │  - padre_id FK   │──┐
│  - precio_base   │         └──────────────────┘  │
└────────┬─────────┘                               │
         │ 1:N                                     │ Jerárquico
         │                                         └──────┘
┌────────▼─────────┐
│ VarianteProducto │
│  ==============  │
│  - variante_id PK│
│  - producto_id FK│
│  - sku           │
│  - atributos JSON│
└────────┬─────────┘
         │ 1:N
┌────────▼─────────┐         ┌──────────────────┐
│    Inventario    │────N:1──│  Ubicaciones     │
│  ==============  │         │  ==============  │
│  - inventario_id │         │  - ubicacion_id  │
│  - variante_id FK│         │  - nombre        │
│  - ubicacion_id  │         │  - tipo          │
│  - cantidad      │         └──────────────────┘
│  - stock_minimo  │
└──────────────────┘

┌──────────────────┐
│     Pedidos      │
│  ==============  │
│  - pedido_id PK  │
│  - cliente_id FK │
│  - estado        │
│  - total         │
└────────┬─────────┘
         │ 1:N
┌────────▼─────────┐
│  DetallePedido   │
│  ==============  │
│  - detalle_id PK │
│  - pedido_id FK  │
│  - variante_id FK│
│  - cantidad      │
│  - precio_unit   │
└──────────────────┘
```

---

## 🔄 FLUJOS DE ARQUITECTURA

### **Flujo de Búsqueda de Productos**

```
[Cliente] → [React Catalog] → [Axios GET /api/productos?search=X&categoria=Y]
                                          │
                                          ▼
                            [ProductoController.buscar()]
                                          │
                                          ▼
                            [ProductoService.buscarProductos()]
                                          │
              ┌───────────────────────────┴──────────────────────┐
              │ Specification.where(                             │
              │   conNombre(search),                             │
              │   conCategoria(categoriaId),                     │
              │   entrePrecio(min, max),                         │
              │   activo(true)                                   │
              │ )                                                 │
              └───────────────────────┬──────────────────────────┘
                                      │
                                      ▼
                        [ProductoRepository.findAll(spec, pageable)]
                                      │
                                      ▼
                              [MySQL Query Execution]
                                      │
                                      ▼
                        [Page<Producto> → Page<ProductoListDTO>]
                                      │
                                      ▼
                            [JSON Response con Page]
                                      │
                                      ▼
              [React actualiza estado y renderiza cards]
```

---

## 📈 ESCALABILIDAD

### **Arquitectura Actual (Monolito + SPA)**
```
┌─────────────────────────────────────────────┐
│         SERVIDOR ÚNICO (Monolito)           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Spring Boot (Backend)             │   │
│  │   + React Build (Frontend estático) │   │
│  │   + MySQL (misma máquina)           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Ventajas:                                  │
│  • Deployment simple                        │
│  • Sin latencia entre servicios             │
│  • Transacciones ACID nativas               │
│                                             │
│  Desventajas:                               │
│  • Punto único de falla                     │
│  • Escalamiento vertical únicamente         │
│  • Difícil actualizar módulos individuales  │
└─────────────────────────────────────────────┘
```

### **Arquitectura Futura (Microservicios)**
```
                      [API Gateway (Spring Cloud Gateway)]
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
   ┌────▼────┐              ┌───────▼────┐            ┌────────▼──────┐
   │ Products│              │  Inventory │            │   Orders      │
   │ Service │              │  Service   │            │   Service     │
   │ (8081)  │              │  (8082)    │            │   (8083)      │
   └────┬────┘              └───────┬────┘            └────────┬──────┘
        │                           │                           │
   ┌────▼────┐              ┌───────▼────┐            ┌────────▼──────┐
   │ MySQL   │              │  MySQL     │            │   MySQL       │
   │ Products│              │  Inventory │            │   Orders      │
   └─────────┘              └────────────┘            └───────────────┘

Ventajas:
• Escalamiento horizontal independiente
• Deploy independiente (CI/CD por servicio)
• Tecnologías heterogéneas (Java, Node, Python)
• Resiliencia (un servicio cae, otros siguen)

Requiere:
• Service Discovery (Eureka)
• Config Server (Spring Cloud Config)
• Circuit Breaker (Resilience4j)
• Distributed Tracing (Zipkin)
• Event Bus (Kafka o RabbitMQ)
```

---

## 🎯 DECISIONES DE ARQUITECTURA

| Decisión | Razón | Alternativa Considerada |
|----------|-------|------------------------|
| **Monolito primero** | Simplicidad de desarrollo y deployment inicial | Microservicios (descartado por complejidad) |
| **Spring Boot** | Ecosistema maduro, gran comunidad, productividad | Node.js (descartado por experiencia del equipo) |
| **React + Vite** | SPA moderna, performance, developer experience | Angular (más verboso), Vue (menos adopción) |
| **MySQL** | Transacciones ACID, relaciones complejas, familiaridad | PostgreSQL (similar), MongoDB (no relacional) |
| **JWT para admin** | Stateless, escalable, estándar de industria | Sessions (requiere sticky sessions) |
| **OAuth2 para cliente** | UX superior, sin contraseñas, trust de providers | Solo manual (menos adopción) |
| **Flyway** | Control de versiones de BD, reproducibilidad | Liquibase (más verboso) |
| **Lombok** | Reduce boilerplate en 40%, código limpio | Sin Lombok (mucho código repetitivo) |
| **JasperReports** | Reportes complejos con diseño visual | iText (programático), PDFBox (bajo nivel) |

---

**Última actualización**: 1 de diciembre de 2025  
**Versión del documento**: 1.0  
**Próxima revisión**: Migración a microservicios (post-MVP)
