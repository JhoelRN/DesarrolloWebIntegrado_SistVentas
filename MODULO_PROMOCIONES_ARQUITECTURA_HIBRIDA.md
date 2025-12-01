# MÓDULO DE PROMOCIONES - ARQUITECTURA HÍBRIDA
## Sistema de Gestión de Descuentos y Campañas

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Persistencia de Bases de Datos](#persistencia-de-bases-de-datos)
6. [Navegación y Rutas](#navegación-y-rutas)
7. [Flujos de Datos](#flujos-de-datos)
8. [Guía de Uso](#guía-de-uso)

---

## 🎯 VISIÓN GENERAL

El **Módulo de Promociones** es un sistema completo de gestión de descuentos y campañas comerciales implementado con **arquitectura híbrida** que integra:

- **React** (Frontend moderno)
- **JSF + Facelets** (Vista tradicional JavaEE)
- **Spring Boot REST** (Backend API)
- **JPA/Hibernate** (Persistencia)
- **MySQL** (Base de datos)

### Características Principales

✅ CRUD completo de promociones (Crear, Leer, Actualizar, Eliminar)  
✅ Tipos de descuento: Porcentaje, Monto Fijo, 2x1, Envío Gratis  
✅ Programación temporal de promociones  
✅ Estadísticas en tiempo real  
✅ Búsqueda y filtrado avanzado  
✅ Calculadora de descuentos  
✅ Validaciones frontend y backend  
✅ Doble interfaz (React + JSF)  

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Patrón MVC (Model-View-Controller)

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                     │
├───────────────────────────────┬─────────────────────────────┤
│  React + Vite (Puerto 5173)   │  JSF + Facelets (8081)      │
│  - PromotionsPage.jsx         │  - promociones.xhtml        │
│  - Bootstrap UI/UX            │  - PrimeFaces Components    │
│  - Ajax (Axios)               │  - Ajax JSF                 │
└───────────────────────────────┴─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE CONTROLADOR                       │
├───────────────────────────────┬─────────────────────────────┤
│  REST Controller (Spring)     │  Managed Bean (JSF)         │
│  - PromocionController.java   │  - PromocionManagedBean     │
│  - @RestController            │  - @ViewScoped              │
│  - GET/POST/PUT/DELETE        │  - Action Methods           │
└───────────────────────────────┴─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE SERVICIO                         │
│  - PromocionService.java (Patrón Facade)                     │
│  - Lógica de negocio                                         │
│  - Validaciones                                              │
│  - Transacciones                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PERSISTENCIA                       │
│  - ReglaDescuentoRepository.java (Patrón DAO)                │
│  - Spring Data JPA                                           │
│  - Consultas personalizadas (JPQL)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                            │
│  - ReglaDescuento.java (Entity JPA)                          │
│  - Tabla: reglas_descuento (MySQL)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 FRONTEND

### 1. Arquitectura y Modelo de Desarrollo

**Patrones Implementados:**
- **Component-Based Architecture** (React)
- **Separation of Concerns** (UI / Logic / Data)
- **Service Layer Pattern** (API abstraction)
- **State Management** (React Hooks)

### 2. Prototipos UX/UI y Documentación

**Interfaz React (PromotionsPage.jsx):**
- Diseño responsive con Bootstrap 5
- Tabla interactiva con paginación
- Modal para crear/editar promociones
- Filtros y búsqueda en tiempo real
- Badges de estado dinámicos
- Estadísticas visuales con cards

**Interfaz JSF (promociones.xhtml):**
- Componentes PrimeFaces/BootFaces
- DataTable con sorting y filtrado
- Dialog modal para formularios
- Ajax para actualizaciones parciales
- Calendario date-picker

### 3. Reportes e Informes

**Estadísticas Disponibles:**
```javascript
{
  totalPromociones: Number,
  promocionesActivas: Number,
  promocionesInactivas: Number,
  proximasExpirar: Number
}
```

### 4. JSF & Frontend Frameworks

**Tecnologías:**
- **React 18.x** - Framework UI moderno
- **Vite** - Build tool
- **JSF 3.0** - JavaServer Faces
- **PrimeFaces** - Componente library JSF
- **BootFaces** - Bootstrap para JSF

### 5. Dependencias de Comunicación y UI/UX

**Frontend React (package.json):**
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-bootstrap": "^2.x",
    "axios": "^1.x",
    "react-router-dom": "^6.x"
  }
}
```

**Backend Maven (pom.xml):**
```xml
<!-- Spring Boot Web (REST APIs) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JSF Implementation (opcional para vista híbrida) -->
<dependency>
    <groupId>org.glassfish</groupId>
    <artifactId>jakarta.faces</artifactId>
    <version>3.0.0</version>
</dependency>

<!-- PrimeFaces (componentes JSF) -->
<dependency>
    <groupId>org.primefaces</groupId>
    <artifactId>primefaces</artifactId>
    <version>12.0.0</version>
</dependency>
```

### 6. Pages Navigation

**Rutas React:**
```
/admin/promotions → PromotionsPage.jsx
```

**Rutas JSF:**
```
http://localhost:8081/promociones.xhtml
```

### 7. Facelets (*.xhtml)

**Estructura del Facelet:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns:h="jakarta.faces.html"
      xmlns:p="http://primefaces.org/ui">
  <h:head>...</h:head>
  <h:body>
    <h:form>
      <p:dataTable value="#{promocionBean.promociones}">
        <!-- Columns -->
      </p:dataTable>
    </h:form>
  </h:body>
</html>
```

### 8. Ajax - jQuery Métodos (GET/POST/PUT)

**Cliente React (promociones.js):**
```javascript
// GET - Obtener todas
export const obtenerPromociones = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// POST - Crear
export const crearPromocion = async (data) => {
  const response = await axios.post(`${API_URL}`, data);
  return response.data;
};

// PUT - Actualizar
export const actualizarPromocion = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// DELETE - Eliminar
export const eliminarPromocion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
```

**JSF Ajax:**
```xml
<p:commandButton 
    action="#{promocionBean.crearPromocion}"
    update=":formPrincipal:tablaPromociones"
    oncomplete="PF('dialog').hide()">
  <p:ajax event="click" process="@form"/>
</p:commandButton>
```

### 9. BootFaces

**Ejemplo de uso:**
```xml
<b:container>
  <b:row>
    <b:column col-md="6">
      <b:inputText value="#{promocionBean.filtroNombre}"/>
    </b:column>
  </b:row>
</b:container>
```

### 10. RESTful APIs Vista + Servicio

**Endpoints Disponibles:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/promociones` | Obtener todas las promociones |
| GET | `/api/promociones/activas` | Obtener solo activas (público) |
| GET | `/api/promociones/{id}` | Obtener una promoción |
| POST | `/api/promociones` | Crear nueva promoción |
| PUT | `/api/promociones/{id}` | Actualizar promoción |
| DELETE | `/api/promociones/{id}` | Eliminar promoción |
| GET | `/api/promociones/buscar?nombre={x}` | Buscar por nombre |
| GET | `/api/promociones/tipo/{tipo}` | Filtrar por tipo |
| GET | `/api/promociones/estadisticas` | Obtener estadísticas |
| POST | `/api/promociones/{id}/calcular-descuento` | Calcular descuento |

---

## 🔧 BACKEND

### 1. Arquitectura y Modelo de Desarrollo Impulsado por Patrones

**Patrones Implementados:**
- **MVC** (Model-View-Controller)
- **DAO** (Data Access Object) - Repository
- **DTO** (Data Transfer Object)
- **Facade** (Service Layer)
- **Entity** (JPA Domain Model)
- **Dependency Injection** (Spring)
- **RESTful API** (Richardson Maturity Model Level 2)

### 2. Diagrama de Clases

```
┌────────────────────────────┐
│   ReglaDescuento (Entity)  │
├────────────────────────────┤
│ - reglaId: Integer         │
│ - nombreRegla: String      │
│ - tipoDescuento: Enum      │
│ - valorDescuento: BigDecimal│
│ - acumulable: Boolean      │
│ - exclusivo: Boolean       │
│ - fechaInicio: LocalDateTime│
│ - fechaFin: LocalDateTime  │
├────────────────────────────┤
│ + isActiva(): boolean      │
│ + calcularDescuento(): BD  │
└────────────────────────────┘
          ▲
          │
┌─────────┴──────────────────┐
│ ReglaDescuentoRepository   │
├────────────────────────────┤
│ extends JpaRepository      │
├────────────────────────────┤
│ + findPromocionesActivas() │
│ + findByNombre()           │
│ + findByTipo()             │
└────────────────────────────┘
          ▲
          │
┌─────────┴──────────────────┐
│    PromocionService        │
├────────────────────────────┤
│ - repository: Repository   │
├────────────────────────────┤
│ + obtenerPromociones()     │
│ + crearPromocion()         │
│ + actualizarPromocion()    │
│ + eliminarPromocion()      │
│ + obtenerEstadisticas()    │
└────────────────────────────┘
          ▲
          │
┌─────────┴──────────────────┬────────────────────────────┐
│   PromocionController      │  PromocionManagedBean      │
├────────────────────────────┼────────────────────────────┤
│ @RestController            │ @ViewScoped                │
│ - service: Service         │ - service: Service         │
├────────────────────────────┼────────────────────────────┤
│ + GET /api/promociones     │ + cargarPromociones()      │
│ + POST /api/promociones    │ + crearPromocion()         │
│ + PUT /api/promociones/:id │ + actualizarPromocion()    │
│ + DELETE /api/promociones  │ + eliminarPromocion()      │
└────────────────────────────┴────────────────────────────┘
```

### 3. Java Server Pages

**No aplicable** - Este proyecto usa Spring Boot REST + JSF Facelets (no JSP tradicional)

### 4. Diseño de Patrones

**DAO Pattern (Repository):**
```java
@Repository
public interface ReglaDescuentoRepository 
    extends JpaRepository<ReglaDescuento, Integer> {
    
    List<ReglaDescuento> findByNombreReglaContainingIgnoreCase(String nombre);
    
    @Query("SELECT r FROM ReglaDescuento r WHERE ...")
    List<ReglaDescuento> findPromocionesActivas(LocalDateTime ahora);
}
```

**DTO Pattern:**
```java
@Data
@Builder
public class PromocionDTO {
    private Integer reglaId;
    private String nombreRegla;
    // ... otros campos
    
    public static PromocionDTO fromEntity(ReglaDescuento entity) {
        // Conversión Entity → DTO
    }
    
    public ReglaDescuento toEntity() {
        // Conversión DTO → Entity
    }
}
```

**Facade Pattern (Service):**
```java
@Service
@Transactional
public class PromocionService {
    private final ReglaDescuentoRepository repository;
    
    public List<PromocionDTO> obtenerTodasPromociones() {
        return repository.findAll().stream()
            .map(PromocionDTO::fromEntity)
            .collect(Collectors.toList());
    }
}
```

**MVC Pattern:**
```java
@RestController
@RequestMapping("/api/promociones")
public class PromocionController {
    private final PromocionService promocionService;
    
    @GetMapping
    public ResponseEntity<List<PromocionDTO>> obtenerTodas() {
        return ResponseEntity.ok(promocionService.obtenerTodasPromociones());
    }
}
```

### 5. Backend Frameworks

- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistencia
- **Spring Security** - Autenticación/Autorización
- **Spring Web** - REST APIs
- **Hibernate** - ORM
- **Lombok** - Reducción de boilerplate
- **Bean Validation** - Validaciones

### 6. Managed Beans

```java
@Component("promocionBean")
@ViewScoped
public class PromocionManagedBean implements Serializable {
    
    @Autowired
    private PromocionService promocionService;
    
    private List<PromocionDTO> promociones;
    private PromocionDTO nuevaPromocion;
    
    @PostConstruct
    public void init() {
        cargarPromociones();
    }
    
    public void cargarPromociones() {
        promociones = promocionService.obtenerTodasPromociones();
    }
    
    public void crearPromocion() {
        promocionService.crearPromocion(nuevaPromocion);
        cargarPromociones();
    }
}
```

### 7. Dependencias de Servicios y Lógica Backend (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- JWT (para autenticación) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
```

### 8. JSF Data Tables

```xml
<p:dataTable 
    value="#{promocionBean.promociones}"
    var="promo"
    paginator="true"
    rows="10">
    
    <p:column headerText="ID">
        <h:outputText value="#{promo.reglaId}"/>
    </p:column>
    
    <p:column headerText="Nombre">
        <h:outputText value="#{promo.nombreRegla}"/>
    </p:column>
    
    <!-- Más columnas... -->
</p:dataTable>
```

### 9. Ajax - WebServlet

**No aplica directamente** - Se usa Spring MVC `@Controller` en lugar de Servlets tradicionales.

El equivalente es `@RestController` para REST APIs:

```java
@RestController
@RequestMapping("/api/promociones")
public class PromocionController {
    
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PromocionDTO dto) {
        // Lógica...
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }
}
```

### 10. RESTful APIs - Modelo - Controlador + Servicio

**Flujo completo:**

```
Cliente (React/JSF)
    │
    ▼ HTTP POST /api/promociones
PromocionController.crear()
    │
    ▼ Validación
PromocionService.crearPromocion(DTO)
    │
    ▼ Conversión DTO → Entity
ReglaDescuentoRepository.save(Entity)
    │
    ▼ SQL INSERT
Base de Datos MySQL
    │
    ▼ Entity guardada
PromocionService (convierte Entity → DTO)
    │
    ▼ ResponseEntity<DTO>
Cliente recibe JSON
```

---

## 💾 PERSISTENCIA DE BASES DE DATOS

### 1. Arquitectura y Modelo de Desarrollo Patrones BBDD

**Patrones:**
- **Active Record** (via JPA)
- **Repository Pattern** (Spring Data)
- **Unit of Work** (Transacciones JPA)
- **Query Object** (JPQL)

### 2. Base de Datos, Diccionario de Datos

**Tabla: reglas_descuento**

| Campo | Tipo | Null | Key | Descripción |
|-------|------|------|-----|-------------|
| regla_id | INT | NO | PRI | ID autoincrementable (PK) |
| nombre_regla | VARCHAR(100) | NO | | Nombre descriptivo de la promoción |
| tipo_descuento | ENUM | NO | | 'Porcentaje', 'Monto Fijo', '2x1', 'Envio Gratis' |
| valor_descuento | DECIMAL(10,2) | NO | | Valor del descuento según tipo |
| acumulable | TINYINT(1) | YES | | Puede combinarse con otras promos (default: 1) |
| exclusivo | TINYINT(1) | YES | | No puede combinarse (default: 0) |
| fecha_inicio | TIMESTAMP | YES | | Fecha de inicio de vigencia |
| fecha_fin | TIMESTAMP | YES | | Fecha de fin de vigencia |
| segmentacion_json | JSON | YES | | Reglas de segmentación (opcional) |

**Índices:**
- PRIMARY KEY: regla_id
- INDEX: fecha_inicio, fecha_fin (para consultas de promociones activas)
- INDEX: tipo_descuento (para filtrado)

### 3. Patrones de Diseño BBDD

**Normalización:** 3ra Forma Normal (3FN)
- Tabla independiente para promociones
- Sin redundancia de datos
- Campos atómicos

**Integridad Referencial:**
```sql
-- Si se relaciona con productos (opcional futuro):
ALTER TABLE productos_promociones 
ADD CONSTRAINT fk_promocion 
FOREIGN KEY (regla_id) REFERENCES reglas_descuento(regla_id)
ON DELETE CASCADE;
```

### 4. Configuración JSF Persistencia BBDD

**application.properties (Spring Boot):**
```properties
# DataSource MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/macrosur_ecommerce
spring.datasource.username=root
spring.datasource.password=admin
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Pool de conexiones
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### 5. Dependencias de Conexión y Operaciones BBDD (pom.xml)

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- HikariCP (Pool de conexiones) - Incluido en Spring Boot -->
```

### 6. Configuración Unidad de Persistencia (persistence.xml)

**No necesario con Spring Boot** - La configuración se hace via `application.properties`

Si se usara JPA puro (sin Spring Boot):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
    xmlns="http://xmlns.jcp.org/xml/ns/persistence">
    
    <persistence-unit name="PromocionPU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <class>com.macrosur.ecommerce.entity.ReglaDescuento</class>
        
        <properties>
            <property name="jakarta.persistence.jdbc.url" 
                value="jdbc:mysql://localhost:3306/macrosur_ecommerce"/>
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <property name="jakarta.persistence.jdbc.password" value="admin"/>
            <property name="jakarta.persistence.jdbc.driver" 
                value="com.mysql.cj.jdbc.Driver"/>
            <property name="hibernate.dialect" 
                value="org.hibernate.dialect.MySQL8Dialect"/>
        </properties>
    </persistence-unit>
</persistence>
```

### 7. Conexión BBDD

**Entity JPA:**
```java
@Entity
@Table(name = "reglas_descuento")
public class ReglaDescuento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regla_id")
    private Integer reglaId;
    
    @Column(name = "nombre_regla", nullable = false)
    private String nombreRegla;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_descuento")
    private TipoDescuento tipoDescuento;
    
    // ... más campos
}
```

**Repository (DAO):**
```java
@Repository
public interface ReglaDescuentoRepository 
    extends JpaRepository<ReglaDescuento, Integer> {
    
    // Spring Data genera automáticamente las implementaciones
    List<ReglaDescuento> findByNombreReglaContaining(String nombre);
    
    // Consultas personalizadas con JPQL
    @Query("SELECT r FROM ReglaDescuento r WHERE r.fechaFin >= :ahora")
    List<ReglaDescuento> findActivas(@Param("ahora") LocalDateTime ahora);
}
```

### 8. Scripts y Backups

**Script de creación (ya existe en el sistema):**
```sql
-- Ubicación: macrosur_ecommerce_DB/CURRENT_SCHEMA_ONLY_20251125_085104.sql

CREATE TABLE `reglas_descuento` (
  `regla_id` int NOT NULL AUTO_INCREMENT,
  `nombre_regla` varchar(100) NOT NULL,
  `tipo_descuento` enum('Porcentaje','Monto Fijo','2x1','Envio Gratis') NOT NULL,
  `valor_descuento` decimal(10,2) NOT NULL,
  `acumulable` tinyint(1) DEFAULT '1',
  `exclusivo` tinyint(1) DEFAULT '0',
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `segmentacion_json` json DEFAULT NULL,
  PRIMARY KEY (`regla_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Script de datos de prueba:**
```sql
-- Insertar promociones de ejemplo
INSERT INTO reglas_descuento 
  (nombre_regla, tipo_descuento, valor_descuento, acumulable, fecha_inicio, fecha_fin)
VALUES
  ('Black Friday 2024', 'Porcentaje', 30.00, 0, '2024-11-25 00:00:00', '2024-11-30 23:59:59'),
  ('Cyber Monday', 'Porcentaje', 25.00, 0, '2024-12-01 00:00:00', '2024-12-03 23:59:59'),
  ('Envío Gratis Verano', 'Envio Gratis', 0.00, 1, '2024-12-01 00:00:00', '2025-03-01 23:59:59'),
  ('2x1 Seleccionados', '2x1', 0.00, 0, '2024-12-01 00:00:00', '2024-12-31 23:59:59'),
  ('Descuento Fijo $5000', 'Monto Fijo', 5000.00, 1, NULL, NULL);
```

**Backup automático:**
```bash
# PowerShell script para backup
mysqldump -u root -p macrosur_ecommerce reglas_descuento > backup_promociones_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

---

## 🧭 NAVEGACIÓN Y RUTAS

### Rutas del Sistema

**Frontend React:**
```
http://localhost:5173/admin/promotions
├─ Ver todas las promociones
├─ Crear nueva promoción
├─ Editar promoción existente
├─ Eliminar promoción
└─ Ver estadísticas
```

**Vista JSF Alternativa:**
```
http://localhost:8081/promociones.xhtml
├─ DataTable con promociones
├─ Dialog modal para CRUD
├─ Ajax para actualización parcial
└─ Integración con Managed Bean
```

**Endpoints REST API:**
```
GET    /api/promociones              → Lista todas
GET    /api/promociones/activas      → Solo activas
GET    /api/promociones/{id}         → Una específica
POST   /api/promociones              → Crear
PUT    /api/promociones/{id}         → Actualizar
DELETE /api/promociones/{id}         → Eliminar
GET    /api/promociones/buscar       → Buscar por nombre
GET    /api/promociones/tipo/{tipo}  → Filtrar por tipo
GET    /api/promociones/estadisticas → Stats
POST   /api/promociones/{id}/calcular-descuento → Calcular
```

---

## 🔄 FLUJOS DE DATOS

### Flujo de Creación de Promoción

```
1. Usuario completa formulario en React
   └─ PromotionsPage.jsx

2. Validación frontend
   └─ validarPromocion(formData)

3. Ajax POST request
   └─ axios.post('/api/promociones', formData)

4. Controller recibe request
   └─ @PostMapping en PromocionController

5. Validación backend (@Valid)
   └─ Bean Validation annotations

6. Service procesa lógica
   └─ PromocionService.crearPromocion()

7. Repository guarda en BD
   └─ ReglaDescuentoRepository.save()

8. MySQL ejecuta INSERT
   └─ Tabla reglas_descuento

9. Entity retornada convertida a DTO
   └─ PromocionDTO.fromEntity()

10. Response JSON enviado
    └─ ResponseEntity<PromocionDTO>

11. React actualiza UI
    └─ setPromociones([...promociones, nueva])
```

### Flujo de Búsqueda

```
Usuario escribe en search box
  → onChange event
    → setState(filtroNombre)
      → handleBuscar()
        → axios.get('/api/promociones/buscar?nombre=X')
          → Controller.buscar()
            → Service.buscarPorNombre()
              → Repository.findByNombreContaining()
                → JPQL: SELECT r FROM ReglaDescuento WHERE...
                  → MySQL: SELECT * FROM reglas_descuento WHERE nombre LIKE '%X%'
                    → List<ReglaDescuento>
                      → List<PromocionDTO>
                        → ResponseEntity.ok(dtos)
                          → React: setPromociones(resultados)
                            → Re-render Table
```

---

## 📖 GUÍA DE USO

### Para Administradores

**1. Acceder al módulo:**
- React: http://localhost:5173/admin/promotions
- JSF: http://localhost:8081/promociones.xhtml

**2. Ver promociones:**
- La tabla muestra todas las promociones
- Badges de color indican el estado (Activa/Programada/Expirada)

**3. Crear promoción:**
- Click en "Nueva Promoción"
- Completar formulario:
  - Nombre descriptivo
  - Tipo de descuento
  - Valor (% o monto)
  - Fechas de vigencia (opcional)
  - Opciones: acumulable/exclusivo
- Click "Crear"

**4. Editar promoción:**
- Click en botón de edición (lápiz)
- Modificar campos necesarios
- Click "Actualizar"

**5. Eliminar promoción:**
- Click en botón de eliminación (basura)
- Confirmar en el diálogo
- La promoción se elimina permanentemente

**6. Filtrar y buscar:**
- Usar barra de búsqueda para filtrar por nombre
- Selector de tipo para filtrar por categoría
- Toggle "Solo activas" para ver promociones vigentes

**7. Ver estadísticas:**
- Cards superiores muestran:
  - Total de promociones
  - Promociones activas
  - Promociones inactivas
  - Próximas a expirar (7 días)

### Para Desarrolladores

**Extender funcionalidad:**

1. **Agregar nuevo tipo de descuento:**
```java
// En ReglaDescuento.java
public enum TipoDescuento {
    // ... existentes
    Puntos_Dobles("Puntos Dobles"); // Nuevo
}
```

2. **Agregar campo a promoción:**
```java
// Entity
@Column(name = "codigo_cupon")
private String codigoCupon;

// DTO
private String codigoCupon;

// Actualizar conversiones fromEntity/toEntity
```

3. **Nueva consulta personalizada:**
```java
// Repository
@Query("SELECT r FROM ReglaDescuento r WHERE r.valorDescuento >= :min")
List<ReglaDescuento> findByValorMinimo(@Param("min") BigDecimal minimo);

// Service
public List<PromocionDTO> obtenerPorValorMinimo(BigDecimal min) {
    return repository.findByValorMinimo(min).stream()
        .map(PromocionDTO::fromEntity)
        .collect(Collectors.toList());
}

// Controller
@GetMapping("/valor-minimo/{min}")
public ResponseEntity<List<PromocionDTO>> porValorMinimo(@PathVariable BigDecimal min) {
    return ResponseEntity.ok(promocionService.obtenerPorValorMinimo(min));
}
```

4. **Agregar validación custom:**
```java
// Service
private void validarPromocion(PromocionDTO dto) {
    // Validación existente...
    
    // Nueva validación
    if ("Porcentaje".equals(dto.getTipoDescuento()) 
        && dto.getValorDescuento().compareTo(new BigDecimal("50")) > 0) {
        throw new IllegalArgumentException(
            "Descuentos mayores a 50% requieren aprobación especial"
        );
    }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [x] Entity JPA (ReglaDescuento.java)
- [x] Repository (ReglaDescuentoRepository.java)
- [x] DTO (PromocionDTO.java)
- [x] Service (PromocionService.java)
- [x] REST Controller (PromocionController.java)
- [x] Managed Bean JSF (PromocionManagedBean.java)
- [x] Validaciones backend
- [x] Seguridad (@PreAuthorize)

### Frontend
- [x] API Service (promociones.js)
- [x] React Component (PromotionsPage.jsx)
- [x] JSF Facelet (promociones.xhtml)
- [x] Formularios CRUD
- [x] Validaciones frontend
- [x] Búsqueda y filtros
- [x] Estadísticas
- [x] UI/UX responsivo

### Base de Datos
- [x] Tabla reglas_descuento
- [x] Scripts de creación
- [x] Scripts de datos de prueba
- [x] Índices optimizados

### Documentación
- [x] Arquitectura
- [x] Diagramas
- [x] Guía de uso
- [x] Ejemplos de código

---

## 🚀 PRÓXIMOS PASOS

1. **Aplicar promociones al checkout**
   - Integrar con módulo de carrito
   - Calcular descuentos automáticamente
   - Validar restricciones

2. **Cupones de descuento**
   - Generar códigos únicos
   - Validar cupones en checkout
   - Límite de usos por cupón

3. **Segmentación avanzada**
   - Promociones por categoría
   - Promociones por cliente
   - Promociones por ubicación

4. **Reportes avanzados**
   - Promociones más usadas
   - ROI de promociones
   - Tendencias temporales

5. **Notificaciones**
   - Alertas de promociones próximas a expirar
   - Notificar a clientes de nuevas promociones

---

## 📞 CONTACTO Y SOPORTE

**Documentación adicional:**
- Backend: `macrosur-ecommerce-backend/src/main/java/com/macrosur/ecommerce/`
- Frontend: `macrosur-ecommerce-frontend/src/pages/admin/PromotionsPage.jsx`
- API Docs: http://localhost:8081/swagger-ui.html (si está habilitado)

**Logs:**
- Backend: Consola Spring Boot
- Frontend: Consola del navegador (F12)
- Base de datos: MySQL Workbench

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Implementación Completa
