# 📦 DOCUMENTACIÓN DE MÓDULOS - SISTEMA E-COMMERCE MACROSUR

## 📚 ÍNDICE DE MÓDULOS

1. [Módulo de Autenticación y Seguridad](#1-módulo-de-autenticación-y-seguridad)
2. [Módulo de Productos y Categorías](#2-módulo-de-productos-y-categorías)
3. [Módulo de Inventario y Logística](#3-módulo-de-inventario-y-logística)
4. [Módulo de Promociones y Descuentos](#4-módulo-de-promociones-y-descuentos)
5. [Módulo de Pedidos y Ventas](#5-módulo-de-pedidos-y-ventas)
6. [Módulo de Reseñas y Calificaciones](#6-módulo-de-reseñas-y-calificaciones)
7. [Módulo de Reportes y PDF](#7-módulo-de-reportes-y-pdf)
8. [Módulo de Emails](#8-módulo-de-emails)

---

## 1. MÓDULO DE AUTENTICACIÓN Y SEGURIDAD

### **📋 Descripción**
Sistema dual de autenticación que soporta administradores (JWT) y clientes (OAuth2 + manual).

### **🎯 Responsabilidades**
- Autenticación de usuarios
- Autorización por roles y permisos
- Generación y validación de tokens JWT
- Control de acceso a recursos
- Gestión de sesiones

---

### **🗄️ Entidades de Base de Datos**

#### **UsuarioAdmin**
```sql
TABLE: Usuarios_Admin
CAMPOS:
  - usuario_admin_id (PK, BIGINT)
  - rol_id (FK, INT) → Roles
  - nombre (VARCHAR 100)
  - apellido (VARCHAR 100)
  - correo_corporativo (VARCHAR 255, UNIQUE)
  - contrasena_hash (VARCHAR 255)
  - activo (BOOLEAN, DEFAULT true)
  - fecha_creacion (TIMESTAMP)
```

#### **Role**
```sql
TABLE: Roles
CAMPOS:
  - rol_id (PK, INT)
  - nombre_rol (VARCHAR 50, UNIQUE)
    # Valores: SUPER_ADMIN, GESTOR_VENTAS, GESTOR_LOGISTICA, MODERADOR
  - descripcion (VARCHAR 255)
```

#### **Permission**
```sql
TABLE: Permisos
CAMPOS:
  - permiso_id (PK, INT)
  - codigo_permiso (VARCHAR 100, UNIQUE)
    # Ej: VER_PRODUCTOS, CREAR_PRODUCTOS, GESTIONAR_STOCK
  - descripcion (VARCHAR 255)
  - modulo (VARCHAR 50)
    # Valores: PRODUCTOS, INVENTARIO, PEDIDOS, REPORTES
```

#### **Role_Permission** (Tabla intermedia Many-to-Many)
```sql
TABLE: Roles_Permisos
CAMPOS:
  - rol_id (PK, FK → Roles)
  - permiso_id (PK, FK → Permisos)
```

#### **Cliente**
```sql
TABLE: Clientes
CAMPOS:
  - cliente_id (PK, BIGINT)
  - nombre (VARCHAR 100)
  - apellido (VARCHAR 100)
  - correo (VARCHAR 255, UNIQUE)
  - contrasena_hash (VARCHAR 255, NULLABLE)
  - oauth_provider (VARCHAR 50, NULLABLE)
    # Valores: null, 'google', 'microsoft'
  - oauth_id (VARCHAR 255, NULLABLE)
  - avatar_url (VARCHAR 500, NULLABLE)
  - activo (BOOLEAN, DEFAULT true)
  - fecha_registro (TIMESTAMP)
```

---

### **📦 Clases Java (Backend)**

#### **Entidades JPA**
```java
@Entity
@Table(name = "Usuarios_Admin")
public class UsuarioAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuario_admin_id;
    
    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Role role;
    
    private String nombre;
    private String apellido;
    private String correo_corporativo;
    private String contrasena_hash;
    private Boolean activo;
    
    @CreationTimestamp
    private LocalDateTime fecha_creacion;
}

@Entity
@Table(name = "Clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cliente_id;
    
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena_hash;
    private String oauth_provider;
    private String oauth_id;
    private String avatar_url;
    private Boolean activo;
    
    @CreationTimestamp
    private LocalDateTime fecha_registro;
}
```

#### **Seguridad**
```java
// JWT Utility
@Component
public class JwtUtil {
    private final String SECRET_KEY = "tu_secret_key_256_bits";
    private final long EXPIRATION_TIME = 86400000; // 24 horas
    
    public String generateToken(String username) { ... }
    public String extractUsername(String token) { ... }
    public boolean validateToken(String token) { ... }
}

// JWT Filter
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, 
                                    HttpServletResponse res, 
                                    FilterChain chain) {
        // Extrae token del header Authorization
        // Valida token
        // Establece autenticación en SecurityContext
    }
}

// Security Config
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/productos/**").permitAll()
                .requestMatchers("/api/promociones/activas").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

#### **Servicios**
```java
@Service
public class AdminUserService {
    public List<UsuarioAdminDto> getAdminUsers() { ... }
    public UsuarioAdminDto createAdminUser(CreateUserRequest req) {
        // Encripta contraseña con BCrypt
        // Asigna rol
        // Guarda en BD
    }
    public void changePassword(Long userId, String newPassword) { ... }
}

@Service
public class ClienteService {
    public Map<String, Object> loginManual(String email, String password) {
        // Busca cliente por email
        // Valida contraseña con BCrypt
        // Retorna datos del cliente (sin JWT por ahora)
    }
    
    public Cliente loginOAuth(OAuthLoginRequest req) {
        // Busca cliente por oauth_provider + oauth_id
        // Si no existe, lo crea automáticamente
        // Retorna cliente con avatar_url
    }
}
```

#### **Controladores REST**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        // Autentica con Spring Security
        // Genera JWT token
        // Retorna: { token, usuario_admin_id, nombre, role, permissions }
    }
    
    @GetMapping("/me")
    public ResponseEntity<UsuarioAdminDto> me() {
        // Lee usuario del SecurityContext
        // Retorna datos del usuario actual
    }
}

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginCliente(@RequestBody LoginRequest req) {
        // Login manual de cliente
    }
    
    @PostMapping("/oauth-login")
    public ResponseEntity<ClienteDTO> oauthLogin(@RequestBody OAuthLoginRequest req) {
        // Login OAuth (Google/Microsoft)
    }
    
    @GetMapping("/perfil")
    public ResponseEntity<ClienteDTO> obtenerPerfil(
        @RequestHeader("X-Cliente-Id") Long clienteId) {
        // Retorna perfil del cliente actual
    }
}
```

---

### **⚛️ Frontend (React)**

#### **AuthContext.jsx**
```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Login unificado (admin o cliente)
  const login = async (email, password, isAdmin) => {
    const endpoint = isAdmin ? '/api/auth/login' : '/api/clientes/login';
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (isAdmin) {
        localStorage.setItem('authToken', data.token);
        setUserRole('ADMIN');
      } else {
        localStorage.setItem('authToken', JSON.stringify(data));
        localStorage.setItem('clienteId', data.clienteId);
        setUserRole('CLIENTE');
      }
      
      setUser(data);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('clienteId');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **ProtectedRoute.jsx**
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (requiredRole && userRole !== requiredRole) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, userRole, requiredRole]);

  return isAuthenticated && (!requiredRole || userRole === requiredRole) 
    ? children 
    : <Spinner />;
};
```

---

### **🔐 Seguridad Implementada**

| Característica | Estado | Descripción |
|----------------|--------|-------------|
| **Encriptación de contraseñas** | ✅ | BCrypt con salt automático |
| **Tokens JWT** | ✅ | Firmados con HS256, expiración 24h |
| **CORS restrictivo** | ⏳ | Actualmente `*`, cambiar en prod |
| **HTTPS** | ❌ | Solo en producción |
| **Rate Limiting** | ❌ | Pendiente (Spring Cloud Gateway) |
| **Auditoría de login** | ❌ | Pendiente (tabla audit_logs) |
| **2FA** | ❌ | No implementado |
| **Recuperación de contraseña** | ❌ | Pendiente |

---

### **📋 Endpoints**

#### **Admin**
```
POST   /api/auth/login                 # Login admin (JWT)
GET    /api/auth/me                    # Usuario actual
POST   /api/auth/validate              # Validar token
GET    /api/admin/users                # Lista de admins
POST   /api/admin/users                # Crear admin
PUT    /api/admin/users/{id}           # Actualizar admin
DELETE /api/admin/users/{id}           # Desactivar admin
```

#### **Cliente**
```
POST   /api/clientes/login             # Login manual
POST   /api/clientes/register          # Registro
POST   /api/clientes/oauth-login       # Login OAuth
GET    /api/clientes/perfil            # Perfil (requiere X-Cliente-Id)
PUT    /api/clientes/perfil            # Actualizar perfil
POST   /api/clientes/cambiar-password  # Cambiar contraseña
```

---

### **🧪 Testing**

#### **Casos de Prueba**
```
✅ Login admin con credenciales válidas → JWT token
✅ Login admin con contraseña incorrecta → 401 Unauthorized
✅ Acceso a endpoint protegido sin token → 403 Forbidden
✅ Acceso a endpoint protegido con token expirado → 401 Unauthorized
✅ Login cliente manual → Retorna clienteId
✅ Login OAuth con usuario nuevo → Crea cliente automáticamente
✅ Login OAuth con usuario existente → Retorna datos actualizados
✅ Cambio de rol de admin → Permisos actualizados
```

---

## 2. MÓDULO DE PRODUCTOS Y CATEGORÍAS

### **📋 Descripción**
Gestión completa del catálogo de productos con soporte para categorías jerárquicas, variantes y búsqueda avanzada.

### **🎯 Responsabilidades**
- CRUD de productos y categorías
- Gestión de variantes (tallas, colores)
- Subida y gestión de imágenes
- Búsqueda con filtros avanzados
- Soft delete y restauración

---

### **🗄️ Entidades de Base de Datos**

#### **Producto**
```sql
TABLE: productos
CAMPOS:
  - producto_id (PK, BIGINT)
  - codigo_producto (VARCHAR 50, UNIQUE)
  - nombre (VARCHAR 255)
  - descripcion_corta (VARCHAR 500)
  - descripcion_larga (TEXT)
  - precio_base (DECIMAL 10,2)
  - peso_kg (DECIMAL 8,2)
  - visible (BOOLEAN, DEFAULT true)
  - activo (BOOLEAN, DEFAULT true)
  - fecha_creacion (TIMESTAMP)
  - fecha_modificacion (TIMESTAMP)
```

#### **Categoria**
```sql
TABLE: categorias
CAMPOS:
  - categoria_id (PK, BIGINT)
  - nombre_categoria (VARCHAR 100, UNIQUE)
  - descripcion (VARCHAR 500)
  - categoria_padre_id (FK, BIGINT, NULLABLE) → categorias
  - visible (BOOLEAN, DEFAULT true)
  - activo (BOOLEAN, DEFAULT true)
  - orden_visualizacion (INT)
```

#### **Producto_Categoria** (Many-to-Many)
```sql
TABLE: Producto_Categoria
CAMPOS:
  - producto_id (PK, FK → productos)
  - categoria_id (PK, FK → categorias)
```

#### **VarianteProducto**
```sql
TABLE: variantes_producto
CAMPOS:
  - variante_id (PK, INT)
  - producto_id (FK, BIGINT) → productos
  - sku (VARCHAR 100, UNIQUE)
  - nombre_variante (VARCHAR 100)
    # Ej: "Talla M - Azul"
  - atributos (JSON)
    # { "talla": "M", "color": "Azul", "material": "Algodón" }
  - precio_variante (DECIMAL 10,2, NULLABLE)
    # Si null, usa precio_base del producto
  - activa (BOOLEAN, DEFAULT true)
```

#### **ImagenProducto**
```sql
TABLE: imagenes_producto
CAMPOS:
  - imagen_id (PK, BIGINT)
  - producto_id (FK, BIGINT) → productos
  - url_imagen (VARCHAR 500)
  - es_principal (BOOLEAN, DEFAULT false)
  - orden_visualizacion (INT)
```

---

### **📦 Clases Java (Backend)**

#### **Entidades JPA**
```java
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long producto_id;
    
    @Column(unique = true)
    private String codigo_producto;
    
    private String nombre;
    private String descripcion_corta;
    
    @Lob
    private String descripcion_larga;
    
    private BigDecimal precio_base;
    private BigDecimal peso_kg;
    private Boolean visible;
    private Boolean activo;
    
    @ManyToMany
    @JoinTable(
        name = "Producto_Categoria",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<Categoria> categorias = new HashSet<>();
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    private List<VarianteProducto> variantes = new ArrayList<>();
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    private List<ImagenProducto> imagenes = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime fecha_creacion;
    
    @UpdateTimestamp
    private LocalDateTime fecha_modificacion;
}

@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoria_id;
    
    @Column(unique = true)
    private String nombre_categoria;
    
    private String descripcion;
    
    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private Categoria categoriaPadre;
    
    @OneToMany(mappedBy = "categoriaPadre")
    private List<Categoria> subcategorias = new ArrayList<>();
    
    private Boolean visible;
    private Boolean activo;
    private Integer orden_visualizacion;
}
```

#### **DTOs**
```java
public class ProductoDTO {
    private Long producto_id;
    private String codigo_producto;
    private String nombre;
    private String descripcion_corta;
    private String descripcion_larga;
    private BigDecimal precio_base;
    private BigDecimal peso_kg;
    private List<CategoriaDTO> categorias;
    private List<VarianteProductoDTO> variantes;
    private List<String> imagenes;
    private Boolean visible;
    private Boolean activo;
}

@Valid
public class ProductoSaveDTO {
    @NotBlank
    @Size(max = 50)
    private String codigo_producto;
    
    @NotBlank
    @Size(max = 255)
    private String nombre;
    
    @Size(max = 500)
    private String descripcion_corta;
    
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal precio_base;
    
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal peso_kg;
    
    @NotEmpty(message = "Debe tener al menos una categoría")
    private Set<Long> categoriasIds;
}
```

#### **Servicios**
```java
@Service
@Transactional
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private VarianteProductoRepository varianteRepository;
    
    public Page<ProductoListDTO> buscarProductos(
        String search,
        Long categoriaId,
        BigDecimal precioMin,
        BigDecimal precioMax,
        Pageable pageable
    ) {
        // Query dinámica con Specification
        Specification<Producto> spec = ProductoSpecification.builder()
            .conNombre(search)
            .conCategoria(categoriaId)
            .entrePrecio(precioMin, precioMax)
            .activo(true)
            .build();
        
        return productoRepository.findAll(spec, pageable)
            .map(this::toListDTO);
    }
    
    public ProductoDTO crearProducto(ProductoSaveDTO dto) {
        // Validar código único
        if (productoRepository.existsByCodigo(dto.getCodigo_producto())) {
            throw new IllegalArgumentException("Código ya existe");
        }
        
        Producto producto = new Producto();
        producto.setCodigo_producto(dto.getCodigo_producto());
        producto.setNombre(dto.getNombre());
        producto.setPrecio_base(dto.getPrecio_base());
        producto.setPeso_kg(dto.getPeso_kg());
        
        // Asignar categorías
        Set<Categoria> categorias = categoriaRepository
            .findAllById(dto.getCategoriasIds())
            .stream()
            .collect(Collectors.toSet());
        producto.setCategorias(categorias);
        
        Producto saved = productoRepository.save(producto);
        
        // Auto-crear variante default
        VarianteProducto varianteDefault = new VarianteProducto();
        varianteDefault.setProducto(saved);
        varianteDefault.setSku(saved.getCodigo_producto() + "-DEFAULT");
        varianteDefault.setNombre_variante("Estándar");
        varianteRepository.save(varianteDefault);
        
        return toDTO(saved);
    }
    
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        producto.setActivo(false); // Soft delete
        productoRepository.save(producto);
    }
}

@Service
public class CategoriaService {
    public CategoriaDTO crearCategoria(CategoriaSaveDTO dto) {
        // Validar nombre único
        // Validar que no se cree ciclo (A → B → A)
        // Guardar y retornar
    }
    
    public List<CategoriaDTO> obtenerArbolCategorias() {
        // Retorna solo categorías raíz con subcategorías recursivas
        return categoriaRepository.findByCategoriaPadreIsNull()
            .stream()
            .map(this::toDTOConSubcategorias)
            .collect(Collectors.toList());
    }
}
```

---

### **📋 Endpoints**

```
GET    /api/productos                       # Lista con paginación
GET    /api/productos/{id}                  # Detalle completo
POST   /api/productos                       # Crear producto
PUT    /api/productos/{id}                  # Actualizar producto
DELETE /api/productos/{id}                  # Soft delete
GET    /api/productos/variantes             # Todas las variantes
POST   /api/productos/{id}/imagenes         # Subir imagen
DELETE /api/productos/imagenes/{id}         # Eliminar imagen

GET    /api/categorias                      # Árbol completo
GET    /api/categorias/{id}                 # Detalle con subcategorías
POST   /api/categorias                      # Crear categoría
PUT    /api/categorias/{id}                 # Actualizar categoría
DELETE /api/categorias/{id}                 # Soft delete
```

---

## 3. MÓDULO DE INVENTARIO Y LOGÍSTICA

### **📋 Descripción**
Sistema automático de gestión de inventario multi-ubicación con alarmas de stock y órdenes de reposición automáticas.

### **🎯 Responsabilidades**
- Control de stock por variante y ubicación
- Generación automática de alarmas de stock bajo
- Órdenes de reposición automáticas (CRON 2 AM)
- Gestión de proveedores y operadores logísticos
- Seguimiento de despachos
- Movimientos de stock (entradas/salidas)

---

### **🗄️ Entidades de Base de Datos**

#### **Inventario**
```sql
TABLE: inventario
CAMPOS:
  - inventario_id (PK, BIGINT)
  - variante_id (FK, INT) → variantes_producto
  - ubicacion_id (FK, BIGINT) → ubicaciones_inventario
  - cantidad_disponible (INT, DEFAULT 0)
  - cantidad_reservada (INT, DEFAULT 0)
  - stock_minimo (INT, DEFAULT 10)
  - stock_maximo (INT, DEFAULT 100)
  - ultima_actualizacion (TIMESTAMP)
  
UNIQUE KEY: (variante_id, ubicacion_id)
```

#### **UbicacionInventario**
```sql
TABLE: ubicaciones_inventario
CAMPOS:
  - ubicacion_id (PK, BIGINT)
  - nombre_ubicacion (VARCHAR 100)
  - tipo_ubicacion (ENUM: 'BODEGA_PRINCIPAL', 'BODEGA_SECUNDARIA', 'TIENDA')
  - direccion (VARCHAR 255)
  - ciudad (VARCHAR 100)
  - es_principal (BOOLEAN, DEFAULT false)
  - activa (BOOLEAN, DEFAULT true)
```

#### **MovimientoStock**
```sql
TABLE: movimientos_stock
CAMPOS:
  - movimiento_id (PK, BIGINT)
  - inventario_id (FK, BIGINT) → inventario
  - tipo_movimiento (ENUM: 'ENTRADA', 'SALIDA', 'AJUSTE', 'TRANSFERENCIA')
  - cantidad (INT)
  - stock_anterior (INT)
  - stock_nuevo (INT)
  - motivo (VARCHAR 255)
  - usuario_admin_id (FK, BIGINT, NULLABLE) → Usuarios_Admin
  - fecha_movimiento (TIMESTAMP)
```

#### **AlarmaStock**
```sql
TABLE: alarmas_stock
CAMPOS:
  - alarma_id (PK, BIGINT)
  - inventario_id (FK, BIGINT) → inventario
  - tipo_alarma (ENUM: 'STOCK_BAJO', 'STOCK_CRITICO', 'SIN_STOCK')
  - nivel_gravedad (ENUM: 'BAJA', 'MEDIA', 'ALTA', 'CRITICA')
  - mensaje (VARCHAR 500)
  - resuelta (BOOLEAN, DEFAULT false)
  - fecha_creacion (TIMESTAMP)
  - fecha_resolucion (TIMESTAMP, NULLABLE)
  - resuelta_por (FK, BIGINT, NULLABLE) → Usuarios_Admin
```

#### **OrdenReposicion**
```sql
TABLE: ordenes_reposicion
CAMPOS:
  - orden_id (PK, BIGINT)
  - variante_id (FK, INT) → variantes_producto
  - proveedor_id (FK, BIGINT) → proveedores
  - ubicacion_destino_id (FK, BIGINT) → ubicaciones_inventario
  - cantidad_solicitada (INT)
  - estado (ENUM: 'PENDIENTE', 'APROBADA', 'EN_TRANSITO', 'RECIBIDA', 'CANCELADA')
  - fecha_creacion (TIMESTAMP)
  - fecha_aprobacion (TIMESTAMP, NULLABLE)
  - fecha_recepcion (TIMESTAMP, NULLABLE)
  - operador_logistico_id (FK, BIGINT, NULLABLE) → operadores_logisticos
  - numero_seguimiento (VARCHAR 100, NULLABLE)
```

#### **Proveedor**
```sql
TABLE: proveedores
CAMPOS:
  - proveedor_id (PK, BIGINT)
  - nombre_proveedor (VARCHAR 150)
  - rut (VARCHAR 12, UNIQUE)
  - contacto_nombre (VARCHAR 100)
  - contacto_email (VARCHAR 255)
  - contacto_telefono (VARCHAR 20)
  - activo (BOOLEAN, DEFAULT true)
```

#### **OperadorLogistico**
```sql
TABLE: operadores_logisticos
CAMPOS:
  - operador_id (PK, BIGINT)
  - nombre_operador (VARCHAR 150)
  - api_tracking_url (VARCHAR 500, NULLABLE)
  - activo (BOOLEAN, DEFAULT true)
```

---

### **📦 Servicios Java**

#### **InventarioService**
```java
@Service
@Transactional
public class InventarioService {
    @Autowired
    private InventarioRepository inventarioRepository;
    
    @Autowired
    private MovimientoStockRepository movimientoRepository;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    /**
     * Descuenta stock al crear un pedido
     */
    public void descontarStock(Integer varianteId, Integer cantidad) {
        Inventario inventario = obtenerInventarioPrincipal(varianteId);
        
        if (inventario.getCantidad_disponible() < cantidad) {
            throw new StockInsuficienteException(
                "Stock insuficiente. Disponible: " + inventario.getCantidad_disponible()
            );
        }
        
        int stockAnterior = inventario.getCantidad_disponible();
        inventario.setCantidad_disponible(stockAnterior - cantidad);
        inventarioRepository.save(inventario);
        
        // Registrar movimiento
        registrarMovimiento(inventario, "SALIDA", cantidad, stockAnterior, "Venta");
        
        // Verificar si genera alarma
        verificarAlarma(inventario);
    }
    
    /**
     * Aumenta stock al recibir orden de reposición
     */
    public void aumentarStock(Integer varianteId, Long ubicacionId, Integer cantidad) {
        Inventario inventario = inventarioRepository
            .findByVarianteIdAndUbicacionId(varianteId, ubicacionId)
            .orElseGet(() -> crearInventarioAutomatico(varianteId, ubicacionId));
        
        int stockAnterior = inventario.getCantidad_disponible();
        inventario.setCantidad_disponible(stockAnterior + cantidad);
        inventarioRepository.save(inventario);
        
        registrarMovimiento(inventario, "ENTRADA", cantidad, stockAnterior, "Reposición");
        
        // Resolver alarmas si las hay
        resolverAlarmasAutomaticas(inventario);
    }
    
    /**
     * Ajuste manual de stock
     */
    public void ajustarStock(Long inventarioId, Integer nuevaCantidad, String motivo) {
        Inventario inventario = inventarioRepository.findById(inventarioId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        int stockAnterior = inventario.getCantidad_disponible();
        int diferencia = nuevaCantidad - stockAnterior;
        
        inventario.setCantidad_disponible(nuevaCantidad);
        inventarioRepository.save(inventario);
        
        String tipoMovimiento = diferencia > 0 ? "ENTRADA" : "SALIDA";
        registrarMovimiento(inventario, tipoMovimiento, Math.abs(diferencia), 
                          stockAnterior, motivo);
        
        verificarAlarma(inventario);
    }
    
    private void verificarAlarma(Inventario inventario) {
        if (inventario.getCantidad_disponible() <= inventario.getStock_minimo()) {
            // Publicar evento para crear alarma
            eventPublisher.publishEvent(new StockBajoEvent(this, inventario));
        }
    }
}
```

#### **AlarmaStockService**
```java
@Service
@Transactional
public class AlarmaStockService {
    @Autowired
    private AlarmaStockRepository alarmaRepository;
    
    @Autowired
    private InventarioRepository inventarioRepository;
    
    /**
     * Verificación automática de alarmas (llamada por CRON y por eventos)
     */
    public void verificarAlarmas() {
        List<Inventario> inventarios = inventarioRepository.findAll();
        
        for (Inventario inv : inventarios) {
            // Solo verificar si no tiene alarma activa
            if (!tieneAlarmaActiva(inv.getInventario_id())) {
                if (inv.getCantidad_disponible() == 0) {
                    crearAlarma(inv, "SIN_STOCK", "CRITICA");
                } else if (inv.getCantidad_disponible() <= inv.getStock_minimo() / 2) {
                    crearAlarma(inv, "STOCK_CRITICO", "ALTA");
                } else if (inv.getCantidad_disponible() <= inv.getStock_minimo()) {
                    crearAlarma(inv, "STOCK_BAJO", "MEDIA");
                }
            }
        }
    }
    
    private void crearAlarma(Inventario inventario, String tipo, String gravedad) {
        AlarmaStock alarma = new AlarmaStock();
        alarma.setInventario(inventario);
        alarma.setTipo_alarma(TipoAlarma.valueOf(tipo));
        alarma.setNivel_gravedad(NivelGravedad.valueOf(gravedad));
        alarma.setMensaje(generarMensaje(inventario, tipo));
        alarma.setResuelta(false);
        
        alarmaRepository.save(alarma);
    }
    
    /**
     * Resolver alarma manualmente
     */
    public void resolverAlarma(Long alarmaId, Long usuarioId) {
        AlarmaStock alarma = alarmaRepository.findById(alarmaId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        alarma.setResuelta(true);
        alarma.setFecha_resolucion(LocalDateTime.now());
        alarma.setResuelta_por_id(usuarioId);
        
        alarmaRepository.save(alarma);
    }
    
    /**
     * Listar alarmas con filtros
     */
    public Page<AlarmaStockDTO> listarAlarmas(
        Boolean resuelta,
        String gravedad,
        Pageable pageable
    ) {
        Specification<AlarmaStock> spec = AlarmaStockSpecification.builder()
            .resuelta(resuelta)
            .gravedad(gravedad)
            .build();
        
        return alarmaRepository.findAll(spec, pageable)
            .map(this::toDTO);
    }
}
```

#### **OrdenReposicionService**
```java
@Service
@Transactional
public class OrdenReposicionService {
    @Autowired
    private OrdenReposicionRepository ordenRepository;
    
    @Autowired
    private InventarioRepository inventarioRepository;
    
    @Autowired
    private ProveedorRepository proveedorRepository;
    
    /**
     * CRON JOB: Corre todos los días a las 2 AM
     * Genera órdenes de reposición para productos con stock bajo
     */
    @Scheduled(cron = "0 0 2 * * *") // 2:00 AM diario
    public void generarOrdenesAutomaticas() {
        log.info("Iniciando generación automática de órdenes de reposición...");
        
        // Buscar inventarios con stock bajo
        List<Inventario> inventariosBajos = inventarioRepository
            .findByCantidadDisponibleLessThanStockMinimo();
        
        int ordenesCreadas = 0;
        
        for (Inventario inv : inventariosBajos) {
            // Verificar que no tenga orden pendiente
            if (!tieneOrdenPendiente(inv.getVariante_id())) {
                // Calcular cantidad a pedir (hasta stock_maximo)
                int cantidadPedir = inv.getStock_maximo() - inv.getCantidad_disponible();
                
                // Buscar proveedor principal de la variante
                Proveedor proveedor = obtenerProveedorPrincipal(inv.getVariante_id());
                
                // Crear orden
                OrdenReposicion orden = new OrdenReposicion();
                orden.setVariante_id(inv.getVariante_id());
                orden.setProveedor(proveedor);
                orden.setUbicacion_destino(inv.getUbicacion());
                orden.setCantidad_solicitada(cantidadPedir);
                orden.setEstado(EstadoOrden.PENDIENTE);
                
                ordenRepository.save(orden);
                ordenesCreadas++;
                
                log.info("Orden creada: Variante {}, Cantidad {}", 
                        inv.getVariante_id(), cantidadPedir);
            }
        }
        
        log.info("Generación automática completada. Órdenes creadas: {}", ordenesCreadas);
    }
    
    /**
     * Aprobar orden manualmente
     */
    public void aprobarOrden(Long ordenId) {
        OrdenReposicion orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        if (orden.getEstado() != EstadoOrden.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden aprobar órdenes pendientes");
        }
        
        orden.setEstado(EstadoOrden.APROBADA);
        orden.setFecha_aprobacion(LocalDateTime.now());
        ordenRepository.save(orden);
    }
    
    /**
     * Marcar orden como recibida y actualizar stock
     */
    public void recibirOrden(Long ordenId) {
        OrdenReposicion orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        if (orden.getEstado() != EstadoOrden.EN_TRANSITO) {
            throw new IllegalStateException("Orden debe estar en tránsito");
        }
        
        // Actualizar estado
        orden.setEstado(EstadoOrden.RECIBIDA);
        orden.setFecha_recepcion(LocalDateTime.now());
        ordenRepository.save(orden);
        
        // Aumentar stock
        inventarioService.aumentarStock(
            orden.getVariante_id(),
            orden.getUbicacion_destino().getUbicacion_id(),
            orden.getCantidad_solicitada()
        );
    }
}
```

---

### **📋 Endpoints**

```
# Inventario
GET    /api/inventario                              # Lista con stock
GET    /api/inventario/stock/variante/{id}          # Stock por variante
POST   /api/inventario/ajustar                      # Ajuste manual
GET    /api/inventario/movimientos/{inventarioId}   # Historial movimientos

# Alarmas
GET    /api/alarmas                                 # Lista de alarmas
GET    /api/alarmas/activas                         # Solo activas
PUT    /api/alarmas/{id}/resolver                   # Resolver alarma
GET    /api/alarmas/estadisticas                    # Stats de alarmas

# Órdenes de Reposición
GET    /api/ordenes-reposicion                      # Lista
GET    /api/ordenes-reposicion/{id}                 # Detalle
POST   /api/ordenes-reposicion                      # Crear manual
PUT    /api/ordenes-reposicion/{id}/aprobar         # Aprobar
PUT    /api/ordenes-reposicion/{id}/enviar          # Marcar en tránsito
PUT    /api/ordenes-reposicion/{id}/recibir         # Marcar recibida
DELETE /api/ordenes-reposicion/{id}                 # Cancelar

# Proveedores
GET    /api/proveedores                             # Lista
POST   /api/proveedores                             # Crear
PUT    /api/proveedores/{id}                        # Actualizar

# Ubicaciones
GET    /api/ubicaciones                             # Lista
GET    /api/ubicaciones/principal                   # Ubicación principal
POST   /api/ubicaciones                             # Crear
```

---

### **⚛️ Frontend (React)**

#### **Páginas Implementadas**
```
✅ InventoryPage.jsx           # Lista de inventarios con stock
✅ AlertsPage.jsx               # Alarmas de stock
⏳ OrdersPage.jsx               # Órdenes de reposición (70%)
❌ TrackingPage.jsx             # Seguimiento de despachos (0%)
```

#### **Estado del Frontend**
- **InventoryPage**: Completa con tabla, filtros y ajuste manual
- **AlertsPage**: Completa con badges de gravedad y resolución
- **OrdersPage**: Falta integrar modal de creación con dropdown de variantes
- **TrackingPage**: No implementada

---

### **🔧 Configuración CRON**

```java
@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Ya está habilitado en la aplicación
}

// En OrdenReposicionService.java
@Scheduled(cron = "0 0 2 * * *") // 2:00 AM todos los días
public void generarOrdenesAutomaticas() { ... }

// Verificación de alarmas cada hora
@Scheduled(fixedRate = 3600000) // 1 hora
public void verificarAlarmasPeriodicas() { ... }
```

---

## 4. MÓDULO DE PROMOCIONES Y DESCUENTOS

### **📋 Descripción**
Sistema dinámico de promociones con múltiples tipos de descuento y banner carousel en el frontend.

### **🎯 Responsabilidades**
- Crear y gestionar reglas de descuento
- Aplicar descuentos automáticamente
- Validar vigencia y aplicabilidad
- Mostrar banners promocionales
- Calcular descuento óptimo por producto

---

### **🗄️ Entidades de Base de Datos**

#### **ReglaDescuento**
```sql
TABLE: reglas_descuento
CAMPOS:
  - regla_id (PK, BIGINT)
  - nombre_promocion (VARCHAR 150)
  - descripcion (TEXT)
  - tipo_descuento (ENUM: 'PORCENTAJE', 'MONTO_FIJO', 'ENVIO_GRATIS')
  - valor_descuento (DECIMAL 10,2)
    # Si PORCENTAJE: 15 = 15%
    # Si MONTO_FIJO: 5000 = $5,000 de descuento
  - aplicacion (ENUM: 'TODOS', 'CATEGORIA', 'PRODUCTO', 'CLIENTE')
  - categoria_id (FK, BIGINT, NULLABLE) → categorias
  - producto_id (FK, BIGINT, NULLABLE) → productos
  - cliente_id (FK, BIGINT, NULLABLE) → Clientes
  - fecha_inicio (TIMESTAMP)
  - fecha_fin (TIMESTAMP)
  - activa (BOOLEAN, DEFAULT true)
  - banner_url (VARCHAR 500, NULLABLE)
  - mostrar_banner (BOOLEAN, DEFAULT false)
```

---

### **📦 Servicios Java**

#### **PromocionService** (Facade + Strategy Pattern)
```java
@Service
@Transactional
public class PromocionService {
    @Autowired
    private ReglaDescuentoRepository reglaRepository;
    
    @Autowired
    private Map<String, DescuentoStrategy> descuentoStrategies;
    
    /**
     * Calcula el mejor descuento aplicable a un producto
     */
    public BigDecimal calcularDescuentoProducto(
        Long productoId,
        Long clienteId,
        BigDecimal precioBase
    ) {
        // Obtener promociones vigentes
        LocalDateTime ahora = LocalDateTime.now();
        List<ReglaDescuento> promoActivas = reglaRepository
            .findByActivaTrueAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                ahora, ahora
            );
        
        // Filtrar promociones aplicables
        List<ReglaDescuento> aplicables = promoActivas.stream()
            .filter(regla -> esAplicable(regla, productoId, clienteId))
            .collect(Collectors.toList());
        
        if (aplicables.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        // Calcular descuento con cada estrategia y retornar el mayor
        return aplicables.stream()
            .map(regla -> {
                DescuentoStrategy strategy = getStrategy(regla.getTipo_descuento());
                return strategy.calcular(precioBase, regla);
            })
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);
    }
    
    /**
     * Verifica si una regla es aplicable
     */
    private boolean esAplicable(ReglaDescuento regla, Long productoId, Long clienteId) {
        switch (regla.getAplicacion()) {
            case TODOS:
                return true;
            case PRODUCTO:
                return regla.getProducto_id().equals(productoId);
            case CATEGORIA:
                // Verificar si producto pertenece a la categoría
                return productoRepository.findById(productoId)
                    .map(p -> p.getCategorias().stream()
                        .anyMatch(cat -> cat.getCategoria_id().equals(regla.getCategoria_id())))
                    .orElse(false);
            case CLIENTE:
                return regla.getCliente_id() != null && 
                       regla.getCliente_id().equals(clienteId);
            default:
                return false;
        }
    }
    
    /**
     * Obtener estrategia según tipo de descuento
     */
    private DescuentoStrategy getStrategy(TipoDescuento tipo) {
        String strategyName = tipo.name().toLowerCase() + "Strategy";
        DescuentoStrategy strategy = descuentoStrategies.get(strategyName);
        
        if (strategy == null) {
            throw new IllegalStateException("Strategy no encontrada: " + strategyName);
        }
        
        return strategy;
    }
    
    /**
     * Obtener promociones para banners
     */
    public List<ReglaDescuentoDTO> obtenerPromocionesParaBanner() {
        LocalDateTime ahora = LocalDateTime.now();
        return reglaRepository
            .findByActivaTrueAndMostrar_bannerTrueAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                ahora, ahora
            )
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Crear nueva promoción
     */
    public ReglaDescuentoDTO crearPromocion(ReglaDescuentoSaveDTO dto) {
        // Validar fechas
        if (dto.getFecha_inicio().isAfter(dto.getFecha_fin())) {
            throw new IllegalArgumentException("Fecha inicio debe ser menor a fecha fin");
        }
        
        // Validar tipo y valor
        if (dto.getTipo_descuento() == TipoDescuento.PORCENTAJE && 
            dto.getValor_descuento().compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Porcentaje no puede ser mayor a 100");
        }
        
        ReglaDescuento regla = new ReglaDescuento();
        regla.setNombre_promocion(dto.getNombre_promocion());
        regla.setDescripcion(dto.getDescripcion());
        regla.setTipo_descuento(dto.getTipo_descuento());
        regla.setValor_descuento(dto.getValor_descuento());
        regla.setAplicacion(dto.getAplicacion());
        regla.setFecha_inicio(dto.getFecha_inicio());
        regla.setFecha_fin(dto.getFecha_fin());
        regla.setActiva(true);
        
        ReglaDescuento saved = reglaRepository.save(regla);
        return toDTO(saved);
    }
}
```

#### **Estrategias de Descuento**
```java
// Interfaz Strategy
public interface DescuentoStrategy {
    BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla);
}

// Strategy 1: Porcentaje
@Component("porcentajeStrategy")
public class DescuentoPorcentajeStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        BigDecimal porcentaje = regla.getValor_descuento()
            .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return precioBase.multiply(porcentaje)
            .setScale(0, RoundingMode.HALF_UP);
    }
}

// Strategy 2: Monto Fijo
@Component("monto_fijoStrategy")
public class DescuentoMontoFijoStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        BigDecimal descuento = regla.getValor_descuento();
        // No puede descontar más del precio
        return descuento.min(precioBase);
    }
}

// Strategy 3: Envío Gratis
@Component("envio_gratisStrategy")
public class EnvioGratisStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        // Retorna el costo de envío completo
        return precioBase;
    }
}
```

---

### **📋 Endpoints**

```
GET    /api/promociones/activas                     # Promociones vigentes
GET    /api/promociones/banners                     # Para carousel
GET    /api/promociones                             # Lista completa (admin)
GET    /api/promociones/{id}                        # Detalle
POST   /api/promociones                             # Crear
PUT    /api/promociones/{id}                        # Actualizar
DELETE /api/promociones/{id}                        # Desactivar
POST   /api/promociones/calcular-descuento          # Calcular descuento
```

---

### **⚛️ Frontend (JSF + React)**

#### **JSF: promociones.jsp**
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head>
    <title>Gestión de Promociones</title>
</head>
<body>
    <h:form>
        <p:dataTable value="#{promocionBean.promociones}" var="promo">
            <p:column headerText="Nombre">
                <h:outputText value="#{promo.nombrePromocion}" />
            </p:column>
            <p:column headerText="Tipo">
                <h:outputText value="#{promo.tipoDescuento}" />
            </p:column>
            <p:column headerText="Descuento">
                <h:outputText value="#{promo.valorDescuento}" />
            </p:column>
            <p:column headerText="Vigencia">
                <h:outputText value="#{promo.fechaInicio} - #{promo.fechaFin}" />
            </p:column>
            <p:column headerText="Estado">
                <p:badge value="#{promo.activa ? 'Activa' : 'Inactiva'}" 
                         severity="#{promo.activa ? 'success' : 'danger'}" />
            </p:column>
        </p:dataTable>
    </h:form>
</body>
</html>
```

#### **React: Banner Carousel (HomePage)**
```jsx
function HomePage() {
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    fetch('/api/promociones/banners')
      .then(res => res.json())
      .then(data => setPromociones(data));
  }, []);

  return (
    <div>
      <Carousel>
        {promociones.map((promo) => (
          <Carousel.Item key={promo.regla_id}>
            <img
              className="d-block w-100"
              src={promo.banner_url}
              alt={promo.nombre_promocion}
            />
            <Carousel.Caption>
              <h3>{promo.nombre_promocion}</h3>
              <p>{promo.descripcion}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
```

---

## 5. MÓDULO DE PEDIDOS Y VENTAS

### **📋 Descripción**
Gestión completa del ciclo de vida de pedidos con descuento automático de stock y cálculo de IVA.

### **🎯 Responsabilidades**
- Crear pedidos desde el carrito
- Calcular totales con IVA (19%)
- Descontar stock automáticamente
- Gestionar estados del pedido
- Enviar notificaciones por email
- Generar comprobantes PDF

---

### **🗄️ Entidades de Base de Datos**

#### **Pedido**
```sql
TABLE: pedidos
CAMPOS:
  - pedido_id (PK, BIGINT)
  - cliente_id (FK, BIGINT) → Clientes
  - numero_pedido (VARCHAR 50, UNIQUE)
  - subtotal (DECIMAL 10,2)
  - descuento_total (DECIMAL 10,2, DEFAULT 0)
  - costo_envio (DECIMAL 10,2, DEFAULT 0)
  - iva (DECIMAL 10,2)
  - total (DECIMAL 10,2)
  - estado (ENUM: 'PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'CANCELADO')
  - direccion_envio (VARCHAR 500)
  - comuna (VARCHAR 100)
  - ciudad (VARCHAR 100)
  - region (VARCHAR 100)
  - telefono_contacto (VARCHAR 20)
  - notas_adicionales (TEXT, NULLABLE)
  - fecha_creacion (TIMESTAMP)
  - fecha_actualizacion (TIMESTAMP)
```

#### **DetallePedido**
```sql
TABLE: detalles_pedido
CAMPOS:
  - detalle_id (PK, BIGINT)
  - pedido_id (FK, BIGINT) → pedidos
  - variante_id (FK, INT) → variantes_producto
  - cantidad (INT)
  - precio_unitario (DECIMAL 10,2)
  - descuento_aplicado (DECIMAL 10,2, DEFAULT 0)
  - subtotal (DECIMAL 10,2)
```

---

### **📦 Servicios Java**

#### **PedidoService**
```java
@Service
@Transactional
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private InventarioService inventarioService;
    
    @Autowired
    private PromocionService promocionService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    private static final BigDecimal IVA_PORCENTAJE = new BigDecimal("0.19");
    
    /**
     * Crea un pedido completo desde el carrito
     */
    public PedidoDTO crearPedido(CrearPedidoDTO dto) {
        // 1. Validar cliente existe
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        
        // 2. Validar stock de todos los items
        for (ItemCarritoDTO item : dto.getItems()) {
            Inventario inv = inventarioService.obtenerInventarioPrincipal(item.getVarianteId());
            if (inv.getCantidad_disponible() < item.getCantidad()) {
                throw new StockInsuficienteException(
                    "Stock insuficiente para variante " + item.getVarianteId()
                );
            }
        }
        
        // 3. Crear pedido
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setNumero_pedido(generarNumeroPedido());
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setDireccion_envio(dto.getDireccion_envio());
        pedido.setComuna(dto.getComuna());
        pedido.setCiudad(dto.getCiudad());
        pedido.setRegion(dto.getRegion());
        pedido.setTelefono_contacto(dto.getTelefono_contacto());
        pedido.setNotas_adicionales(dto.getNotas_adicionales());
        
        // 4. Crear detalles y calcular totales
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal descuentoTotal = BigDecimal.ZERO;
        
        List<DetallePedido> detalles = new ArrayList<>();
        
        for (ItemCarritoDTO item : dto.getItems()) {
            VarianteProducto variante = varianteRepository.findById(item.getVarianteId())
                .orElseThrow(() -> new EntityNotFoundException());
            
            BigDecimal precioUnitario = variante.getPrecio_efectivo();
            BigDecimal subtotalItem = precioUnitario.multiply(new BigDecimal(item.getCantidad()));
            
            // Calcular descuento si aplica
            BigDecimal descuentoItem = promocionService.calcularDescuentoProducto(
                variante.getProducto().getProducto_id(),
                cliente.getCliente_id(),
                subtotalItem
            );
            
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setVariante(variante);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecio_unitario(precioUnitario);
            detalle.setDescuento_aplicado(descuentoItem);
            detalle.setSubtotal(subtotalItem.subtract(descuentoItem));
            
            detalles.add(detalle);
            
            subtotal = subtotal.add(subtotalItem);
            descuentoTotal = descuentoTotal.add(descuentoItem);
        }
        
        pedido.setDetalles(detalles);
        pedido.setSubtotal(subtotal);
        pedido.setDescuento_total(descuentoTotal);
        pedido.setCosto_envio(dto.getCostoEnvio());
        
        // 5. Calcular IVA y total
        BigDecimal baseImponible = subtotal.subtract(descuentoTotal).add(dto.getCostoEnvio());
        BigDecimal iva = baseImponible.multiply(IVA_PORCENTAJE)
            .setScale(0, RoundingMode.HALF_UP);
        BigDecimal total = baseImponible.add(iva);
        
        pedido.setIva(iva);
        pedido.setTotal(total);
        
        // 6. Guardar pedido
        Pedido savedPedido = pedidoRepository.save(pedido);
        
        // 7. Descontar stock
        for (DetallePedido detalle : savedPedido.getDetalles()) {
            inventarioService.descontarStock(
                detalle.getVariante().getVariante_id(),
                detalle.getCantidad()
            );
        }
        
        // 8. Publicar evento (enviará email automáticamente)
        eventPublisher.publishEvent(new PedidoCreadoEvent(this, savedPedido));
        
        // 9. Retornar DTO
        return toDTO(savedPedido);
    }
    
    /**
     * Cambia el estado del pedido
     */
    public void cambiarEstado(Long pedidoId, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        // Validar transición de estado
        validarTransicionEstado(pedido.getEstado(), nuevoEstado);
        
        EstadoPedido estadoAnterior = pedido.getEstado();
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);
        
        // Enviar email notificando cambio
        emailService.enviarCambioEstadoPedido(pedido, estadoAnterior, nuevoEstado);
    }
    
    /**
     * Cancela un pedido y devuelve el stock
     */
    public void cancelarPedido(Long pedidoId, String motivo) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new IllegalStateException("No se puede cancelar un pedido entregado");
        }
        
        // Devolver stock
        for (DetallePedido detalle : pedido.getDetalles()) {
            inventarioService.aumentarStock(
                detalle.getVariante().getVariante_id(),
                1L, // Ubicación principal
                detalle.getCantidad()
            );
        }
        
        pedido.setEstado(EstadoPedido.CANCELADO);
        pedido.setNotas_adicionales(
            (pedido.getNotas_adicionales() != null ? pedido.getNotas_adicionales() + "\n" : "") +
            "CANCELADO: " + motivo
        );
        pedidoRepository.save(pedido);
        
        // Enviar email
        emailService.enviarPedidoCancelado(pedido, motivo);
    }
    
    /**
     * Lista pedidos con filtros
     */
    public Page<PedidoListDTO> listarPedidos(
        Long clienteId,
        EstadoPedido estado,
        LocalDate fechaDesde,
        LocalDate fechaHasta,
        Pageable pageable
    ) {
        Specification<Pedido> spec = PedidoSpecification.builder()
            .clienteId(clienteId)
            .estado(estado)
            .fechaDesde(fechaDesde)
            .fechaHasta(fechaHasta)
            .build();
        
        return pedidoRepository.findAll(spec, pageable)
            .map(this::toListDTO);
    }
    
    /**
     * Genera número de pedido único
     */
    private String generarNumeroPedido() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int secuencia = pedidoRepository.countByFechaCreacion(LocalDate.now()) + 1;
        return String.format("PED-%s-%04d", fecha, secuencia);
    }
    
    /**
     * Valida que la transición de estado sea válida
     */
    private void validarTransicionEstado(EstadoPedido actual, EstadoPedido nuevo) {
        Map<EstadoPedido, Set<EstadoPedido>> transicionesPermitidas = Map.of(
            EstadoPedido.PENDIENTE, Set.of(EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO),
            EstadoPedido.CONFIRMADO, Set.of(EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO),
            EstadoPedido.EN_PREPARACION, Set.of(EstadoPedido.DESPACHADO, EstadoPedido.CANCELADO),
            EstadoPedido.DESPACHADO, Set.of(EstadoPedido.ENTREGADO),
            EstadoPedido.ENTREGADO, Set.of(), // No puede cambiar de estado
            EstadoPedido.CANCELADO, Set.of()  // No puede cambiar de estado
        );
        
        Set<EstadoPedido> permitidos = transicionesPermitidas.get(actual);
        if (permitidos == null || !permitidos.contains(nuevo)) {
            throw new IllegalStateException(
                String.format("No se puede cambiar de %s a %s", actual, nuevo)
            );
        }
    }
}
```

---

### **📋 Endpoints**

```
GET    /api/pedidos                          # Lista con filtros
GET    /api/pedidos/{id}                     # Detalle completo
POST   /api/pedidos                          # Crear pedido
PUT    /api/pedidos/{id}/estado              # Cambiar estado
PUT    /api/pedidos/{id}/cancelar            # Cancelar pedido
GET    /api/pedidos/cliente/{clienteId}      # Pedidos de un cliente
GET    /api/pedidos/{id}/pdf                 # Descargar comprobante
GET    /api/pedidos/estadisticas             # Stats de ventas
```

---

### **⚛️ Frontend (React)**

#### **CheckoutPage.jsx** (Completa ✅)
```jsx
function CheckoutPage() {
  const [carrito, setCarrito] = useState([]);
  const [direccion, setDireccion] = useState({});
  const { user } = useAuth();

  const handleCrearPedido = async () => {
    const dto = {
      clienteId: user.cliente_id,
      items: carrito.map(item => ({
        varianteId: item.variante_id,
        cantidad: item.cantidad
      })),
      direccion_envio: direccion.calle,
      comuna: direccion.comuna,
      ciudad: direccion.ciudad,
      region: direccion.region,
      telefono_contacto: direccion.telefono,
      costoEnvio: calcularCostoEnvio()
    };

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (response.ok) {
        const pedido = await response.json();
        toast.success(`Pedido ${pedido.numero_pedido} creado exitosamente`);
        navigate(`/pedidos/${pedido.pedido_id}`);
        // Limpiar carrito
        localStorage.removeItem('carrito');
      }
    } catch (error) {
      toast.error('Error al crear pedido');
    }
  };

  return (
    <Container>
      <h2>Checkout</h2>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h4>Dirección de Envío</h4>
              <Form>
                <Form.Group>
                  <Form.Label>Calle y número</Form.Label>
                  <Form.Control
                    value={direccion.calle}
                    onChange={(e) => setDireccion({...direccion, calle: e.target.value})}
                  />
                </Form.Group>
                {/* Más campos... */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4>Resumen</h4>
              <p>Subtotal: ${calcularSubtotal()}</p>
              <p>Envío: ${calcularCostoEnvio()}</p>
              <p>IVA (19%): ${calcularIVA()}</p>
              <hr />
              <h5>Total: ${calcularTotal()}</h5>
              <Button onClick={handleCrearPedido} variant="success" block>
                Confirmar Pedido
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
```

---

## 6. MÓDULO DE RESEÑAS Y CALIFICACIONES

### **📋 Descripción**
Sistema de reviews con moderación, solo clientes autenticados pueden dejar reseñas en productos que hayan comprado.

### **🎯 Responsabilidades**
- Permitir reseñas de clientes verificados
- Sistema de calificación por estrellas (1-5)
- Moderación de contenido inapropiado
- Cálculo de rating promedio por producto
- Filtrado y paginación de reseñas

---

### **🗄️ Entidades de Base de Datos**

#### **Resena**
```sql
TABLE: resenas
CAMPOS:
  - resena_id (PK, BIGINT)
  - producto_id (FK, BIGINT) → productos
  - cliente_id (FK, BIGINT) → Clientes
  - pedido_id (FK, BIGINT, NULLABLE) → pedidos
  - calificacion (INT)  # 1-5 estrellas
  - titulo (VARCHAR 150)
  - comentario (TEXT)
  - estado (ENUM: 'PENDIENTE', 'APROBADA', 'RECHAZADA')
  - motivo_rechazo (VARCHAR 500, NULLABLE)
  - fecha_creacion (TIMESTAMP)
  - moderada_por (FK, BIGINT, NULLABLE) → Usuarios_Admin
  - fecha_moderacion (TIMESTAMP, NULLABLE)
  
UNIQUE KEY: (producto_id, cliente_id) # Un cliente solo puede reseñar una vez por producto
```

---

### **📦 Servicios Java**

#### **ResenaService**
```java
@Service
@Transactional
public class ResenaService {
    @Autowired
    private ResenaRepository resenaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    /**
     * Crea una nueva reseña (requiere compra verificada)
     */
    public ResenaDTO crearResena(CrearResenaDTO dto, Long clienteId) {
        // 1. Validar que el cliente haya comprado el producto
        boolean haComprado = pedidoRepository.existsByClienteIdAndProductoId(
            clienteId, 
            dto.getProductoId()
        );
        
        if (!haComprado) {
            throw new IllegalStateException(
                "Solo puedes reseñar productos que hayas comprado"
            );
        }
        
        // 2. Validar que no tenga reseña previa
        if (resenaRepository.existsByProductoIdAndClienteId(dto.getProductoId(), clienteId)) {
            throw new IllegalStateException(
                "Ya has reseñado este producto"
            );
        }
        
        // 3. Validar calificación
        if (dto.getCalificacion() < 1 || dto.getCalificacion() > 5) {
            throw new IllegalArgumentException("Calificación debe ser entre 1 y 5");
        }
        
        // 4. Crear reseña
        Resena resena = new Resena();
        resena.setProducto(productoRepository.findById(dto.getProductoId())
            .orElseThrow(() -> new EntityNotFoundException()));
        resena.setCliente_id(clienteId);
        resena.setCalificacion(dto.getCalificacion());
        resena.setTitulo(dto.getTitulo());
        resena.setComentario(dto.getComentario());
        resena.setEstado(EstadoResena.PENDIENTE); // Moderación obligatoria
        
        Resena saved = resenaRepository.save(resena);
        return toDTO(saved);
    }
    
    /**
     * Moderar reseña (aprobar o rechazar)
     */
    public void moderarResena(Long resenaId, boolean aprobar, String motivo, Long moderadorId) {
        Resena resena = resenaRepository.findById(resenaId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        if (resena.getEstado() != EstadoResena.PENDIENTE) {
            throw new IllegalStateException("Reseña ya fue moderada");
        }
        
        if (aprobar) {
            resena.setEstado(EstadoResena.APROBADA);
        } else {
            if (motivo == null || motivo.isBlank()) {
                throw new IllegalArgumentException("Debe proporcionar motivo de rechazo");
            }
            resena.setEstado(EstadoResena.RECHAZADA);
            resena.setMotivo_rechazo(motivo);
        }
        
        resena.setModerada_por(moderadorId);
        resena.setFecha_moderacion(LocalDateTime.now());
        
        resenaRepository.save(resena);
    }
    
    /**
     * Obtener reseñas de un producto (solo aprobadas)
     */
    public Page<ResenaDTO> obtenerResenasPorProducto(Long productoId, Pageable pageable) {
        return resenaRepository
            .findByProductoIdAndEstado(productoId, EstadoResena.APROBADA, pageable)
            .map(this::toDTO);
    }
    
    /**
     * Calcular rating promedio de un producto
     */
    public ProductoRatingDTO calcularRatingProducto(Long productoId) {
        List<Resena> resenas = resenaRepository
            .findByProductoIdAndEstado(productoId, EstadoResena.APROBADA);
        
        if (resenas.isEmpty()) {
            return new ProductoRatingDTO(0.0, 0);
        }
        
        double promedio = resenas.stream()
            .mapToInt(Resena::getCalificacion)
            .average()
            .orElse(0.0);
        
        // Distribución por estrellas
        Map<Integer, Long> distribucion = resenas.stream()
            .collect(Collectors.groupingBy(
                Resena::getCalificacion,
                Collectors.counting()
            ));
        
        return ProductoRatingDTO.builder()
            .rating_promedio(promedio)
            .total_resenas(resenas.size())
            .estrellas_5(distribucion.getOrDefault(5, 0L))
            .estrellas_4(distribucion.getOrDefault(4, 0L))
            .estrellas_3(distribucion.getOrDefault(3, 0L))
            .estrellas_2(distribucion.getOrDefault(2, 0L))
            .estrellas_1(distribucion.getOrDefault(1, 0L))
            .build();
    }
    
    /**
     * Listar reseñas pendientes de moderación
     */
    public Page<ResenaDTO> obtenerResenasPendientes(Pageable pageable) {
        return resenaRepository
            .findByEstadoOrderByFechaCreacionAsc(EstadoResena.PENDIENTE, pageable)
            .map(this::toDTO);
    }
}
```

---

### **📋 Endpoints**

```
GET    /api/resenas/producto/{id}            # Reseñas aprobadas de un producto
GET    /api/resenas/producto/{id}/rating     # Rating promedio
POST   /api/resenas                          # Crear reseña
GET    /api/resenas/pendientes               # Moderación (admin)
PUT    /api/resenas/{id}/aprobar             # Aprobar (admin)
PUT    /api/resenas/{id}/rechazar            # Rechazar (admin)
GET    /api/resenas/cliente/{id}             # Reseñas de un cliente
DELETE /api/resenas/{id}                     # Eliminar propia reseña
```

---

### **⚛️ Frontend (React)**

#### **ProductReviews.jsx** (Componente ✅)
```jsx
function ProductReviews({ productoId }) {
  const [resenas, setResenas] = useState([]);
  const [rating, setRating] = useState(null);
  const [puedeResenar, setPuedeResenar] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Cargar reseñas aprobadas
    fetch(`/api/resenas/producto/${productoId}`)
      .then(res => res.json())
      .then(data => setResenas(data.content));

    // Cargar rating
    fetch(`/api/resenas/producto/${productoId}/rating`)
      .then(res => res.json())
      .then(data => setRating(data));

    // Verificar si puede reseñar
    if (isAuthenticated && user.cliente_id) {
      fetch(`/api/resenas/puede-resenar/${productoId}`, {
        headers: { 'X-Cliente-Id': user.cliente_id }
      })
        .then(res => res.json())
        .then(data => setPuedeResenar(data.puede_resenar));
    }
  }, [productoId, user]);

  const renderStars = (calificacion) => {
    return (
      <>
        {[1, 2, 3, 4, 5].map(star => (
          <FaStar
            key={star}
            color={star <= calificacion ? '#ffc107' : '#e4e5e9'}
          />
        ))}
      </>
    );
  };

  return (
    <div className="product-reviews">
      <h3>Reseñas de Clientes</h3>

      {/* Rating Summary */}
      {rating && (
        <div className="rating-summary">
          <h4>{rating.rating_promedio.toFixed(1)} ⭐</h4>
          <p>{rating.total_resenas} reseñas</p>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-bar">
                <span>{star} ⭐</span>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(rating[`estrellas_${star}`] / rating.total_resenas) * 100}%`
                    }}
                  />
                </div>
                <span>{rating[`estrellas_${star}`]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para crear reseña */}
      {puedeResenar && (
        <Button onClick={() => setShowModal(true)}>
          Escribe una reseña
        </Button>
      )}

      {/* Lista de reseñas */}
      <div className="reviews-list">
        {resenas.map(resena => (
          <Card key={resena.resena_id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{resena.cliente_nombre}</strong>
                  <div>{renderStars(resena.calificacion)}</div>
                </div>
                <small>{new Date(resena.fecha_creacion).toLocaleDateString()}</small>
              </div>
              <h5 className="mt-2">{resena.titulo}</h5>
              <p>{resena.comentario}</p>
              {resena.compra_verificada && (
                <Badge bg="success">✓ Compra Verificada</Badge>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. MÓDULO DE REPORTES Y PDF

### **📋 Descripción**
Generación de reportes en PDF y Excel usando JasperReports, Flying Saucer e iText7.

### **🎯 Responsabilidades**
- Reportes de inventario
- Reportes de ventas
- Comprobantes de pedidos
- Etiquetas de productos
- Exportación a PDF y Excel

---

### **📦 Servicios Java**

#### **JasperReportService**
```java
@Service
public class JasperReportService {
    
    /**
     * Genera reporte de inventario
     */
    public byte[] generarReporteInventario(Long ubicacionId) throws JRException {
        // Cargar template
        InputStream template = getClass()
            .getResourceAsStream("/templates/inventario.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(template);
        
        // Obtener datos
        List<Map<String, Object>> datos = inventarioRepository
            .findReporteByUbicacionId(ubicacionId);
        
        // Parámetros
        Map<String, Object> params = new HashMap<>();
        params.put("ubicacion", ubicacionRepository.findById(ubicacionId)
            .orElseThrow().getNombre_ubicacion());
        params.put("fecha", LocalDate.now().toString());
        
        // Compilar
        JasperPrint print = JasperFillManager.fillReport(
            jasperReport,
            params,
            new JRMapCollectionDataSource(datos)
        );
        
        // Exportar a PDF
        return JasperExportManager.exportReportToPdf(print);
    }
    
    /**
     * Genera reporte de ventas
     */
    public byte[] generarReporteVentas(LocalDate inicio, LocalDate fin) throws JRException {
        InputStream template = getClass()
            .getResourceAsStream("/templates/ventas.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(template);
        
        List<Map<String, Object>> datos = pedidoRepository
            .findReporteVentas(inicio, fin);
        
        Map<String, Object> params = new HashMap<>();
        params.put("fecha_inicio", inicio.toString());
        params.put("fecha_fin", fin.toString());
        params.put("total_ventas", calcularTotalVentas(datos));
        
        JasperPrint print = JasperFillManager.fillReport(
            jasperReport,
            params,
            new JRMapCollectionDataSource(datos)
        );
        
        return JasperExportManager.exportReportToPdf(print);
    }
}
```

#### **PdfService** (Flying Saucer + iText7)
```java
@Service
public class PdfService {
    @Autowired
    private TemplateEngine templateEngine;
    
    /**
     * Genera comprobante de pedido
     */
    public byte[] generarComprobantePedido(Long pedidoId) throws Exception {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        // Renderizar HTML con Thymeleaf
        Context context = new Context();
        context.setVariable("pedido", pedido);
        context.setVariable("detalles", pedido.getDetalles());
        context.setVariable("cliente", pedido.getCliente());
        
        String html = templateEngine.process("comprobante-pedido", context);
        
        // Convertir HTML a PDF con Flying Saucer
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(baos);
        
        return baos.toByteArray();
    }
}
```

---

### **📋 Endpoints**

```
GET    /api/reportes/inventario                     # PDF inventario
GET    /api/reportes/ventas                         # PDF ventas
GET    /api/reportes/productos/etiquetas            # PDF etiquetas
GET    /api/pedidos/{id}/pdf                        # Comprobante pedido
GET    /api/reportes/inventario/excel               # Excel inventario
```

---

## 8. MÓDULO DE EMAILS

### **📋 Descripción**
Sistema de notificaciones por correo electrónico usando Spring Mail y templates Thymeleaf.

### **🎯 Responsabilidades**
- Email de confirmación de registro
- Email de confirmación de pedido
- Email de cambio de estado de pedido
- Email de pedido cancelado
- Email de promociones (futuro)

---

### **📦 Servicios Java**

#### **EmailService**
```java
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    /**
     * Envía email de confirmación de pedido
     */
    public void enviarConfirmacionPedido(Pedido pedido) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            // Renderizar template Thymeleaf
            Context context = new Context();
            context.setVariable("pedido", pedido);
            context.setVariable("cliente", pedido.getCliente());
            context.setVariable("detalles", pedido.getDetalles());
            
            String html = templateEngine.process("email-confirmacion-pedido", context);
            
            // Configurar email
            helper.setFrom(fromEmail);
            helper.setTo(pedido.getCliente().getCorreo());
            helper.setSubject("Confirmación de Pedido #" + pedido.getNumero_pedido());
            helper.setText(html, true); // true = HTML
            
            // Enviar
            mailSender.send(message);
            
            log.info("Email enviado a: {}", pedido.getCliente().getCorreo());
        } catch (MessagingException e) {
            log.error("Error al enviar email", e);
        }
    }
    
    /**
     * Envía email de cambio de estado
     */
    public void enviarCambioEstadoPedido(Pedido pedido, EstadoPedido estadoAnterior, 
                                         EstadoPedido estadoNuevo) {
        try {
            Context context = new Context();
            context.setVariable("pedido", pedido);
            context.setVariable("estadoAnterior", estadoAnterior);
            context.setVariable("estadoNuevo", estadoNuevo);
            
            String html = templateEngine.process("email-cambio-estado", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(pedido.getCliente().getCorreo());
            helper.setSubject("Tu pedido #" + pedido.getNumero_pedido() + 
                             " cambió a " + estadoNuevo);
            helper.setText(html, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Error al enviar email", e);
        }
    }
    
    /**
     * Listener de eventos para envío automático
     */
    @EventListener
    @Async
    public void onPedidoCreado(PedidoCreadoEvent event) {
        enviarConfirmacionPedido(event.getPedido());
    }
}
```

---

### **🔧 Configuración (application.properties)**
```properties
# SMTP Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

### **📋 Templates Thymeleaf**

#### **email-confirmacion-pedido.html**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Pedido</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>¡Gracias por tu compra!</h2>
        <p>Hola <strong th:text="${cliente.nombre}">Cliente</strong>,</p>
        <p>Hemos recibido tu pedido correctamente.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3>Detalles del Pedido</h3>
            <p><strong>Número:</strong> <span th:text="${pedido.numero_pedido}">PED-001</span></p>
            <p><strong>Fecha:</strong> <span th:text="${#temporals.format(pedido.fecha_creacion, 'dd/MM/yyyy HH:mm')}">01/12/2025</span></p>
            <p><strong>Total:</strong> $<span th:text="${#numbers.formatDecimal(pedido.total, 0, 'POINT', 0, 'COMMA')}">0</span></p>
        </div>
        
        <h3>Productos</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr th:each="detalle : ${detalles}">
                <td th:text="${detalle.variante.nombre_variante}">Producto</td>
                <td th:text="${detalle.cantidad}">1</td>
                <td>$<span th:text="${#numbers.formatDecimal(detalle.subtotal, 0, 'POINT', 0, 'COMMA')}">0</span></td>
            </tr>
        </table>
        
        <p style="margin-top: 30px;">
            Te notificaremos cuando tu pedido cambie de estado.
        </p>
        
        <p>Saludos,<br/>Equipo Macrosur</p>
    </div>
</body>
</html>
```

---

### **📊 Estado del Módulo**

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Email confirmación pedido | ✅ | Funcional |
| Email cambio estado | ✅ | Funcional |
| Email cancelación | ✅ | Funcional |
| Email registro cliente | ⏳ | Pendiente |
| Email recuperar contraseña | ❌ | No implementado |
| Email promociones masivas | ❌ | Futuro |

---

**Última actualización**: 1 de diciembre de 2025  
**Versión del documento**: 1.0 (COMPLETO)
