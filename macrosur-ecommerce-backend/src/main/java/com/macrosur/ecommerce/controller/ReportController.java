// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReportController {

    @Autowired
    private PdfService pdfService;
    
    private final Logger log = LoggerFactory.getLogger(ReportController.class);

    @GetMapping("/productos")
    @PreAuthorize("hasAuthority('REPORTE_PRODUCTOS') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateProductReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Obtener datos reales de ProductoService
            Map<String, Object> data = new HashMap<>();
            data.put("reportDate", new Date());
            data.put("totalProducts", 150);
            data.put("totalCategories", 8);
            data.put("generatedBy", "Admin Usuario");
            data.put("activeProducts", 135);
            data.put("lowStockProducts", 12);
            data.put("outOfStockProducts", 3);
            data.put("totalInventoryValue", 450250.0);
            
            // Preparar categorías con productos
            List<Map<String, Object>> categories = new ArrayList<>();
            data.put("categories", categories);
            
            byte[] out = pdfService.generateProductsReportPdf(data);
            return buildResponse(out, formato, "catalogo_productos");
        } catch (ResponseStatusException ex) {
            log.warn("Permiso/validación falló productos: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Error generando reporte productos: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte productos");
        }
    }

    @GetMapping("/inventario")
    @PreAuthorize("hasAuthority('REPORTE_INVENTARIO') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateInventoryReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaCorte,
            @RequestParam(required = false) Long almacenId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Obtener datos reales de InventarioService
            Map<String, Object> data = new HashMap<>();
            data.put("reportDate", new Date());
            data.put("ubicacion", almacenId != null ? "Almacén " + almacenId : "Todos los Almacenes");
            data.put("totalProducts", 150);
            data.put("totalUnits", 5420);
            data.put("lowStockCount", 12);
            data.put("outOfStockCount", 3);
            
            // Preparar items de inventario
            List<Map<String, Object>> items = new ArrayList<>();
            // TODO: Cargar items reales desde base de datos
            data.put("items", items);
            
            byte[] out = pdfService.generateInventoryReportPdf(data);
            return buildResponse(out, formato, "reporte_inventario");
        } catch (Exception ex) {
            log.error("Error generando reporte inventario: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte inventario");
        }
    }

    @GetMapping("/ventas")
    @PreAuthorize("hasAuthority('REPORTE_VENTAS') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String tipoReporte,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            // TODO: Obtener datos reales de VentaService
            Map<String, Object> data = new HashMap<>();
            data.put("reportDate", new Date());
            data.put("periodDescription", "Noviembre 2025");
            data.put("generatedBy", "Admin Usuario");
            data.put("startDate", fechaInicio != null ? java.sql.Date.valueOf(fechaInicio) : new Date());
            data.put("endDate", fechaFin != null ? java.sql.Date.valueOf(fechaFin) : new Date());
            data.put("totalDays", 28);
            data.put("totalRevenue", 125450.0);
            data.put("totalOrders", 342);
            data.put("averageOrderValue", 367.0);
            data.put("totalProductsSold", 1245);
            data.put("revenueGrowth", 15.5);
            data.put("ordersGrowth", 8.3);
            
            // Preparar top productos, métodos de pago, etc.
            data.put("topProducts", new ArrayList<>());
            data.put("paymentMethods", new ArrayList<>());
            data.put("salesByCategory", new ArrayList<>());
            data.put("dailySales", new ArrayList<>());
            data.put("maxDailyAmount", 5000.0);
            
            byte[] out = pdfService.generateSalesReportPdf(data);
            return buildResponse(out, formato, "reporte_ventas");
        } catch (Exception ex) {
            log.error("Error generando reporte ventas: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte ventas");
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
