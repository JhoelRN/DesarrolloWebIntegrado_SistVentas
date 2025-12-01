package com.macrosur.ecommerce.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.macrosur.ecommerce.dto.PromocionDTO;
import com.macrosur.ecommerce.service.PromocionService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SERVLET TRADICIONAL JAVAE para gestión de promociones
 * Patrón: WebServlet con Ajax
 * 
 * Este servlet demuestra la tecnología JavaEE tradicional con:
 * - @WebServlet annotation
 * - Métodos doGet, doPost, doPut, doDelete
 * - Ajax asíncrono desde JSP/JSF
 * - JSON response
 * - Integración con Spring Service Layer
 * 
 * URL Mapping: /servlet/promociones
 * 
 * IMPORTANTE: En arquitectura híbrida, coexiste con @RestController
 * - Servlet: Para vistas JSP/JSF tradicionales
 * - RestController: Para APIs REST modernas (React)
 */
@WebServlet(
    name = "PromocionServlet",
    urlPatterns = {"/servlet/promociones", "/servlet/promociones/*"},
    loadOnStartup = 1
)
public class PromocionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Autowired
    private PromocionService promocionService;

    private ObjectMapper objectMapper;

    /**
     * Inicialización del Servlet
     * Configura autowiring de Spring para inyectar dependencias
     */
    @Override
    public void init() throws ServletException {
        super.init();
        // Permite inyección de dependencias Spring en Servlet
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, 
            getServletContext());
        
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // Para LocalDateTime
    }

    /**
     * GET - Obtener promociones
     * 
     * Endpoints:
     * - GET /servlet/promociones           → Todas las promociones
     * - GET /servlet/promociones?id=1      → Una promoción específica
     * - GET /servlet/promociones?activas=true → Solo activas
     * 
     * Ajax jQuery ejemplo:
     * $.ajax({
     *   url: '/servlet/promociones',
     *   type: 'GET',
     *   dataType: 'json',
     *   success: function(data) {
     *     console.log(data);
     *   }
     * });
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        setResponseHeaders(response);
        
        try {
            String idParam = request.getParameter("id");
            String activasParam = request.getParameter("activas");
            
            if (idParam != null) {
                // Obtener una promoción por ID
                Integer id = Integer.parseInt(idParam);
                PromocionDTO promocion = promocionService.obtenerPromocionPorId(id);
                writeJsonResponse(response, promocion);
            } else if ("true".equals(activasParam)) {
                // Obtener solo promociones activas
                List<PromocionDTO> activas = promocionService.obtenerPromocionesActivas();
                writeJsonResponse(response, activas);
            } else {
                // Obtener todas las promociones
                List<PromocionDTO> promociones = promocionService.obtenerTodasPromociones();
                writeJsonResponse(response, promociones);
            }
            
        } catch (NumberFormatException e) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
        } catch (RuntimeException e) {
            sendError(response, HttpServletResponse.SC_NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Error interno del servidor");
        }
    }

    /**
     * POST - Crear nueva promoción
     * 
     * Ajax jQuery ejemplo:
     * $.ajax({
     *   url: '/servlet/promociones',
     *   type: 'POST',
     *   contentType: 'application/json',
     *   data: JSON.stringify({
     *     nombreRegla: 'Black Friday',
     *     tipoDescuento: 'Porcentaje',
     *     valorDescuento: 30.0
     *   }),
     *   success: function(data) {
     *     console.log('Creada:', data);
     *   }
     * });
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        setResponseHeaders(response);
        
        try {
            // Leer JSON del body del request
            PromocionDTO dto = objectMapper.readValue(request.getReader(), PromocionDTO.class);
            
            // Crear promoción via service
            PromocionDTO creada = promocionService.crearPromocion(dto);
            
            // Responder con código 201 Created
            response.setStatus(HttpServletResponse.SC_CREATED);
            writeJsonResponse(response, creada);
            
        } catch (IllegalArgumentException e) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Error al crear promoción");
        }
    }

    /**
     * PUT - Actualizar promoción existente
     * 
     * Nota: Muchos navegadores no soportan PUT en formularios HTML tradicionales
     * Se usa hidden input _method=PUT o directamente Ajax
     * 
     * Ajax jQuery ejemplo:
     * $.ajax({
     *   url: '/servlet/promociones?id=1',
     *   type: 'PUT',
     *   contentType: 'application/json',
     *   data: JSON.stringify(promocionData),
     *   success: function(data) {
     *     console.log('Actualizada:', data);
     *   }
     * });
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        setResponseHeaders(response);
        
        try {
            String idParam = request.getParameter("id");
            if (idParam == null) {
                sendError(response, HttpServletResponse.SC_BAD_REQUEST, 
                    "Se requiere parámetro 'id'");
                return;
            }
            
            Integer id = Integer.parseInt(idParam);
            PromocionDTO dto = objectMapper.readValue(request.getReader(), PromocionDTO.class);
            
            // Actualizar via service
            PromocionDTO actualizada = promocionService.actualizarPromocion(id, dto);
            
            writeJsonResponse(response, actualizada);
            
        } catch (NumberFormatException e) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
        } catch (RuntimeException e) {
            sendError(response, HttpServletResponse.SC_NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Error al actualizar promoción");
        }
    }

    /**
     * DELETE - Eliminar promoción
     * 
     * Ajax jQuery ejemplo:
     * $.ajax({
     *   url: '/servlet/promociones?id=1',
     *   type: 'DELETE',
     *   success: function(data) {
     *     console.log('Eliminada');
     *   }
     * });
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        setResponseHeaders(response);
        
        try {
            String idParam = request.getParameter("id");
            if (idParam == null) {
                sendError(response, HttpServletResponse.SC_BAD_REQUEST, 
                    "Se requiere parámetro 'id'");
                return;
            }
            
            Integer id = Integer.parseInt(idParam);
            
            // Eliminar via service
            promocionService.eliminarPromocion(id);
            
            // Responder con mensaje de éxito
            Map<String, Object> result = new HashMap<>();
            result.put("mensaje", "Promoción eliminada correctamente");
            result.put("id", id);
            
            writeJsonResponse(response, result);
            
        } catch (NumberFormatException e) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
        } catch (RuntimeException e) {
            sendError(response, HttpServletResponse.SC_NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Error al eliminar promoción");
        }
    }

    /**
     * OPTIONS - Para CORS preflight
     */
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setResponseHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Configurar headers de respuesta
     */
    private void setResponseHeaders(HttpServletResponse response) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Headers CORS para permitir Ajax cross-origin
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    /**
     * Escribir respuesta JSON
     */
    private void writeJsonResponse(HttpServletResponse response, Object data) 
            throws IOException {
        PrintWriter out = response.getWriter();
        String json = objectMapper.writeValueAsString(data);
        out.print(json);
        out.flush();
    }

    /**
     * Enviar error JSON
     */
    private void sendError(HttpServletResponse response, int statusCode, String mensaje) 
            throws IOException {
        response.setStatus(statusCode);
        
        Map<String, String> error = new HashMap<>();
        error.put("error", mensaje);
        error.put("status", String.valueOf(statusCode));
        
        writeJsonResponse(response, error);
    }

    @Override
    public String getServletInfo() {
        return "Servlet tradicional para gestión de promociones con Ajax";
    }
}
