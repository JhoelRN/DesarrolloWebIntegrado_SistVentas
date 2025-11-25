package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.service.JasperReportService;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug") 
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class DebugController {
    
    private final NamedParameterJdbcTemplate jdbc;
    
    public DebugController(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }
    
    @GetMapping("/test-usuarios-query")
    public Map<String, Object> testUsuariosQuery() {
        try {
            String sql = """
                SELECT ua.usuario_admin_id, ua.nombre, ua.apellido, ua.correo_corporativo, 
                       r.nombre_rol, ua.activo
                FROM Usuarios_Admin ua
                LEFT JOIN Roles r ON ua.rol_id = r.rol_id
                ORDER BY ua.nombre, ua.apellido
                """;
            
            List<Map<String, Object>> rows = jdbc.queryForList(sql, new HashMap<>());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("totalRegistros", rows.size());
            result.put("datos", rows);
            
            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("clase", e.getClass().getSimpleName());
            return result;
        }
    }
}