// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.service.JasperReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReportController {

    private final JasperReportService jasperService;
    private final Logger log = LoggerFactory.getLogger(ReportController.class);

    public ReportController(JasperReportService jasperService) {
        this.jasperService = jasperService;
    }

    @GetMapping("/productos")
    // @PreAuthorize("hasAuthority('REPORTE_PRODUCTOS') or hasRole('ADMIN')") // TEMPORAL: Sin seguridad para probar
    public ResponseEntity<byte[]> generateProductReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            Map<String,Object> params = new HashMap<>();
            params.put("fechaInicio", fechaInicio);
            params.put("fechaFin", fechaFin);
            params.put("categoriaId", categoriaId);
            params.put("formato", formato);
            byte[] out = jasperService.generateProductReport(params);
            return buildResponse(out, formato, "reporte_productos");
        } catch (ResponseStatusException ex) {
            log.warn("Permiso/validación falló productos: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Error generando reporte productos: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte productos");
        }
    }

    @GetMapping("/inventario")
    // @PreAuthorize("hasAuthority('REPORTE_INVENTARIO') or hasRole('ADMIN')") // TEMPORAL
    public ResponseEntity<byte[]> generateInventoryReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaCorte,
            @RequestParam(required = false) Long almacenId,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            Map<String,Object> params = new HashMap<>();
            params.put("fechaCorte", fechaCorte);
            params.put("almacenId", almacenId);
            params.put("formato", formato);
            byte[] out = jasperService.generateInventoryReport(params);
            return buildResponse(out, formato, "reporte_inventario");
        } catch (Exception ex) {
            log.error("Error generando reporte inventario: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte inventario");
        }
    }

    @GetMapping("/ventas")
    // @PreAuthorize("hasAuthority('REPORTE_VENTAS') or hasRole('ADMIN')") // TEMPORAL
    public ResponseEntity<byte[]> generateSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String tipoReporte,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            Map<String,Object> params = new HashMap<>();
            params.put("fechaInicio", fechaInicio);
            params.put("fechaFin", fechaFin);
            params.put("tipoReporte", tipoReporte);
            params.put("formato", formato);
            byte[] out = jasperService.generateSalesReport(params);
            return buildResponse(out, formato, "reporte_ventas");
        } catch (Exception ex) {
            log.error("Error generando reporte ventas: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte ventas");
        }
    }

    @GetMapping("/usuarios")
    // @PreAuthorize("hasRole('ADMIN')") // TEMPORAL
    public ResponseEntity<byte[]> generateUsersReport(
            @RequestParam(required = false) Long rolId,
            @RequestParam(required = false) Boolean soloActivos,
            @RequestParam(defaultValue = "PDF") String formato
    ) {
        try {
            Map<String,Object> params = new HashMap<>();
            params.put("rolId", rolId);
            params.put("soloActivos", soloActivos);
            params.put("formato", formato);
            byte[] out = jasperService.generateUsersReport(params);
            return buildResponse(out, formato, "reporte_usuarios");
        } catch (Exception ex) {
            log.error("Error generando reporte usuarios: {}", ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte usuarios");
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
