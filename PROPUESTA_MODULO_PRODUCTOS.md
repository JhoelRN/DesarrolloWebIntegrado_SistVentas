# 📦 PROPUESTA: MÓDULO DE PRODUCTOS Y CATÁLOGO

## 📊 ANÁLISIS DE BASE DE DATOS

### **Tablas involucradas:**

```sql
1. productos (tabla principal)
   - producto_id (PK)
   - codigo_producto (UNIQUE)
   - nombre_producto
   - descripcion_corta (500 chars)
   - ficha_tecnica_html (TEXT - HTML rico)
   - precio_unitario (decimal 10,2)
   - peso_kg (decimal 8,2)
   - volumen_m3 (decimal 8,4)
   - fecha_creacion (timestamp)

2. categorias
   - categoria_id (PK)
   - nombre (UNIQUE)
   - descripcion (TEXT)
   - categoria_padre_id (FK autorreferencial - para jerarquía)
   - visible_cliente (boolean)

3. producto_categoria (relación muchos a muchos)
   - producto_id (FK)
   - categoria_id (FK)
   - PRIMARY KEY compuesta

4. variantes_producto (SKU específicos)
   - variante_id (PK)
   - producto_id (FK)
   - sku (UNIQUE - identificador específico)
   - precio_base (decimal 10,2)
   - url_imagen_principal

5. atributos (Color, Tamaño, Material, etc.)
   - atributo_id (PK)
   - nombre_atributo (UNIQUE)

6. valores_atributo (Rojo, XL, Algodón, etc.)
   - valor_id (PK)
   - atributo_id (FK)
   - valor

7. variante_valor (relación muchos a muchos)
   - variante_id (FK)
   - valor_id (FK)
   - PRIMARY KEY compuesta
```

### **Estructura de datos propuesta:**

```
PRODUCTO (Alfombra Persa Oriental)
   ├── Información general
   │   ├── Código: ALF-001
   │   ├── Nombre: Alfombra Persa Oriental
   │   ├── Descripción corta
   │   ├── Ficha técnica (HTML)
   │   ├── Precio base: 150.00
   │   └── Peso/Volumen
   │
   ├── Categorías (múltiples)
   │   ├── Alfombras
   │   └── Alfombras Orientales
   │
   └── Variantes (SKUs específicos)
       ├── ALF-001-RJ-2X3 (Rojo, 2x3m) - S/ 150.00
       │   └── Atributos: Color=Rojo, Tamaño=2x3m
       ├── ALF-001-AZ-2X3 (Azul, 2x3m) - S/ 155.00
       │   └── Atributos: Color=Azul, Tamaño=2x3m
       └── ALF-001-RJ-3X4 (Rojo, 3x4m) - S/ 280.00
           └── Atributos: Color=Rojo, Tamaño=3x4m
```

---

## 🎯 ALCANCE DEL MÓDULO

### **FASE 1: CRUD Básico de Productos (Implementar primero)**

#### **Backend - Spring Boot:**

1. **Entities:**
   - `Producto.java`
   - `Categoria.java`
   - `Variante.java` (opcional para fase 1)

2. **DTOs:**
   - `ProductoDto` - Para listar/mostrar
   - `CreateProductoRequest` - Para crear
   - `UpdateProductoRequest` - Para actualizar
   - `CategoriaDto` - Para dropdown/select
   - `ProductoListDto` - Vista simplificada para tabla

3. **Repositories:**
   - `ProductoRepository extends JpaRepository`
   - `CategoriaRepository extends JpaRepository`
   - Queries custom: `findByActivoTrue()`, `findByCategoriaId()`, etc.

4. **Services:**
   - `ProductoService` - Lógica de negocio
   - `CategoriaService` - Gestión de categorías

5. **Controllers:**
   - `ProductoController` - REST endpoints `/api/admin/productos`
   - `CategoriaController` - REST endpoints `/api/admin/categorias`

#### **Frontend - React:**

1. **API Layer:**
   - `src/api/productos.js` - Funciones fetch para productos
   - `src/api/categorias.js` - Funciones fetch para categorías

2. **Pages:**
   - `ProductsPage.jsx` - Lista con tabla + CRUD
   - `CategoriesPage.jsx` - Gestión de categorías

3. **Components reutilizables:**
   - `ProductForm.jsx` - Formulario crear/editar producto
   - `CategoryTree.jsx` - Árbol jerárquico de categorías
   - `ProductTable.jsx` - Tabla con búsqueda/filtros

4. **UI/UX:**
   - Bootstrap 5 components
   - React Bootstrap (Table, Modal, Form, Button, Badge, etc.)
   - React Icons para iconografía

### **FASE 2: Variantes y Atributos (Siguiente iteración)**

- Sistema de SKU por variantes
- Atributos dinámicos (Color, Tamaño, etc.)
- Gestión de imágenes por variante
- Precios diferenciados por variante

---

## 🔧 PROPUESTA TÉCNICA DETALLADA

### **1. BACKEND - SPRING BOOT**

#### **1.1 Entity: Producto.java**

```java
@Entity
@Table(name = "productos")
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "producto_id")
    private Integer productoId;
    
    @Column(name = "codigo_producto", unique = true, length = 50)
    private String codigoProducto;
    
    @Column(name = "nombre_producto", nullable = false)
    private String nombreProducto;
    
    @Column(name = "descripcion_corta", length = 500)
    private String descripcionCorta;
    
    @Column(name = "ficha_tecnica_html", columnDefinition = "TEXT")
    private String fichaTecnicaHtml;
    
    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    @Column(name = "peso_kg", precision = 8, scale = 2, nullable = false)
    private BigDecimal pesoKg;
    
    @Column(name = "volumen_m3", precision = 8, scale = 4)
    private BigDecimal volumenM3;
    
    @Column(name = "fecha_creacion", updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
    
    // Relación con categorías (ManyToMany)
    @ManyToMany
    @JoinTable(
        name = "producto_categoria",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<Categoria> categorias = new HashSet<>();
    
    // Getters y Setters...
}
```

#### **1.2 Entity: Categoria.java**

```java
@Entity
@Table(name = "categorias")
public class Categoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categoria_id")
    private Integer categoriaId;
    
    @Column(name = "nombre", unique = true, nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "visible_cliente")
    private Boolean visibleCliente = true;
    
    // Autorreferencial para jerarquía (categoría padre)
    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private Categoria categoriaPadre;
    
    // Subcategorías
    @OneToMany(mappedBy = "categoriaPadre")
    private Set<Categoria> subcategorias = new HashSet<>();
    
    // Getters y Setters...
}
```

#### **1.3 DTOs:**

```java
// ProductoDto.java (completo para vista)
public class ProductoDto {
    public Integer productoId;
    public String codigoProducto;
    public String nombreProducto;
    public String descripcionCorta;
    public String fichaTecnicaHtml;
    public BigDecimal precioUnitario;
    public BigDecimal pesoKg;
    public BigDecimal volumenM3;
    public LocalDateTime fechaCreacion;
    public List<CategoriaDto> categorias;
}

// ProductoListDto.java (simplificado para tabla)
public class ProductoListDto {
    public Integer productoId;
    public String codigoProducto;
    public String nombreProducto;
    public BigDecimal precioUnitario;
    public String categoriasNombres; // "Alfombras, Decoración"
    public LocalDateTime fechaCreacion;
}

// CreateProductoRequest.java
public class CreateProductoRequest {
    public String codigoProducto;
    public String nombreProducto;
    public String descripcionCorta;
    public String fichaTecnicaHtml;
    public BigDecimal precioUnitario;
    public BigDecimal pesoKg;
    public BigDecimal volumenM3;
    public List<Integer> categoriaIds; // IDs de categorías seleccionadas
}

// UpdateProductoRequest.java (igual que Create)
public class UpdateProductoRequest {
    public String codigoProducto;
    public String nombreProducto;
    public String descripcionCorta;
    public String fichaTecnicaHtml;
    public BigDecimal precioUnitario;
    public BigDecimal pesoKg;
    public BigDecimal volumenM3;
    public List<Integer> categoriaIds;
}

// CategoriaDto.java
public class CategoriaDto {
    public Integer categoriaId;
    public String nombre;
    public String descripcion;
    public Boolean visibleCliente;
    public Integer categoriaPadreId;
    public String categoriaPadreNombre;
    public List<CategoriaDto> subcategorias; // Para árbol jerárquico
}
```

#### **1.4 Repository:**

```java
// ProductoRepository.java
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    // Buscar por código
    Optional<Producto> findByCodigoProducto(String codigo);
    
    // Verificar si código existe
    boolean existsByCodigoProducto(String codigo);
    
    // Buscar por nombre (búsqueda parcial)
    List<Producto> findByNombreProductoContainingIgnoreCase(String nombre);
    
    // Buscar por categoría
    @Query("SELECT p FROM Producto p JOIN p.categorias c WHERE c.categoriaId = :categoriaId")
    List<Producto> findByCategoriaId(@Param("categoriaId") Integer categoriaId);
    
    // Ordenar por fecha (más recientes primero)
    List<Producto> findAllByOrderByFechaCreacionDesc();
}

// CategoriaRepository.java
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
    // Buscar categorías raíz (sin padre)
    List<Categoria> findByCategoriaPadreIsNull();
    
    // Buscar subcategorías de una categoría
    List<Categoria> findByCategoriaPadre_CategoriaId(Integer padreId);
    
    // Buscar categorías visibles al cliente
    List<Categoria> findByVisibleClienteTrue();
    
    // Verificar si nombre existe
    boolean existsByNombre(String nombre);
}
```

#### **1.5 Service:**

```java
@Service
public class ProductoService {
    
    private final ProductoRepository productoRepo;
    private final CategoriaRepository categoriaRepo;
    
    // Listar todos los productos (simplificado para tabla)
    public List<ProductoListDto> getAllProductos() {
        return productoRepo.findAllByOrderByFechaCreacionDesc()
            .stream()
            .map(this::toListDto)
            .collect(Collectors.toList());
    }
    
    // Obtener producto completo por ID
    public ProductoDto getProductoById(Integer id) {
        Producto p = productoRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Producto no encontrado"
            ));
        return toDto(p);
    }
    
    // Crear producto
    public ProductoDto createProducto(CreateProductoRequest req) {
        // Validar código único
        if (productoRepo.existsByCodigoProducto(req.codigoProducto)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Código de producto ya existe"
            );
        }
        
        Producto p = new Producto();
        p.setCodigoProducto(req.codigoProducto);
        p.setNombreProducto(req.nombreProducto);
        p.setDescripcionCorta(req.descripcionCorta);
        p.setFichaTecnicaHtml(req.fichaTecnicaHtml);
        p.setPrecioUnitario(req.precioUnitario);
        p.setPesoKg(req.pesoKg);
        p.setVolumenM3(req.volumenM3);
        
        // Asignar categorías
        if (req.categoriaIds != null && !req.categoriaIds.isEmpty()) {
            Set<Categoria> categorias = req.categoriaIds.stream()
                .map(id -> categoriaRepo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Categoría no encontrada: " + id
                    )))
                .collect(Collectors.toSet());
            p.setCategorias(categorias);
        }
        
        Producto saved = productoRepo.save(p);
        return toDto(saved);
    }
    
    // Actualizar producto
    public ProductoDto updateProducto(Integer id, UpdateProductoRequest req) {
        Producto p = productoRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Producto no encontrado"
            ));
        
        // Validar código único (si cambió)
        if (!p.getCodigoProducto().equals(req.codigoProducto) &&
            productoRepo.existsByCodigoProducto(req.codigoProducto)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Código de producto ya existe"
            );
        }
        
        p.setCodigoProducto(req.codigoProducto);
        p.setNombreProducto(req.nombreProducto);
        p.setDescripcionCorta(req.descripcionCorta);
        p.setFichaTecnicaHtml(req.fichaTecnicaHtml);
        p.setPrecioUnitario(req.precioUnitario);
        p.setPesoKg(req.pesoKg);
        p.setVolumenM3(req.volumenM3);
        
        // Actualizar categorías
        p.getCategorias().clear();
        if (req.categoriaIds != null && !req.categoriaIds.isEmpty()) {
            Set<Categoria> categorias = req.categoriaIds.stream()
                .map(catId -> categoriaRepo.findById(catId).orElseThrow())
                .collect(Collectors.toSet());
            p.setCategorias(categorias);
        }
        
        Producto saved = productoRepo.save(p);
        return toDto(saved);
    }
    
    // Eliminar producto (soft delete futuro, ahora hard delete)
    public void deleteProducto(Integer id) {
        if (!productoRepo.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Producto no encontrado"
            );
        }
        productoRepo.deleteById(id);
    }
    
    // Mappers
    private ProductoDto toDto(Producto p) {
        ProductoDto dto = new ProductoDto();
        dto.productoId = p.getProductoId();
        dto.codigoProducto = p.getCodigoProducto();
        dto.nombreProducto = p.getNombreProducto();
        dto.descripcionCorta = p.getDescripcionCorta();
        dto.fichaTecnicaHtml = p.getFichaTecnicaHtml();
        dto.precioUnitario = p.getPrecioUnitario();
        dto.pesoKg = p.getPesoKg();
        dto.volumenM3 = p.getVolumenM3();
        dto.fechaCreacion = p.getFechaCreacion();
        
        // Mapear categorías
        dto.categorias = p.getCategorias().stream()
            .map(this::categoriaToDtoSimple)
            .collect(Collectors.toList());
        
        return dto;
    }
    
    private ProductoListDto toListDto(Producto p) {
        ProductoListDto dto = new ProductoListDto();
        dto.productoId = p.getProductoId();
        dto.codigoProducto = p.getCodigoProducto();
        dto.nombreProducto = p.getNombreProducto();
        dto.precioUnitario = p.getPrecioUnitario();
        dto.fechaCreacion = p.getFechaCreacion();
        
        // Concatenar nombres de categorías
        dto.categoriasNombres = p.getCategorias().stream()
            .map(Categoria::getNombre)
            .collect(Collectors.joining(", "));
        
        return dto;
    }
}
```

#### **1.6 Controller:**

```java
@RestController
@RequestMapping("/api/admin/productos")
@PreAuthorize("hasAuthority('ROLE_VER_PRODUCTOS')")
public class ProductoController {
    
    private final ProductoService productoService;
    
    @GetMapping
    public List<ProductoListDto> getAllProductos() {
        return productoService.getAllProductos();
    }
    
    @GetMapping("/{id}")
    public ProductoDto getProductoById(@PathVariable Integer id) {
        return productoService.getProductoById(id);
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CREAR_PRODUCTOS')")
    public ResponseEntity<ProductoDto> createProducto(@RequestBody CreateProductoRequest req) {
        ProductoDto dto = productoService.createProducto(req);
        return ResponseEntity.status(201).body(dto);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_EDITAR_PRODUCTOS')")
    public ProductoDto updateProducto(
        @PathVariable Integer id,
        @RequestBody UpdateProductoRequest req
    ) {
        return productoService.updateProducto(id, req);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ELIMINAR_PRODUCTOS')")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

### **2. FRONTEND - REACT**

#### **2.1 API Layer:**

```javascript
// src/api/productos.js
const API_BASE = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAllProductos = async () => {
  const res = await fetch(`${API_BASE}/admin/productos`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};

export const getProductoById = async (id) => {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};

export const createProducto = async (payload) => {
  const res = await fetch(`${API_BASE}/admin/productos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${errorText}`);
  }
  return await res.json();
};

export const updateProducto = async (id, payload) => {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteProducto = async (id) => {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return { success: true };
};
```

#### **2.2 ProductsPage.jsx (COMPLETA):**

```jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Form, Modal, Alert, Badge, InputGroup 
} from 'react-bootstrap';
import * as productoApi from '../../api/productos';
import * as categoriaApi from '../../api/categorias';
import PermissionGuard from '../../components/common/PermissionGuard';
import { usePermissions } from '../../hooks/usePermissions';

const ProductsPage = () => {
  const { canPerformAction } = usePermissions();
  
  // Estados
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    codigoProducto: '',
    nombreProducto: '',
    descripcionCorta: '',
    fichaTecnicaHtml: '',
    precioUnitario: '',
    pesoKg: '',
    volumenM3: '',
    categoriaIds: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        productoApi.getAllProductos(),
        categoriaApi.getAllCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error cargando datos: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parsear números
      const payload = {
        ...formData,
        precioUnitario: parseFloat(formData.precioUnitario),
        pesoKg: parseFloat(formData.pesoKg),
        volumenM3: formData.volumenM3 ? parseFloat(formData.volumenM3) : null
      };

      if (editingProducto) {
        await productoApi.updateProducto(editingProducto.productoId, payload);
        setSuccess('Producto actualizado exitosamente');
      } else {
        await productoApi.createProducto(payload);
        setSuccess('Producto creado exitosamente');
      }
      
      handleCloseModal();
      await loadData();
    } catch (err) {
      setError(`Error ${editingProducto ? 'actualizando' : 'creando'} producto: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setFormData({
      codigoProducto: producto.codigoProducto,
      nombreProducto: producto.nombreProducto,
      descripcionCorta: producto.descripcionCorta || '',
      fichaTecnicaHtml: producto.fichaTecnicaHtml || '',
      precioUnitario: producto.precioUnitario.toString(),
      pesoKg: producto.pesoKg.toString(),
      volumenM3: producto.volumenM3 ? producto.volumenM3.toString() : '',
      categoriaIds: producto.categorias?.map(c => c.categoriaId) || []
    });
    setShowModal(true);
  };

  const handleDeleteProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productoApi.deleteProducto(id);
      setSuccess('Producto eliminado exitosamente');
      await loadData();
    } catch (err) {
      setError('Error eliminando producto: ' + err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
    setFormData({
      codigoProducto: '',
      nombreProducto: '',
      descripcionCorta: '',
      fichaTecnicaHtml: '',
      precioUnitario: '',
      pesoKg: '',
      volumenM3: '',
      categoriaIds: []
    });
  };

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter(p =>
    p.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Gestión de Productos</h1>
            <PermissionGuard requiredPermission="CREAR_PRODUCTOS">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Nuevo Producto
              </Button>
            </PermissionGuard>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Barra de búsqueda */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            Productos Registrados ({filteredProductos.length})
          </h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categorías</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map(producto => (
                <tr key={producto.productoId}>
                  <td><code>{producto.codigoProducto}</code></td>
                  <td>{producto.nombreProducto}</td>
                  <td>S/ {producto.precioUnitario.toFixed(2)}</td>
                  <td>
                    {producto.categoriasNombres || 'Sin categoría'}
                  </td>
                  <td>{new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <PermissionGuard requiredPermission="EDITAR_PRODUCTOS">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditProducto(producto)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard requiredPermission="ELIMINAR_PRODUCTOS">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteProducto(producto.productoId)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
              {filteredProductos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProducto ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.codigoProducto}
                    onChange={(e) => setFormData({...formData, codigoProducto: e.target.value})}
                    required
                    placeholder="ALF-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Unitario (S/) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.precioUnitario}
                    onChange={(e) => setFormData({...formData, precioUnitario: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Producto *</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombreProducto}
                onChange={(e) => setFormData({...formData, nombreProducto: e.target.value})}
                required
                placeholder="Alfombra Persa Oriental"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción Corta</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                maxLength={500}
                value={formData.descripcionCorta}
                onChange={(e) => setFormData({...formData, descripcionCorta: e.target.value})}
                placeholder="Descripción breve del producto (máx. 500 caracteres)"
              />
              <Form.Text className="text-muted">
                {formData.descripcionCorta.length}/500 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ficha Técnica (HTML)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.fichaTecnicaHtml}
                onChange={(e) => setFormData({...formData, fichaTecnicaHtml: e.target.value})}
                placeholder="<p>Especificaciones técnicas...</p>"
              />
              <Form.Text className="text-muted">
                Puedes usar HTML para dar formato
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.pesoKg}
                    onChange={(e) => setFormData({...formData, pesoKg: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Volumen (m³)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.0001"
                    value={formData.volumenM3}
                    onChange={(e) => setFormData({...formData, volumenM3: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Categorías *</Form.Label>
              <Form.Select
                multiple
                value={formData.categoriaIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  setFormData({...formData, categoriaIds: selected});
                }}
                size={5}
              >
                {categorias.map(cat => (
                  <option key={cat.categoriaId} value={cat.categoriaId}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Mantén Ctrl para seleccionar múltiples categorías
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading 
                ? (editingProducto ? 'Actualizando...' : 'Creando...') 
                : (editingProducto ? 'Actualizar Producto' : 'Crear Producto')
              }
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProductsPage;
```

---

## 🎨 COMPONENTES BOOTSTRAP UTILIZADOS

### **React Bootstrap Components:**

1. **Container** - Layout responsive
2. **Row / Col** - Grid system
3. **Card** - Contenedores para tabla y formularios
4. **Table** - Tabla de productos con `striped bordered hover responsive`
5. **Button** - Botones con variantes `primary`, `secondary`, `outline-*`
6. **Form** - Formularios con validación
   - `Form.Control` - Inputs de texto, número, textarea
   - `Form.Select` - Select múltiple para categorías
   - `Form.Group` - Agrupación de campos
   - `Form.Label` - Etiquetas
   - `Form.Text` - Texto de ayuda
7. **Modal** - Ventanas modales para crear/editar
8. **Alert** - Mensajes de éxito/error con `dismissible`
9. **Badge** - Para mostrar estados/etiquetas
10. **InputGroup** - Barra de búsqueda con ícono

### **Bootstrap Icons (via CDN o npm):**

```html
<!-- En index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```

Íconos usados:
- `bi-plus-circle` - Nuevo producto
- `bi-pencil` - Editar
- `bi-trash` - Eliminar
- `bi-search` - Búsqueda
- `bi-box` - Productos

---

## ✅ VALIDACIONES Y REGLAS DE NEGOCIO

### **Backend:**

1. ✅ **Código único:** No permitir códigos duplicados
2. ✅ **Nombre obligatorio:** 255 caracteres máx
3. ✅ **Precio válido:** Decimal positivo
4. ✅ **Peso obligatorio:** Decimal positivo
5. ✅ **Categorías existentes:** Validar que IDs existan
6. ✅ **Descripción corta:** 500 caracteres máx

### **Frontend:**

1. ✅ **Required fields:** HTML5 validation
2. ✅ **Formato numérico:** type="number" con step
3. ✅ **Contador de caracteres:** Para descripción corta
4. ✅ **Select múltiple:** Ctrl+Click para categorías
5. ✅ **Confirmación de eliminación:** window.confirm()
6. ✅ **Feedback visual:** Alerts para éxito/error

---

## 🚀 PASOS DE IMPLEMENTACIÓN

### **Orden sugerido:**

1. ✅ **Backend:**
   1. Crear Entities (Producto, Categoria)
   2. Crear Repositories
   3. Crear DTOs
   4. Crear Services
   5. Crear Controllers
   6. Probar endpoints con Postman/curl

2. ✅ **Frontend:**
   1. Crear API layer (productos.js, categorias.js)
   2. Crear ProductsPage completa
   3. Actualizar AdminRouter (ya está)
   4. Agregar link en LayoutAdmin (ya está)
   5. Probar flujo completo

3. ✅ **Testing:**
   1. Crear productos con diferentes categorías
   2. Editar y actualizar
   3. Eliminar
   4. Búsqueda
   5. Validar permisos

---

## ❓ PREGUNTAS PARA VALIDAR

### **1. ¿Sobre el modelo de datos?**

- ¿Un producto DEBE tener al menos una categoría o puede estar sin categoría?
- ¿Necesitamos campo `activo` para soft delete en productos?
- ¿El campo `ficha_tecnica_html` lo usarán con editor WYSIWYG o solo textarea?

### **2. ¿Sobre funcionalidades?**

- ¿Implementamos primero solo CRUD básico y luego variantes?
- ¿Necesitan búsqueda avanzada por filtros (precio, categoría)?
- ¿Quieren paginación o cargar todos los productos?

### **3. ¿Sobre UX?**

- ¿Preferencia modal o página separada para crear/editar?
- ¿Vista de tabla o cards para listar productos?
- ¿Upload de imágenes en fase 1 o fase 2?

### **4. ¿Sobre categorías?**

- ¿Las categorías se gestionan en página separada o desde productos?
- ¿Necesitan drag & drop para ordenar categorías?
- ¿Árbol desplegable o select flat?

---

## 📝 NOTAS ADICIONALES

### **Consideraciones futuras (FASE 2):**

1. **Variantes y SKU:**
   - Gestión de atributos dinámicos
   - Imágenes por variante
   - Stock por variante

2. **Imágenes:**
   - Upload de archivos
   - Galería de imágenes
   - Imagen principal destacada

3. **SEO:**
   - Slugs amigables
   - Meta descriptions
   - Alt text para imágenes

4. **Filtros avanzados:**
   - Por rango de precios
   - Por categoría múltiple
   - Por disponibilidad

---

**¿Qué aspectos quieres que ajustemos antes de implementar?**
