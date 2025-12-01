# 🎨 PATRONES DE DISEÑO - SISTEMA E-COMMERCE MACROSUR

## 📚 ÍNDICE DE PATRONES

1. [Patrones Arquitectónicos](#1-patrones-arquitectónicos)
2. [Patrones Creacionales](#2-patrones-creacionales)
3. [Patrones Estructurales](#3-patrones-estructurales)
4. [Patrones de Comportamiento](#4-patrones-de-comportamiento)
5. [Patrones de Frontend](#5-patrones-de-frontend)
6. [Patrones de Base de Datos](#6-patrones-de-base-datos)

---

## 1. PATRONES ARQUITECTÓNICOS

### **1.1 MVC (Model-View-Controller)** ✅

**Descripción**: Separación de responsabilidades en tres capas independientes.

**Implementación en el Sistema**:

```
┌─────────────────────────────────────────────────────────────┐
│                          VIEW                               │
│  React Components (Cliente) + JSF Pages (Admin)            │
│  • ProductCard.jsx                                          │
│  • CatalogPage.jsx                                          │
│  • promociones.jsp (JSF)                                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────┐
│                      CONTROLLER                             │
│  Spring MVC Controllers + JSF ManagedBeans                  │
│  • ProductoController.java                                  │
│  • PromocionBean.java (JSF)                                 │
│  • AuthController.java                                      │
└────────────────────────┬────────────────────────────────────┘
                         │ Service Layer
┌────────────────────────▼────────────────────────────────────┐
│                        MODEL                                │
│  Entities (JPA) + Services (Business Logic)                 │
│  • Producto.java (Entity)                                   │
│  • ProductoService.java (Business)                          │
│  • ProductoRepository.java (Data Access)                    │
└─────────────────────────────────────────────────────────────┘
```

**Ejemplo Concreto**:
```java
// MODEL
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    private Long producto_id;
    private String nombre;
    private BigDecimal precio_base;
    // ... getters/setters
}

// CONTROLLER
@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }
}

// VIEW (React)
function ProductDetailPage() {
    const [producto, setProducto] = useState(null);
    
    useEffect(() => {
        fetch(`/api/productos/${id}`)
            .then(res => res.json())
            .then(data => setProducto(data));
    }, [id]);
    
    return <div>{producto?.nombre} - ${producto?.precio_base}</div>;
}
```

**Beneficios**:
- ✅ Separación clara de responsabilidades
- ✅ Testeo independiente de cada capa
- ✅ Facilita trabajo en equipo (frontend vs backend)

---

### **1.2 Layered Architecture (N-Tier)** ✅

**Descripción**: Organización en capas con dependencias unidireccionales (top-down).

```
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                         │
│  Controllers + Views                                        │
│  Responsabilidad: Manejo de HTTP, validación de entrada    │
└────────────────────────┬────────────────────────────────────┘
                         │ Depende de ↓
┌────────────────────────▼────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  Business Logic                                             │
│  Responsabilidad: Reglas de negocio, transacciones         │
└────────────────────────┬────────────────────────────────────┘
                         │ Depende de ↓
┌────────────────────────▼────────────────────────────────────┐
│                   PERSISTENCE LAYER                         │
│  Repositories (Data Access)                                 │
│  Responsabilidad: Queries, CRUD, ORM mapping               │
└────────────────────────┬────────────────────────────────────┘
                         │ Depende de ↓
┌────────────────────────▼────────────────────────────────────┐
│                     DATA LAYER                              │
│  Database (MySQL)                                           │
│  Responsabilidad: Almacenamiento persistente                │
└─────────────────────────────────────────────────────────────┘
```

**Regla de Oro**: **Una capa solo puede depender de la capa inmediatamente inferior**.

**Ejemplo de Violación** ❌:
```java
// ❌ MAL: Controller accediendo directamente a Repository
@RestController
public class ProductoController {
    @Autowired
    private ProductoRepository productoRepository; // ❌ Violación!
    
    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findAll(); // ❌ Sin lógica de negocio
    }
}
```

**Ejemplo Correcto** ✅:
```java
// ✅ BIEN: Controller → Service → Repository
@RestController
public class ProductoController {
    @Autowired
    private ProductoService productoService; // ✅ Correcto
    
    @GetMapping
    public List<ProductoDTO> listar() {
        return productoService.obtenerProductosActivos(); // ✅ Con lógica
    }
}
```

---

### **1.3 Repository Pattern** ✅

**Descripción**: Abstracción sobre el acceso a datos, encapsula queries y lógica de persistencia.

**Implementación con Spring Data JPA**:

```java
// Interfaz del patrón Repository
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Spring Data genera implementación automáticamente
    List<Producto> findByActivoTrue();
    
    Optional<Producto> findByCodigo_producto(String codigo);
    
    // Query personalizada
    @Query("SELECT p FROM Producto p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Producto> buscarPorNombre(
        @Param("search") String search, 
        Pageable pageable
    );
    
    // Native query
    @Query(value = "SELECT * FROM productos WHERE precio_base < :precio", 
           nativeQuery = true)
    List<Producto> findCheaperThan(@Param("precio") BigDecimal precio);
}
```

**Uso en Service**:
```java
@Service
public class ProductoService {
    @Autowired
    private ProductoRepository repository; // Inyección de dependencia
    
    public List<ProductoDTO> obtenerProductosActivos() {
        return repository.findByActivoTrue()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
```

**Beneficios**:
- ✅ Código de acceso a datos centralizado
- ✅ Fácil de testear (mock del repository)
- ✅ Cambiar BD sin afectar servicios

---

### **1.4 DTO (Data Transfer Object)** ✅

**Descripción**: Objetos planos para transferir datos entre capas, evita exponer entidades directamente.

**Problema sin DTO** ❌:
```java
// ❌ MAL: Exponer entidad JPA directamente
@GetMapping("/{id}")
public Producto obtener(@PathVariable Long id) {
    return productoRepository.findById(id).orElse(null);
    // Problema 1: Expone estructura interna de BD
    // Problema 2: Lazy loading puede causar N+1 queries
    // Problema 3: JSON infinito con relaciones bidireccionales
}
```

**Solución con DTO** ✅:
```java
// DTO (solo campos necesarios)
public class ProductoDTO {
    private Long producto_id;
    private String nombre;
    private BigDecimal precio_base;
    private List<String> categorias; // Solo nombres
    private String imagenPrincipal;   // Solo URL
    
    // Constructor, getters, setters
}

// Mapper en Service
@Service
public class ProductoService {
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        
        return ProductoDTO.builder()
            .producto_id(producto.getProducto_id())
            .nombre(producto.getNombre())
            .precio_base(producto.getPrecio_base())
            .categorias(producto.getCategorias().stream()
                .map(Categoria::getNombre_categoria)
                .collect(Collectors.toList()))
            .imagenPrincipal(producto.getImagenPrincipal().getUrl())
            .build();
    }
}

// Controller retorna DTO
@GetMapping("/{id}")
public ResponseEntity<ProductoDTO> obtener(@PathVariable Long id) {
    return ResponseEntity.ok(productoService.obtenerPorId(id));
}
```

**Tipos de DTOs en el Sistema**:
```
ProductoDTO           # Respuesta completa
ProductoListDTO       # Vista simplificada para tablas
ProductoSaveDTO       # Creación/actualización (con validaciones)
```

---

## 2. PATRONES CREACIONALES

### **2.1 Dependency Injection (IoC Container)** ✅

**Descripción**: Spring gestiona la creación e inyección de objetos (beans).

**Formas de Inyección**:

```java
// 1. Constructor Injection (RECOMENDADO ✅)
@Service
public class ProductoService {
    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;
    
    // Spring inyecta automáticamente
    public ProductoService(ProductoRepository repository, 
                          CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }
}

// 2. Con Lombok @RequiredArgsConstructor (MÁS LIMPIO ✅)
@Service
@RequiredArgsConstructor  // Genera constructor con final fields
public class ProductoService {
    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;
    // No necesita constructor explícito!
}

// 3. Field Injection (EVITAR ⚠️)
@Service
public class ProductoService {
    @Autowired // ⚠️ Dificulta testing
    private ProductoRepository repository;
}

// 4. Setter Injection (RARA VEZ ⏳)
@Service
public class ProductoService {
    private ProductoRepository repository;
    
    @Autowired
    public void setRepository(ProductoRepository repository) {
        this.repository = repository;
    }
}
```

**Ventajas de Constructor Injection**:
- ✅ Inmutabilidad (final fields)
- ✅ Testing fácil (sin reflection)
- ✅ Detecta ciclos de dependencia al inicio

---

### **2.2 Factory Pattern** ✅

**Descripción**: Crea objetos sin exponer lógica de creación.

**Implementación en Auto-Creación de Variantes**:

```java
// EntityListener que actúa como Factory
@Component
public class VarianteProductoListener {
    
    @Autowired
    private VarianteProductoRepository varianteRepository;
    
    @PostPersist // Trigger after Producto is saved
    public void autoCrearVarianteDefault(Producto producto) {
        // Factory method: crea variante si no existe
        if (producto.getVariantes().isEmpty()) {
            VarianteProducto varianteDefault = crearVarianteDefault(producto);
            varianteRepository.save(varianteDefault);
        }
    }
    
    private VarianteProducto crearVarianteDefault(Producto producto) {
        VarianteProducto variante = new VarianteProducto();
        variante.setProducto(producto);
        variante.setSku(producto.getCodigo_producto() + "-DEFAULT");
        variante.setNombre_variante("Estándar");
        variante.setActiva(true);
        return variante;
    }
}
```

**Factory para DTOs**:
```java
public class ProductoDTO {
    // ...campos...
    
    // Factory method estático
    public static ProductoDTO fromEntity(Producto producto) {
        return ProductoDTO.builder()
            .producto_id(producto.getProducto_id())
            .nombre(producto.getNombre())
            .precio_base(producto.getPrecio_base())
            .categorias(producto.getCategorias().stream()
                .map(CategoriaDTO::fromEntity)
                .collect(Collectors.toList()))
            .build();
    }
}

// Uso
ProductoDTO dto = ProductoDTO.fromEntity(producto);
```

---

### **2.3 Builder Pattern** ✅

**Descripción**: Construcción fluida de objetos complejos.

**Con Lombok @Builder**:
```java
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    private Long producto_id;
    private String nombre;
    private BigDecimal precio_base;
    private BigDecimal peso_kg;
    // ...
}

// Uso
Producto producto = Producto.builder()
    .nombre("Silla Ergonómica")
    .precio_base(new BigDecimal("89990"))
    .peso_kg(new BigDecimal("12.5"))
    .activo(true)
    .visible(true)
    .build();
```

**Builder Manual (cuando necesitas validación)**:
```java
public class ProductoDTO {
    private Long producto_id;
    private String nombre;
    // ...
    
    public static class Builder {
        private ProductoDTO dto = new ProductoDTO();
        
        public Builder producto_id(Long id) {
            dto.producto_id = id;
            return this;
        }
        
        public Builder nombre(String nombre) {
            if (nombre == null || nombre.isBlank()) {
                throw new IllegalArgumentException("Nombre requerido");
            }
            dto.nombre = nombre;
            return this;
        }
        
        public ProductoDTO build() {
            // Validaciones finales
            if (dto.precio_base == null || dto.precio_base.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalStateException("Precio inválido");
            }
            return dto;
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}
```

---

## 3. PATRONES ESTRUCTURALES

### **3.1 Adapter Pattern** ✅

**Descripción**: Convierte una interfaz en otra compatible.

**Ejemplo: OAuth2 Adapter**:

```java
// Interfaz común
public interface AuthProvider {
    Cliente autenticar(String token);
}

// Adapter para Google
@Component
public class GoogleAuthAdapter implements AuthProvider {
    @Override
    public Cliente autenticar(String idToken) {
        // Decodifica token de Google
        JsonObject payload = decodeGoogleToken(idToken);
        
        // Convierte a formato interno
        Cliente cliente = new Cliente();
        cliente.setNombre(payload.get("given_name").getAsString());
        cliente.setApellido(payload.get("family_name").getAsString());
        cliente.setCorreo(payload.get("email").getAsString());
        cliente.setAvatar_url(payload.get("picture").getAsString());
        cliente.setOauth_provider("google");
        cliente.setOauth_id(payload.get("sub").getAsString());
        
        return cliente;
    }
}

// Adapter para Microsoft
@Component
public class MicrosoftAuthAdapter implements AuthProvider {
    @Override
    public Cliente autenticar(String idToken) {
        JsonObject payload = decodeMicrosoftToken(idToken);
        
        Cliente cliente = new Cliente();
        cliente.setNombre(payload.get("name").getAsString());
        cliente.setCorreo(payload.get("preferred_username").getAsString());
        cliente.setAvatar_url(payload.get("picture").getAsString());
        cliente.setOauth_provider("microsoft");
        cliente.setOauth_id(payload.get("oid").getAsString());
        
        return cliente;
    }
}

// Service usa adapters
@Service
public class ClienteService {
    @Autowired
    private Map<String, AuthProvider> authProviders;
    
    public Cliente loginOAuth(String provider, String token) {
        AuthProvider adapter = authProviders.get(provider + "AuthAdapter");
        if (adapter == null) {
            throw new UnsupportedOperationException("Provider no soportado");
        }
        
        Cliente cliente = adapter.autenticar(token);
        return guardarOActualizar(cliente);
    }
}
```

---

### **3.2 Facade Pattern** ✅

**Descripción**: Provee una interfaz simplificada para un sistema complejo.

**Ejemplo: PromocionService como Facade**:

```java
@Service
@Transactional
public class PromocionService {
    // Subsistemas internos
    private final ReglaDescuentoRepository reglaRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ClienteRepository clienteRepository;
    
    // Facade: método simplificado que coordina múltiples subsistemas
    public BigDecimal calcularDescuentoCarrito(CarritoDTO carrito) {
        // 1. Obtener promociones activas
        List<ReglaDescuento> promoActivas = 
            reglaRepository.findByActivaAndVigente(true, LocalDateTime.now());
        
        // 2. Para cada producto del carrito, buscar mejor descuento
        BigDecimal descuentoTotal = BigDecimal.ZERO;
        
        for (ItemCarritoDTO item : carrito.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow();
            
            // 3. Filtrar promociones aplicables
            BigDecimal mejorDescuento = promoActivas.stream()
                .filter(promo -> esAplicable(promo, producto, carrito.getClienteId()))
                .map(promo -> calcularDescuento(promo, item.getPrecio(), item.getCantidad()))
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
            
            descuentoTotal = descuentoTotal.add(mejorDescuento);
        }
        
        // 4. Aplicar descuento de envío si aplica
        if (hayPromocionEnvioGratis(promoActivas, carrito)) {
            descuentoTotal = descuentoTotal.add(carrito.getCostoEnvio());
        }
        
        return descuentoTotal;
    }
    
    // Métodos internos (ocultos al cliente del facade)
    private boolean esAplicable(ReglaDescuento regla, Producto producto, Long clienteId) {
        switch (regla.getAplicacion()) {
            case CATEGORIA:
                return producto.getCategorias().stream()
                    .anyMatch(cat -> cat.getCategoria_id().equals(regla.getCategoriaId()));
            case PRODUCTO:
                return producto.getProducto_id().equals(regla.getProductoId());
            case CLIENTE:
                return clienteId != null && clienteId.equals(regla.getClienteId());
            default:
                return true;
        }
    }
}
```

**Beneficio**: Cliente solo llama `calcularDescuentoCarrito()` sin conocer la complejidad interna.

---

### **3.3 Decorator Pattern** ⏳ (Futuro)

**Descripción**: Añade responsabilidades dinámicamente a objetos.

**Propuesta para Sistema de Notificaciones**:

```java
// Interfaz base
public interface Notificacion {
    void enviar(String mensaje, String destinatario);
}

// Implementación básica
@Component
public class EmailNotificacion implements Notificacion {
    @Override
    public void enviar(String mensaje, String destinatario) {
        // Enviar email simple
        emailService.send(destinatario, mensaje);
    }
}

// Decorator: Añade logging
public class LoggedNotificacion implements Notificacion {
    private final Notificacion wrapped;
    
    public LoggedNotificacion(Notificacion wrapped) {
        this.wrapped = wrapped;
    }
    
    @Override
    public void enviar(String mensaje, String destinatario) {
        log.info("Enviando notificación a: {}", destinatario);
        wrapped.enviar(mensaje, destinatario);
        log.info("Notificación enviada exitosamente");
    }
}

// Decorator: Añade retry
public class RetryNotificacion implements Notificacion {
    private final Notificacion wrapped;
    private final int maxRetries = 3;
    
    @Override
    public void enviar(String mensaje, String destinatario) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                wrapped.enviar(mensaje, destinatario);
                return;
            } catch (Exception e) {
                log.warn("Intento {} falló", i + 1);
            }
        }
        throw new RuntimeException("Falló después de " + maxRetries + " intentos");
    }
}

// Uso
Notificacion notif = new RetryNotificacion(
    new LoggedNotificacion(
        new EmailNotificacion()
    )
);

notif.enviar("Su pedido está listo", "cliente@email.com");
```

---

## 4. PATRONES DE COMPORTAMIENTO

### **4.1 Strategy Pattern** ✅

**Descripción**: Define familia de algoritmos intercambiables.

**Implementación en Sistema de Descuentos**:

```java
// Interfaz Strategy
public interface DescuentoStrategy {
    BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla);
}

// Strategy 1: Descuento por porcentaje
@Component
public class DescuentoPorcentajeStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        BigDecimal porcentaje = regla.getValorDescuento().divide(new BigDecimal("100"));
        return precioBase.multiply(porcentaje);
    }
}

// Strategy 2: Descuento monto fijo
@Component
public class DescuentoMontoFijoStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        BigDecimal descuento = regla.getValorDescuento();
        return descuento.min(precioBase); // No puede descontar más del precio
    }
}

// Strategy 3: Envío gratis
@Component
public class EnvioGratisStrategy implements DescuentoStrategy {
    @Override
    public BigDecimal calcular(BigDecimal precioBase, ReglaDescuento regla) {
        return precioBase; // Descuento 100% del envío
    }
}

// Context: Usa las strategies
@Service
public class PromocionService {
    @Autowired
    private Map<String, DescuentoStrategy> strategies;
    
    public BigDecimal calcularDescuento(ReglaDescuento regla, BigDecimal precio) {
        String strategyName = regla.getTipoDescuento().name().toLowerCase() + "Strategy";
        DescuentoStrategy strategy = strategies.get(strategyName);
        
        if (strategy == null) {
            throw new IllegalStateException("Strategy no encontrada: " + strategyName);
        }
        
        return strategy.calcular(precio, regla);
    }
}
```

**Configuración de Strategies como Map**:
```java
@Configuration
public class StrategyConfig {
    @Bean
    public Map<String, DescuentoStrategy> strategies(
        DescuentoPorcentajeStrategy porcentaje,
        DescuentoMontoFijoStrategy montoFijo,
        EnvioGratisStrategy envioGratis
    ) {
        Map<String, DescuentoStrategy> map = new HashMap<>();
        map.put("porcentajeStrategy", porcentaje);
        map.put("monto_fijoStrategy", montoFijo);
        map.put("envio_gratisStrategy", envioGratis);
        return map;
    }
}
```

---

### **4.2 Observer Pattern** ✅

**Descripción**: Notifica automáticamente a dependientes cuando cambia un estado.

**Implementación con Spring Events**:

```java
// Evento custom
public class PedidoCreadoEvent extends ApplicationEvent {
    private final Pedido pedido;
    
    public PedidoCreadoEvent(Object source, Pedido pedido) {
        super(source);
        this.pedido = pedido;
    }
    
    public Pedido getPedido() { return pedido; }
}

// Publisher: Publica evento
@Service
public class PedidoService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public Pedido crearPedido(CrearPedidoDTO dto) {
        Pedido pedido = new Pedido();
        // ...lógica de creación...
        Pedido saved = pedidoRepository.save(pedido);
        
        // Publicar evento
        eventPublisher.publishEvent(new PedidoCreadoEvent(this, saved));
        
        return saved;
    }
}

// Observer 1: Enviar email
@Component
public class EmailNotificationListener {
    @Autowired
    private EmailService emailService;
    
    @EventListener
    @Async
    public void onPedidoCreado(PedidoCreadoEvent event) {
        Pedido pedido = event.getPedido();
        emailService.enviarConfirmacionPedido(pedido);
    }
}

// Observer 2: Actualizar stock
@Component
public class InventarioListener {
    @Autowired
    private InventarioService inventarioService;
    
    @EventListener
    @Transactional
    public void onPedidoCreado(PedidoCreadoEvent event) {
        Pedido pedido = event.getPedido();
        for (DetallePedido detalle : pedido.getDetalles()) {
            inventarioService.descontarStock(
                detalle.getVariante_id(), 
                detalle.getCantidad()
            );
        }
    }
}

// Observer 3: Generar alarmas
@Component
public class AlarmaStockListener {
    @Autowired
    private AlarmaStockService alarmaService;
    
    @EventListener
    public void onPedidoCreado(PedidoCreadoEvent event) {
        // Verificar si alguna variante quedó con stock bajo
        alarmaService.verificarAlarmas();
    }
}
```

**Ventajas**:
- ✅ Desacoplamiento (PedidoService no conoce a los observers)
- ✅ Fácil añadir nuevos observers sin modificar código existente
- ✅ Procesamiento asíncrono con `@Async`

---

### **4.3 Template Method Pattern** ✅

**Descripción**: Define esqueleto de algoritmo, subclases implementan pasos específicos.

**Ejemplo: Generación de Reportes**:

```java
// Clase abstracta con template method
public abstract class AbstractReportGenerator {
    
    // Template method (final para evitar override)
    public final byte[] generarReporte(Map<String, Object> parametros) {
        // 1. Validar parámetros
        validarParametros(parametros);
        
        // 2. Obtener datos (implementado por subclase)
        List<Map<String, Object>> datos = obtenerDatos(parametros);
        
        // 3. Cargar template (implementado por subclase)
        JasperReport template = cargarTemplate();
        
        // 4. Compilar reporte
        JasperPrint print = JasperFillManager.fillReport(
            template, parametros, new JRMapCollectionDataSource(datos)
        );
        
        // 5. Exportar a formato (implementado por subclase)
        return exportar(print, parametros.get("formato"));
    }
    
    // Hook methods (implementados por subclases)
    protected abstract void validarParametros(Map<String, Object> parametros);
    protected abstract List<Map<String, Object>> obtenerDatos(Map<String, Object> parametros);
    protected abstract JasperReport cargarTemplate();
    
    // Método con implementación default
    protected byte[] exportar(JasperPrint print, Object formato) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        if ("PDF".equals(formato)) {
            JasperExportManager.exportReportToPdfStream(print, output);
        } else if ("EXCEL".equals(formato)) {
            JRXlsxExporter exporter = new JRXlsxExporter();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(output));
            exporter.exportReport();
        }
        return output.toByteArray();
    }
}

// Subclase concreta: Reporte de Inventario
@Component
public class InventarioReportGenerator extends AbstractReportGenerator {
    @Autowired
    private InventarioRepository inventarioRepository;
    
    @Override
    protected void validarParametros(Map<String, Object> parametros) {
        if (!parametros.containsKey("ubicacionId")) {
            throw new IllegalArgumentException("ubicacionId requerido");
        }
    }
    
    @Override
    protected List<Map<String, Object>> obtenerDatos(Map<String, Object> parametros) {
        Integer ubicacionId = (Integer) parametros.get("ubicacionId");
        return inventarioRepository.findByUbicacionId(ubicacionId);
    }
    
    @Override
    protected JasperReport cargarTemplate() {
        InputStream is = getClass().getResourceAsStream("/templates/inventario.jrxml");
        return JasperCompileManager.compileReport(is);
    }
}

// Subclase concreta: Reporte de Ventas
@Component
public class VentasReportGenerator extends AbstractReportGenerator {
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Override
    protected void validarParametros(Map<String, Object> parametros) {
        if (!parametros.containsKey("fechaInicio") || 
            !parametros.containsKey("fechaFin")) {
            throw new IllegalArgumentException("Fechas requeridas");
        }
    }
    
    @Override
    protected List<Map<String, Object>> obtenerDatos(Map<String, Object> parametros) {
        LocalDate inicio = (LocalDate) parametros.get("fechaInicio");
        LocalDate fin = (LocalDate) parametros.get("fechaFin");
        return pedidoRepository.findVentasEntreFechas(inicio, fin);
    }
    
    @Override
    protected JasperReport cargarTemplate() {
        InputStream is = getClass().getResourceAsStream("/templates/ventas.jrxml");
        return JasperCompileManager.compileReport(is);
    }
}
```

---

### **4.4 Command Pattern** ⏳ (Futuro)

**Descripción**: Encapsula una petición como objeto.

**Propuesta para Sistema de Auditoría**:

```java
// Interfaz Command
public interface Command {
    void execute();
    void undo();
    String getDescription();
}

// Command concreto: Ajustar inventario
public class AjustarInventarioCommand implements Command {
    private final InventarioService inventarioService;
    private final AjusteInventarioDTO ajuste;
    private Inventario estadoAnterior;
    
    public AjustarInventarioCommand(InventarioService service, AjusteInventarioDTO ajuste) {
        this.inventarioService = service;
        this.ajuste = ajuste;
    }
    
    @Override
    public void execute() {
        // Guardar estado anterior para undo
        estadoAnterior = inventarioService.obtenerInventario(ajuste.getInventarioId());
        
        // Ejecutar ajuste
        inventarioService.ajustar(ajuste);
        
        // Auditoría
        log.info("Ajuste ejecutado: {} unidades en inventario {}", 
                 ajuste.getCantidad(), ajuste.getInventarioId());
    }
    
    @Override
    public void undo() {
        if (estadoAnterior == null) {
            throw new IllegalStateException("No se puede deshacer, comando no ejecutado");
        }
        
        // Restaurar estado anterior
        inventarioService.restaurar(estadoAnterior);
        
        log.info("Ajuste deshecho en inventario {}", ajuste.getInventarioId());
    }
    
    @Override
    public String getDescription() {
        return String.format("Ajustar %d unidades en inventario %d", 
                             ajuste.getCantidad(), ajuste.getInventarioId());
    }
}

// Invoker: Ejecuta y registra commands
@Service
public class CommandExecutor {
    private final Stack<Command> history = new Stack<>();
    
    public void execute(Command command) {
        command.execute();
        history.push(command);
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            Command command = history.pop();
            command.undo();
        }
    }
    
    public List<String> getHistory() {
        return history.stream()
            .map(Command::getDescription)
            .collect(Collectors.toList());
    }
}
```

---

## 5. PATRONES DE FRONTEND

### **5.1 Container/Presentational Components** ✅

**Descripción**: Separa lógica de negocio (Container) de UI pura (Presentational).

**Ejemplo**:

```jsx
// PRESENTATIONAL: UI pura, sin lógica de negocio
function ProductCard({ producto, onAddToCart }) {
    return (
        <div className="card">
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <button onClick={() => onAddToCart(producto)}>
                Agregar al Carrito
            </button>
        </div>
    );
}

// CONTAINER: Maneja estado y lógica
function CatalogPage() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Lógica de negocio: fetch de API
        setLoading(true);
        fetch('/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data))
            .finally(() => setLoading(false));
    }, []);
    
    const handleAddToCart = (producto) => {
        // Lógica de negocio: validar stock, actualizar carrito
        if (producto.stock > 0) {
            setCarrito([...carrito, producto]);
            toast.success('Producto agregado');
        }
    };
    
    if (loading) return <Spinner />;
    
    return (
        <div className="catalog">
            {productos.map(producto => (
                <ProductCard 
                    key={producto.id}
                    producto={producto}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
}
```

---

### **5.2 Custom Hooks (Reusabilidad)** ✅

**Descripción**: Extrae lógica reutilizable en hooks personalizados.

**Ejemplo: useAuth Hook**:

```jsx
// Custom Hook
export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    
    return context;
}

// Uso en componentes
function ProductDetailPage() {
    const { isAuthenticated, user, login, logout } = useAuth();
    
    if (!isAuthenticated) {
        return <Redirect to="/login" />;
    }
    
    return <div>Bienvenido {user.nombre}</div>;
}
```

**Ejemplo: useFetch Hook**:

```jsx
// Custom Hook reutilizable
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [url]);
    
    return { data, loading, error };
}

// Uso
function ProductsPage() {
    const { data: productos, loading, error } = useFetch('/api/productos');
    
    if (loading) return <Spinner />;
    if (error) return <Alert variant="danger">{error.message}</Alert>;
    
    return (
        <div>
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
}
```

---

### **5.3 Context API (Estado Global)** ✅

**Descripción**: Evita prop drilling, estado compartido entre componentes.

```jsx
// 1. Crear Context
const CartContext = createContext();

// 2. Provider
export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    
    const addItem = (producto) => {
        setItems([...items, producto]);
    };
    
    const removeItem = (productoId) => {
        setItems(items.filter(item => item.id !== productoId));
    };
    
    const getTotalPrice = () => {
        return items.reduce((sum, item) => sum + item.precio, 0);
    };
    
    return (
        <CartContext.Provider value={{ items, addItem, removeItem, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

// 3. Hook personalizado
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
}

// 4. Uso en App
function App() {
    return (
        <CartProvider>
            <Header /> {/* Puede acceder al carrito */}
            <Routes>
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </CartProvider>
    );
}

// 5. Consumir en cualquier componente
function Header() {
    const { items } = useCart();
    
    return (
        <nav>
            <Link to="/cart">
                Carrito ({items.length})
            </Link>
        </nav>
    );
}
```

---

## 6. PATRONES DE BASE DE DATOS

### **6.1 Soft Delete** ✅

**Descripción**: Marcar registros como eliminados en lugar de borrarlos físicamente.

```java
@Entity
public class Producto {
    @Id
    private Long producto_id;
    
    private Boolean activo = true; // Soft delete flag
    
    // ...
}

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Query solo productos activos
    List<Producto> findByActivoTrue();
    
    // Override para soft delete
    @Query("UPDATE Producto p SET p.activo = false WHERE p.producto_id = :id")
    @Modifying
    void softDelete(@Param("id") Long id);
}

@Service
public class ProductoService {
    public void eliminarProducto(Long id) {
        // Soft delete en lugar de delete físico
        productoRepository.softDelete(id);
    }
    
    public void restaurarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException());
        producto.setActivo(true);
        productoRepository.save(producto);
    }
}
```

**Ventajas**:
- ✅ Recuperación de datos
- ✅ Auditoría completa
- ✅ Preserva integridad referencial

---

### **6.2 Audit Trail (Auditoría)** ✅

**Descripción**: Rastrea quién y cuándo modificó registros.

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Producto {
    @Id
    private Long producto_id;
    
    @CreatedDate
    private LocalDateTime fecha_creacion;
    
    @LastModifiedDate
    private LocalDateTime fecha_modificacion;
    
    @CreatedBy
    private String creado_por;
    
    @LastModifiedBy
    private String modificado_por;
}

// Configuración
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            // Obtener usuario actual del SecurityContext
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                return Optional.of(auth.getName());
            }
            return Optional.of("sistema");
        };
    }
}
```

---

## 📊 TABLA RESUMEN DE PATRONES

| Patrón | Implementado | Ubicación | Beneficio Principal |
|--------|--------------|-----------|---------------------|
| **MVC** | ✅ | Global | Separación de responsabilidades |
| **Layered** | ✅ | Backend | Mantenibilidad |
| **Repository** | ✅ | Data Access | Abstracción de BD |
| **DTO** | ✅ | API Layer | Desacoplamiento |
| **Dependency Injection** | ✅ | Spring | Testabilidad |
| **Factory** | ✅ | Variantes | Encapsulación de creación |
| **Builder** | ✅ | DTOs | Construcción fluida |
| **Adapter** | ✅ | OAuth2 | Compatibilidad de interfaces |
| **Facade** | ✅ | PromocionService | Simplificación |
| **Strategy** | ✅ | Descuentos | Algoritmos intercambiables |
| **Observer** | ✅ | Spring Events | Notificaciones desacopladas |
| **Template Method** | ✅ | Reportes | Reutilización de lógica |
| **Soft Delete** | ✅ | Entidades | Recuperación de datos |
| **Audit Trail** | ✅ | JPA | Trazabilidad |
| **Container/Presentational** | ✅ | React | Reusabilidad UI |
| **Custom Hooks** | ✅ | React | Lógica reutilizable |
| **Context API** | ✅ | Auth/Cart | Estado global |

---

**Última actualización**: 1 de diciembre de 2025  
**Versión del documento**: 1.0
