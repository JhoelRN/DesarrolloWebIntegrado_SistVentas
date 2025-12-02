// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.service.PdfService;
import com.macrosur.ecommerce.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReportController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private UsuarioAdminRepository usuarioAdminRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;
    
    private final Logger log = LoggerFactory.getLogger(ReportController.class);

    @GetMapping("/productos")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_PRODUCTOS')")
    public ResponseEntity<byte[]> generateProductReport(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Implementar generación de reporte con JasperReports
            throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Reporte de productos pendiente de implementación");
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception ex) {
            log.error("Error generando reporte productos: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte productos");
        }
    }

    @GetMapping("/inventario")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_LOGISTICA')")
    public ResponseEntity<byte[]> generateInventoryReport(
            @RequestParam(required = false) Long almacenId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Implementar generación de reporte con JasperReports
            throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Reporte de inventario pendiente de implementación");
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception ex) {
            log.error("Error generando reporte inventario: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte inventario");
        }
    }

    @GetMapping("/ventas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_COMERCIAL')")
    public ResponseEntity<byte[]> generateSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Implementar generación de reporte con JasperReports
            throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Reporte de ventas pendiente de implementación");
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception ex) {
            log.error("Error generando reporte ventas: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte ventas");
        }
    }

    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateUsuariosReport(@RequestParam(defaultValue = "PDF") String formato) {
        try {
            // TODO: Implementar generación de reporte con JasperReports
            throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED, "Reporte de usuarios pendiente de implementación");
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception ex) {
            log.error("Error generando reporte usuarios: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte usuarios");
        }
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_PRODUCTOS') or hasRole('GESTOR_COMERCIAL') or hasRole('GESTOR_LOGISTICA')")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        try {
            log.info("Obteniendo estadísticas del dashboard...");
            
            // Obtener el rol del usuario autenticado
            String rol = "ADMIN";
            if (authentication != null && authentication.getAuthorities() != null) {
                rol = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .filter(auth -> auth.startsWith("ROLE_"))
                        .map(auth -> auth.replace("ROLE_", ""))
                        .findFirst()
                        .orElse("ADMIN");
            }
            
            log.info("Rol del usuario: {}", rol);

            Map<String, Object> stats = new HashMap<>();
            
            // Stats básicos según rol con manejo de errores individual
            try {
                switch (rol) {
                    case "ADMIN":
                        stats.put("totalProductos", productoRepository.count());
                        stats.put("totalPedidos", pedidoRepository.count());
                        stats.put("totalUsuarios", usuarioAdminRepository.count());
                        stats.put("totalCategorias", categoriaRepository.count());
                        break;
                    case "GESTOR_PRODUCTOS":
                        stats.put("totalProductos", productoRepository.count());
                        stats.put("totalCategorias", categoriaRepository.count());
                        stats.put("productosActivos", productoRepository.count());
                        stats.put("totalInventario", inventarioRepository.count());
                        break;
                    case "GESTOR_COMERCIAL":
                        stats.put("totalPedidos", pedidoRepository.count());
                        stats.put("pedidosHoy", 0);
                        stats.put("ventasMes", 0.0);
                        stats.put("ticketPromedio", 0.0);
                        break;
                    case "GESTOR_LOGISTICA":
                        stats.put("totalInventario", inventarioRepository.count());
                        stats.put("alarmasStock", 0);
                        stats.put("ordenesReposicion", 0);
                        stats.put("despachosHoy", 0);
                        break;
                    default:
                        log.warn("Rol no reconocido: {}", rol);
                        stats.put("totalProductos", productoRepository.count());
                        stats.put("totalPedidos", pedidoRepository.count());
                        stats.put("mensaje", "Rol no reconocido - mostrando datos básicos");
                }
            } catch (Exception dbEx) {
                log.error("Error accediendo a la base de datos: {}", dbEx.getMessage(), dbEx);
                // Devolver estadísticas vacías en caso de error de BD
                stats.put("totalProductos", 0);
                stats.put("totalPedidos", 0);
                stats.put("totalUsuarios", 0);
                stats.put("totalCategorias", 0);
                stats.put("error", "Error obteniendo datos de la base de datos");
            }
            
            log.info("Estadísticas obtenidas exitosamente: {}", stats);
            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            log.error("Error general obteniendo estadísticas dashboard: {}", ex.getMessage(), ex);
            // En lugar de lanzar excepción, devolver respuesta con error
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("totalProductos", 0);
            errorStats.put("totalPedidos", 0);
            errorStats.put("error", "Error obteniendo estadísticas: " + ex.getMessage());
            return ResponseEntity.ok(errorStats);
        }
    }

    @GetMapping("/dashboard/charts/ventas-mes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_COMERCIAL')")
    public ResponseEntity<List<Map<String, Object>>> getVentasMesChart() {
        try {
            // Datos para gráfica de ventas del mes (últimos 30 días)
            List<Map<String, Object>> ventasDiarias = new ArrayList<>();
            LocalDate hoy = LocalDate.now();
            
            for (int i = 29; i >= 0; i--) {
                LocalDate fecha = hoy.minusDays(i);
                Map<String, Object> dia = new HashMap<>();
                dia.put("fecha", fecha.toString());
                dia.put("dia", fecha.getDayOfMonth());
                // TODO: Calcular ventas reales del día
                dia.put("ventas", Math.random() * 10000); // Placeholder
                ventasDiarias.add(dia);
            }
            
            return ResponseEntity.ok(ventasDiarias);
        } catch (Exception ex) {
            log.error("Error obteniendo gráfica ventas mes: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error obteniendo datos gráfica");
        }
    }

    @GetMapping("/dashboard/charts/productos-categoria")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GESTOR_PRODUCTOS')")
    public ResponseEntity<List<Map<String, Object>>> getProductosPorCategoria() {
        try {
            List<Map<String, Object>> datos = new ArrayList<>();
            // TODO: Consultar datos reales de la BD
            return ResponseEntity.ok(datos);
        } catch (Exception ex) {
            log.error("Error obteniendo gráfica productos/categoría: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error obteniendo datos gráfica");
        }
    }

    @GetMapping("/factura/{ventaId}")
    @PreAuthorize("hasAuthority('REPORTE_VENTAS') or hasRole('ADMIN') or hasRole('SELLER')")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable Long ventaId) {
        try {
            // TODO: Obtener datos reales de VentaService
            Map<String, Object> data = new HashMap<>();
            data.put("invoiceNumber", "F001-" + String.format("%08d", ventaId));
            data.put("issueDate", new Date());
            
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, 30);
            data.put("dueDate", cal.getTime());
            
            data.put("orderNumber", "#ORD-" + ventaId);
            data.put("customerName", "Juan Pérez García");
            data.put("customerDocument", "12345678");
            data.put("customerEmail", "cliente@email.com");
            data.put("customerPhone", "999 888 777");
            data.put("customerAddress", "Av. Larco 1234, Miraflores, Lima, Perú");
            
            // Items de la venta
            List<Map<String, Object>> items = new ArrayList<>();
            // TODO: Cargar items reales
            data.put("items", items);
            
            double subtotal = 3040.0;
            double igv = subtotal * 0.18;
            double total = subtotal + igv;
            
            data.put("subtotal", subtotal);
            data.put("discount", null);
            data.put("shipping", null);
            data.put("igv", igv);
            data.put("total", total);
            data.put("paymentMethod", "Tarjeta de Crédito");
            data.put("paymentStatus", "PAGADO");
            data.put("notes", "Gracias por su compra. Su pedido será procesado en 24-48 horas.");
            
            byte[] out = pdfService.generateInvoicePdf(data);
            return buildResponse(out, "PDF", "factura_" + ventaId);
        } catch (Exception ex) {
            log.error("Error generando factura: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando factura");
        }
    }

    // helper para construir ResponseEntity con headers apropiados
    private ResponseEntity<byte[]> buildResponse(byte[] body, String formato, String baseName) {
        if (body == null || body.length == 0) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Reporte sin contenido");
        }
        String filename = baseName + "_" + java.time.LocalDate.now() + ("EXCEL".equalsIgnoreCase(formato) || "XLSX".equalsIgnoreCase(formato) ? ".xlsx" : ".pdf");
        MediaType mediaType = ("EXCEL".equalsIgnoreCase(formato) || "XLSX".equalsIgnoreCase(formato))
                ? MediaType.parseMediaType("application/vnd.ms-excel")
                : MediaType.APPLICATION_PDF;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        headers.setCacheControl(CacheControl.noCache().getHeaderValue());
        log.info("Reporte {} preparado para descarga (formato={})", baseName, formato);
        return new ResponseEntity<>(body, headers, HttpStatus.OK);
    }
}
