package com.macrosur.ecommerce.service;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRMapCollectionDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jasperreports.export.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.jdbc.core.ColumnMapRowMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JasperReportService {

    private final NamedParameterJdbcTemplate jdbc;
    private final String reportsPath;
    private final Logger log = LoggerFactory.getLogger(JasperReportService.class);

    // cache de templates compilados
    private final Map<String, JasperReport> compiledCache = new ConcurrentHashMap<>();

    public JasperReportService(NamedParameterJdbcTemplate jdbc,
                               @Value("${jasper.reports.path:classpath:reports/}") String reportsPath) {
        this.jdbc = jdbc;
        this.reportsPath = reportsPath.endsWith("/") ? reportsPath : reportsPath + "/";
    }

    // método genérico
    public byte[] generateReport(String templateName, Map<String, Object> parameters,
                                 Collection<?> dataSource, String format) throws Exception {
        try {
            log.info("🎯 Iniciando generación de reporte: template={}, formato={}, registros={}", 
                    templateName, format, dataSource != null ? dataSource.size() : 0);
            
            JasperReport jasper = getCompiledReport(templateName);
            log.info("✅ Template compilado exitosamente: {}", templateName);
            
            JRMapCollectionDataSource jrDataSource = null;
            if (dataSource != null) {
                List<Map<String, ?>> rows = new ArrayList<>();
                for (Object o : dataSource) {
                    if (o instanceof Map) {
                        rows.add((Map<String, ?>) o);
                    } else {
                        // support simple beans via reflection if needed
                        rows.add(JRMapTransformer.beanToMap(o));
                    }
                }
                jrDataSource = new JRMapCollectionDataSource(rows);
            }
            JasperPrint print = JasperFillManager.fillReport(jasper, parameters == null ? new HashMap<>() : parameters, jrDataSource == null ? new JREmptyDataSource() : jrDataSource);

            if ("EXCEL".equalsIgnoreCase(format) || "XLSX".equalsIgnoreCase(format)) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                JRXlsxExporter exporter = new JRXlsxExporter();
                exporter.setExporterInput(new SimpleExporterInput(print));
                exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
                SimpleXlsxReportConfiguration config = new SimpleXlsxReportConfiguration();
                config.setOnePagePerSheet(false);
                config.setDetectCellType(true);
                exporter.setConfiguration(config);
                exporter.exportReport();
                log.info("Reporte {} generado en XLSX ({} registros)", templateName, dataSource == null ? 0 : dataSource.size());
                return baos.toByteArray();
            } else {
                byte[] pdf = JasperExportManager.exportReportToPdf(print);
                log.info("Reporte {} generado en PDF ({} registros)", templateName, dataSource == null ? 0 : dataSource.size());
                return pdf;
            }
        } catch (JRException ex) {
            log.error("Error generando reporte {}: {}", templateName, ex.getMessage(), ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generando reporte");
        }
    }

    // Métodos específicos que ejecutan queries y llaman a generateReport

    public byte[] generateProductReport(Map<String, Object> parameters) throws Exception {
        String sql = """
            SELECT p.codigo_producto, p.nombre_producto, c.nombre AS nombre_categoria,
                   p.precio_unitario, COALESCE(vi.stock_actual,0) AS stock_actual
            FROM Productos p
            LEFT JOIN Producto_Categoria pc ON p.producto_id = pc.producto_id
            LEFT JOIN Categorias c ON pc.categoria_id = c.categoria_id
            LEFT JOIN Vista_Inventario vi ON p.producto_id = vi.producto_id
            WHERE (:fechaInicio IS NULL OR p.fecha_creacion >= :fechaInicio)
              AND (:categoriaId IS NULL OR c.categoria_id = :categoriaId)
            ORDER BY p.nombre_producto
            """;
        List<Map<String,Object>> rows = getReportData(sql, parameters);
        return generateReport("productos_report.jrxml", parameters, rows, (String)parameters.getOrDefault("formato","PDF"));
    }

    public byte[] generateInventoryReport(Map<String, Object> parameters) throws Exception {
        String sql = """
            SELECT producto, stock_actual, stock_minimo, ubicacion
            FROM Vista_Inventario
            WHERE (:almacenId IS NULL OR almacen_id = :almacenId)
              AND stock_actual IS NOT NULL
            ORDER BY producto
            """;
        List<Map<String,Object>> rows = getReportData(sql, parameters);
        return generateReport("inventario_report.jrxml", parameters, rows, (String)parameters.getOrDefault("formato","PDF"));
    }

    public byte[] generateSalesReport(Map<String, Object> parameters) throws Exception {
        String sql = """
            SELECT fecha, cliente_nombre AS cliente, productos_descripcion AS productos,
                   total, estado
            FROM Vista_Ventas
            WHERE (:fechaInicio IS NULL OR fecha >= :fechaInicio)
              AND (:fechaFin IS NULL OR fecha <= :fechaFin)
            ORDER BY fecha DESC
            """;
        List<Map<String,Object>> rows = getReportData(sql, parameters);
        return generateReport("ventas_report.jrxml", parameters, rows, (String)parameters.getOrDefault("formato","PDF"));
    }

    public byte[] generateUsersReport(Map<String, Object> parameters) throws Exception {
        log.info("🔍 Generando reporte de usuarios con parámetros: {}", parameters);
        
        String sql = """
            SELECT ua.usuario_admin_id, ua.nombre, ua.apellido, ua.correo_corporativo, 
                   r.nombre_rol, ua.activo
            FROM Usuarios_Admin ua
            LEFT JOIN Roles r ON ua.rol_id = r.rol_id
            WHERE (:rolId IS NULL OR ua.rol_id = :rolId)
              AND (:soloActivos IS NULL OR ua.activo = :soloActivos)
            ORDER BY ua.nombre, ua.apellido
            """;
        
        log.info("📋 Ejecutando consulta SQL para usuarios");
        List<Map<String,Object>> rows = getReportData(sql, parameters);
        log.info("✅ Obtenidos {} registros de usuarios", rows.size());
        
        if (!rows.isEmpty()) {
            log.info("📄 Primer registro: {}", rows.get(0));
        }
        
        log.info("🔄 Generando reporte con template usuarios_report.jrxml");
        return generateReport("usuarios_report.jrxml", parameters, rows, (String)parameters.getOrDefault("formato","PDF"));
    }

    // carga y cacheo de templates
    private JasperReport getCompiledReport(String templateName) throws JRException {
        // Limpiar cache para forzar recompilación (temporal para debugging)
        if ("usuarios_report.jrxml".equals(templateName)) {
            compiledCache.remove(templateName);
            log.info("🗑️ Cache limpiado para: {}", templateName);
        }
        
        return compiledCache.computeIfAbsent(templateName, key -> {
            try (InputStream is = this.getClass().getResourceAsStream("/reports/" + key)) {
                if (is == null) {
                    log.error("❌ Template no encontrado: /reports/{}", key);
                    throw new JRException("Template no encontrado: " + key);
                }
                log.info("📄 Cargando template: /reports/{}", key);
                JasperDesign design = JRXmlLoader.load(is);
                log.info("🔄 Compilando template: {}", key);
                return JasperCompileManager.compileReport(design);
            } catch (Exception e) {
                log.error("❌ Error compilando template {}: {}", key, e.getMessage());
                throw new RuntimeException(e);
            }
        });
    }

    // Obtiene datos desde la DB con NamedParameterJdbcTemplate
    private List<Map<String,Object>> getReportData(String query, Map<String,Object> parameters) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        if (parameters != null) {
            parameters.forEach(params::addValue);
        }
        // convierte LocalDate string si es necesario (solo si los parámetros existen)
        try {
            if (params.hasValue("fechaInicio") && params.getValue("fechaInicio") instanceof String) {
                params.addValue("fechaInicio", LocalDate.parse((String)params.getValue("fechaInicio")));
            }
        } catch (Exception e) {
            log.debug("No se pudo procesar fechaInicio: {}", e.getMessage());
        }
        
        try {
            if (params.hasValue("fechaFin") && params.getValue("fechaFin") instanceof String) {
                params.addValue("fechaFin", LocalDate.parse((String)params.getValue("fechaFin")));
            }
        } catch (Exception e) {
            log.debug("No se pudo procesar fechaFin: {}", e.getMessage());
        }
        List<Map<String,Object>> rows = jdbc.query(query, params, new ColumnMapRowMapper());
        log.debug("Consulta de reporte ejecutada, filas={}", rows.size());
        return rows;
    }

    // utilitario simple para transformar bean a map cuando sea necesario
    private static final class JRMapTransformer {
        static Map<String,Object> beanToMap(Object bean) {
            Map<String,Object> map = new HashMap<>();
            try {
                java.beans.BeanInfo info = java.beans.Introspector.getBeanInfo(bean.getClass());
                for (java.beans.PropertyDescriptor pd : info.getPropertyDescriptors()) {
                    if (pd.getReadMethod() != null && !"class".equals(pd.getName())) {
                        Object val = pd.getReadMethod().invoke(bean);
                        map.put(pd.getName(), val);
                    }
                }
            } catch (Exception e) {
                // ignore
            }
            return map;
        }
    }
}
