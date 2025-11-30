# 📄 Guía del Módulo de PDFs Profesionales (Flying Saucer + Thymeleaf)

## 📋 Índice
1. [Visión General](#visión-general)
2. [Ventajas vs JasperReports](#ventajas-vs-jasperreports)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Templates Disponibles](#templates-disponibles)
5. [Uso del PdfService](#uso-del-pdfservice)
6. [Crear Nuevos Templates](#crear-nuevos-templates)
7. [Integración con Controladores](#integración-con-controladores)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Visión General

Este módulo genera PDFs profesionales a partir de plantillas HTML/CSS usando **Flying Saucer** (conversión HTML→PDF) y **Thymeleaf** (motor de plantillas).

### Tecnologías Utilizadas

- **Flying Saucer 9.7.2**: Convierte HTML/CSS a PDF con alta fidelidad
- **Thymeleaf**: Motor de plantillas para generar HTML dinámico
- **CSS3**: Estilos modernos con gradientes, sombras, responsive
- **Java 21**: Backend Spring Boot

### ¿Por qué Flying Saucer?

✅ **Diseño HTML/CSS familiar** - No necesitas aprender XML de JasperReports  
✅ **Templates reutilizables** - Un diseño para PDFs y emails  
✅ **Fácil de mantener** - Cambiar estilos es solo editar CSS  
✅ **Profesional** - Gradientes, sombras, tipografía moderna  
✅ **Sin software externo** - No necesitas Jaspersoft Studio  

---

## 🆚 Ventajas vs JasperReports

| Característica | Flying Saucer + Thymeleaf | JasperReports |
|----------------|---------------------------|---------------|
| **Lenguaje de diseño** | HTML/CSS (familiar) | XML JRXML (complejo) |
| **Editor necesario** | Cualquier editor de texto | Jaspersoft Studio |
| **Curva de aprendizaje** | ⭐⭐ Baja | ⭐⭐⭐⭐⭐ Alta |
| **Diseños modernos** | ✅ Gradientes, sombras, flexbox | ❌ Limitado |
| **Reutilización** | ✅ Mismo template para PDFs y emails | ❌ Solo PDFs |
| **Integración Thymeleaf** | ✅ Nativa | ❌ No compatible |
| **Tamaño de dependencias** | ~2MB | ~15MB |
| **Velocidad de renderizado** | ⚡ Rápida | 🐢 Lenta (primera vez) |
| **Debugging** | ✅ HTML en navegador primero | ❌ Solo prueba en PDF |

**Conclusión:** Flying Saucer es más moderno, fácil y flexible para diseños profesionales.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                     │
│  (ReportController, EmailController, etc.)              │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │    PdfService        │  │    EmailService         │ │
│  │  - Generate PDFs     │  │  - Send HTML emails     │ │
│  └──────────┬───────────┘  └───────────┬─────────────┘ │
└─────────────┼──────────────────────────┼───────────────┘
              │                          │
              ▼                          ▼
┌──────────────────────────────────────────────────────────┐
│              Thymeleaf Template Engine                   │
│  - Procesa variables ${...}                              │
│  - Genera HTML dinámico                                  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                 HTML Templates                           │
│  src/main/resources/templates/                           │
│  ├── base-layout.html (base común)                       │
│  ├── reports/                                            │
│  │   ├── inventory-report.html                           │
│  │   ├── sales-report.html (pending)                     │
│  │   ├── products-report.html (pending)                  │
│  │   └── invoice.html (pending)                          │
│  └── emails/ (6 templates)                               │
└────────────────────┬─────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
┌─────────────────┐       ┌────────────────────┐
│  Flying Saucer  │       │  JavaMailSender    │
│  (HTML → PDF)   │       │  (HTML → Email)    │
└────────┬────────┘       └────────┬───────────┘
         │                         │
         ▼                         ▼
    📄 PDF File              📧 Email sent
```

---

## 📑 Templates Disponibles

### ✅ Template Completado: Inventory Report

**Archivo:** `templates/reports/inventory-report.html`

**Características:**
- 🎨 Diseño moderno con gradientes
- 📊 4 tarjetas de resumen (Total, Unidades, Stock Bajo, Agotado)
- 🏷️ Badges de estado (OK, BAJO, AGOTADO)
- 📋 Tabla detallada de productos
- 🖨️ Optimizado para impresión

**Variables requeridas:**
```java
Map<String, Object> data = new HashMap<>();
data.put("reportDate", new Date());                 // Fecha del reporte
data.put("ubicacion", "Almacén Principal");         // Ubicación
data.put("totalProducts", 150);                     // Total de productos
data.put("totalUnits", 5420);                       // Total de unidades
data.put("lowStockCount", 12);                      // Productos con stock bajo
data.put("outOfStockCount", 3);                     // Productos agotados

// Lista de items
List<Map<String, Object>> items = new ArrayList<>();
Map<String, Object> item = new HashMap<>();
item.put("sku", "SKU-001");
item.put("productName", "Laptop HP");
item.put("currentStock", 25);
item.put("minStock", 10);
item.put("maxStock", 100);
item.put("ubicacion", "Almacén A");
items.add(item);
data.put("items", items);
```

**Vista previa:**
```
╔════════════════════════════════════════════╗
║   REPORTE DE INVENTARIO - MACROSUR        ║
║   28/11/2025 | Almacén Principal          ║
╠════════════════════════════════════════════╣
║  [150]        [5,420]      [12]      [3]  ║
║  Total     Total Unid.  Stock Bajo  Agot. ║
╠════════════════════════════════════════════╣
║ SKU    | Producto  | Stock | Mín | Estado ║
║--------+-----------+-------+-----+--------║
║ SKU-001| Laptop HP |  25   | 10  |  OK    ║
║ SKU-002| Mouse USB |   3   | 10  | BAJO   ║
║ SKU-003| Teclado   |   0   | 15  | AGOT.  ║
╚════════════════════════════════════════════╝
```

### ⏳ Templates Pendientes

**1. Sales Report** (`sales-report.html`)
- Resumen de ventas por período
- Gráfico de ingresos (barras con CSS)
- Top productos más vendidos
- Desglose por método de pago
- Comparativa con período anterior

**2. Products Report** (`products-report.html`)
- Catálogo completo de productos
- Imágenes de productos
- Precios y descuentos
- Estado de stock
- Agrupado por categoría

**3. Invoice** (`invoice.html`)
- Factura profesional con logo
- Datos de cliente y empresa
- Tabla de líneas de productos
- Cálculo de impuestos (IGV)
- Términos y condiciones

**4. Reposition Order** (`reposition-order.html`)
- Orden de compra a proveedor
- Productos solicitados
- Precios y totales
- Condiciones de entrega
- Firma y autorización

---

## 🔧 Uso del PdfService

### Método Principal: `generatePdfFromTemplate()`

```java
@Autowired
private PdfService pdfService;

// Preparar datos
Map<String, Object> data = new HashMap<>();
data.put("variable1", "valor1");
data.put("fecha", new Date());

// Generar PDF
byte[] pdfBytes = pdfService.generatePdfFromTemplate("reports/mi-template", data);

// Retornar como respuesta HTTP
return ResponseEntity.ok()
    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte.pdf")
    .contentType(MediaType.APPLICATION_PDF)
    .body(pdfBytes);
```

### Métodos Especializados

#### 1. Reporte de Inventario
```java
Map<String, Object> data = prepararDatosInventario();
byte[] pdf = pdfService.generateInventoryReportPdf(data);
```

#### 2. Reporte de Ventas
```java
Map<String, Object> data = prepararDatosVentas();
byte[] pdf = pdfService.generateSalesReportPdf(data);
```

#### 3. Catálogo de Productos
```java
Map<String, Object> data = prepararDatosProductos();
byte[] pdf = pdfService.generateProductsReportPdf(data);
```

#### 4. Factura
```java
Map<String, Object> data = prepararDatosFactura(ventaId);
byte[] pdf = pdfService.generateInvoicePdf(data);
```

#### 5. Orden de Reposición
```java
Map<String, Object> data = prepararDatosOrdenReposicion(ordenId);
byte[] pdf = pdfService.generateRepositionOrderPdf(data);
```

---

## 🎨 Crear Nuevos Templates

### Paso 1: Crear el archivo HTML

Crea el archivo en `src/main/resources/templates/reports/mi-reporte.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8"/>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .content {
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mi Reporte</h1>
        <p th:text="${#dates.format(fecha, 'dd/MM/yyyy')}">Fecha</p>
    </div>
    
    <div class="content">
        <h2>Datos del Reporte</h2>
        <p th:text="${descripcion}">Descripción</p>
        
        <table>
            <thead>
                <tr>
                    <th>Columna 1</th>
                    <th>Columna 2</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="item : ${items}">
                    <td th:text="${item.campo1}">Valor 1</td>
                    <td th:text="${item.campo2}">Valor 2</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
```

### Paso 2: Agregar método en PdfService

```java
public byte[] generateMiReportePdf(Map<String, Object> reportData) {
    return generatePdfFromTemplate("reports/mi-reporte", reportData);
}
```

### Paso 3: Usar en el Controlador

```java
@GetMapping("/mi-reporte")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<byte[]> getMiReporte() {
    Map<String, Object> data = new HashMap<>();
    data.put("fecha", new Date());
    data.put("descripcion", "Este es mi reporte personalizado");
    
    List<Map<String, Object>> items = obtenerDatos();
    data.put("items", items);
    
    byte[] pdf = pdfService.generateMiReportePdf(data);
    
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=mi-reporte.pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
}
```

---

## 🎯 CSS Tips para PDFs

### ✅ CSS Soportado por Flying Saucer

```css
/* Colores y backgrounds */
background-color: #f0f0f0;
background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
color: #333;

/* Bordes y espaciado */
border: 1px solid #ddd;
border-radius: 10px;
padding: 20px;
margin: 10px;

/* Tipografía */
font-family: Arial, sans-serif;
font-size: 14px;
font-weight: bold;
text-align: center;

/* Tamaños */
width: 100%;
height: 200px;

/* Display */
display: block;
display: inline-block;

/* Sombras */
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
```

### ❌ CSS NO soportado

```css
/* NO FUNCIONA */
display: flex;           /* Usar tablas en su lugar */
display: grid;           /* Usar tablas */
position: fixed;         /* Limitado */
transform: rotate(45deg);/* No soportado */
@media queries;          /* Usar @page en su lugar */
```

### 📐 Configuración de Página

```css
@page {
    size: A4 portrait;  /* o landscape */
    margin: 2cm;
}

/* Evitar saltos de página */
.no-break {
    page-break-inside: avoid;
}

/* Forzar salto de página */
.page-break {
    page-break-after: always;
}
```

---

## 🔌 Integración con Controladores

### Actualizar ReportController

**Antes (JasperReports):**
```java
@Autowired
private JasperReportService jasperReportService;

@GetMapping("/inventario")
public ResponseEntity<byte[]> getInventarioReport() {
    byte[] pdf = jasperReportService.generateInventoryReport();
    // ...
}
```

**Después (Flying Saucer):**
```java
@Autowired
private PdfService pdfService;

@GetMapping("/inventario")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<byte[]> getInventarioReport() {
    // Obtener datos del inventario
    List<Inventario> inventarios = inventarioService.findAll();
    
    // Preparar datos para el template
    Map<String, Object> data = new HashMap<>();
    data.put("reportDate", new Date());
    data.put("ubicacion", "Almacén Principal");
    data.put("totalProducts", inventarios.size());
    
    int totalUnits = inventarios.stream()
        .mapToInt(Inventario::getStockActual)
        .sum();
    data.put("totalUnits", totalUnits);
    
    long lowStock = inventarios.stream()
        .filter(i -> i.getStockActual() < i.getStockMinimo())
        .count();
    data.put("lowStockCount", (int) lowStock);
    
    long outOfStock = inventarios.stream()
        .filter(i -> i.getStockActual() == 0)
        .count();
    data.put("outOfStockCount", (int) outOfStock);
    
    // Convertir entidades a Maps para el template
    List<Map<String, Object>> items = inventarios.stream()
        .map(inv -> {
            Map<String, Object> item = new HashMap<>();
            item.put("sku", inv.getProducto().getSku());
            item.put("productName", inv.getProducto().getNombre());
            item.put("currentStock", inv.getStockActual());
            item.put("minStock", inv.getStockMinimo());
            item.put("maxStock", inv.getStockMaximo());
            item.put("ubicacion", inv.getUbicacion().getNombre());
            return item;
        })
        .collect(Collectors.toList());
    data.put("items", items);
    
    // Generar PDF
    byte[] pdf = pdfService.generateInventoryReportPdf(data);
    
    // Retornar como descarga
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=inventario_" + 
                new SimpleDateFormat("yyyyMMdd").format(new Date()) + ".pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
}
```

### Generar Factura desde Venta

```java
@GetMapping("/factura/{ventaId}")
@PreAuthorize("hasRole('ADMIN') or hasRole('SELLER')")
public ResponseEntity<byte[]> getFactura(@PathVariable Long ventaId) {
    Venta venta = ventaService.findById(ventaId)
        .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada"));
    
    Map<String, Object> data = new HashMap<>();
    data.put("invoiceNumber", "F001-" + venta.getId());
    data.put("issueDate", venta.getFecha());
    data.put("customerName", venta.getUsuario().getNombre());
    data.put("customerEmail", venta.getUsuario().getEmail());
    data.put("customerAddress", venta.getDireccionEnvio());
    
    // Items
    List<Map<String, Object>> items = venta.getDetalles().stream()
        .map(det -> {
            Map<String, Object> item = new HashMap<>();
            item.put("description", det.getProducto().getNombre());
            item.put("quantity", det.getCantidad());
            item.put("unitPrice", det.getPrecioUnitario());
            item.put("subtotal", det.getCantidad() * det.getPrecioUnitario());
            return item;
        })
        .collect(Collectors.toList());
    data.put("items", items);
    
    double subtotal = venta.getTotal() / 1.18; // Sin IGV
    double igv = venta.getTotal() - subtotal;
    data.put("subtotal", subtotal);
    data.put("igv", igv);
    data.put("total", venta.getTotal());
    
    byte[] pdf = pdfService.generateInvoicePdf(data);
    
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=factura_" + venta.getId() + ".pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
}
```

---

## 🐛 Solución de Problemas

### Error: Template not found

**Síntoma:** `TemplateNotFoundException: reports/mi-template`

**Solución:**
1. Verifica que el archivo esté en `src/main/resources/templates/reports/mi-template.html`
2. Asegúrate de NO incluir `.html` en el nombre al llamar al método
3. Recompila: `.\mvnw clean compile`

### PDF se genera pero está en blanco

**Causa:** Variables no definidas o errores en CSS

**Solución:**
1. Verifica que todas las variables en `th:text="${var}"` existan en el Map
2. Revisa errores de CSS (usar solo CSS soportado)
3. Prueba el template abriendo el HTML generado en un navegador primero

### Caracteres especiales se ven mal (Ñ, á, é, etc.)

**Causa:** Codificación incorrecta

**Solución:**
1. Asegúrate que el archivo HTML tenga `<meta charset="UTF-8"/>`
2. En PdfService, verifica: `ITextRenderer.setDocumentFromString(html, null, Charset.forName("UTF-8"))`

### Las imágenes no aparecen en el PDF

**Causa:** Rutas relativas no encontradas

**Solución:**
1. Usa imágenes en Base64:
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />
```
2. O proporciona URLs absolutas:
```html
<img th:src="${imageUrl}" />
```

### Saltos de página incorrectos

**Solución:**
```css
/* Evitar que tablas se corten */
table {
    page-break-inside: avoid;
}

/* Forzar nueva página */
.nueva-pagina {
    page-break-before: always;
}
```

### PDF muy grande

**Solución:**
1. Optimiza imágenes (usa resolución menor)
2. Limita el número de registros por página
3. Considera paginación: generar múltiples PDFs

---

## 🧪 Testing

### Probar Template en Navegador

Antes de generar el PDF, prueba el HTML en un navegador:

```java
// En PdfService, añade método temporal:
public String generateHtmlOnly(String templateName, Map<String, Object> variables) {
    Context context = new Context();
    context.setVariables(variables);
    return templateEngine.process(templateName, context);
}

// En controller:
@GetMapping("/test-html")
public ResponseEntity<String> testHtml() {
    Map<String, Object> data = prepararDatos();
    String html = pdfService.generateHtmlOnly("reports/inventory-report", data);
    return ResponseEntity.ok()
        .contentType(MediaType.TEXT_HTML)
        .body(html);
}
```

Abre en navegador: `http://localhost:8081/api/reports/test-html`

### Unit Test para PdfService

```java
@SpringBootTest
class PdfServiceTest {
    
    @Autowired
    private PdfService pdfService;
    
    @Test
    void testGenerateInventoryReportPdf() {
        Map<String, Object> data = new HashMap<>();
        data.put("reportDate", new Date());
        data.put("ubicacion", "Test");
        data.put("totalProducts", 10);
        data.put("items", List.of());
        
        byte[] pdf = pdfService.generateInventoryReportPdf(data);
        
        assertNotNull(pdf);
        assertTrue(pdf.length > 0);
        // Verificar que empiece con %PDF (magic number)
        assertEquals('%', (char) pdf[0]);
        assertEquals('P', (char) pdf[1]);
        assertEquals('D', (char) pdf[2]);
        assertEquals('F', (char) pdf[3]);
    }
}
```

---

## 📚 Recursos y Referencias

- **Flying Saucer GitHub:** https://github.com/flyingsaucerproject/flyingsaucer
- **Thymeleaf Docs:** https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html
- **CSS para PDFs:** https://www.w3.org/TR/CSS2/page.html
- **HTML to PDF Best Practices:** https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/

---

## ✅ Checklist de Migración desde JasperReports

- [ ] Identificar todos los reportes actuales (.jrxml)
- [ ] Crear templates HTML equivalentes
- [ ] Mapear campos de JasperReports a variables Thymeleaf
- [ ] Actualizar métodos en ReportController
- [ ] Probar cada reporte con datos reales
- [ ] Eliminar dependencia de JasperReports del pom.xml
- [ ] Eliminar archivos .jrxml obsoletos
- [ ] Actualizar documentación

---

**Última actualización:** 28/11/2025  
**Versión:** 1.0  
**Autor:** Sistema Macrosur E-commerce
