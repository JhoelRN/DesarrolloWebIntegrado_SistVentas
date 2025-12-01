package com.macrosur.ecommerce.controller.bean;

import com.macrosur.ecommerce.dto.PromocionDTO;
import com.macrosur.ecommerce.service.PromocionService;
import jakarta.annotation.PostConstruct;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Managed Bean JSF para gestión de promociones
 * Patrón: MVC - Managed Bean (Controller en arquitectura JSF)
 * 
 * Este bean actúa como controlador para las vistas JSF (Facelets)
 * y se comunica con el Service Layer para lógica de negocio.
 * 
 * Scope: @ViewScoped - El bean vive durante toda la interacción con la vista
 * 
 * USO HÍBRIDO:
 * - Puede ser usado por vistas XHTML (Facelets) con Ajax JSF
 * - También puede ser accedido mediante REST API (PromocionController)
 */
@Component("promocionBean")
@ViewScoped
@Data
public class PromocionManagedBean implements Serializable {

    private static final long serialVersionUID = 1L;

    @Autowired
    private PromocionService promocionService;

    // Lista de promociones para DataTable JSF
    private List<PromocionDTO> promociones;
    
    // Promoción seleccionada para edición
    private PromocionDTO promocionSeleccionada;
    
    // Nueva promoción para creación
    private PromocionDTO nuevaPromocion;
    
    // Filtros de búsqueda
    private String filtroNombre;
    private String filtroTipo;
    private Boolean filtroSoloActivas;
    
    // Estadísticas
    private PromocionService.EstadisticasPromociones estadisticas;
    
    // Control de UI
    private boolean modoEdicion;
    private boolean dialogoVisible;

    /**
     * Inicialización del Managed Bean
     * Se ejecuta automáticamente después de la construcción
     */
    @PostConstruct
    public void init() {
        cargarPromociones();
        cargarEstadisticas();
        inicializarNuevaPromocion();
        filtroSoloActivas = false;
        modoEdicion = false;
    }

    /**
     * Cargar todas las promociones
     * Método Ajax: <p:commandButton action="#{promocionBean.cargarPromociones}" />
     */
    public void cargarPromociones() {
        try {
            if (Boolean.TRUE.equals(filtroSoloActivas)) {
                promociones = promocionService.obtenerPromocionesActivas();
            } else {
                promociones = promocionService.obtenerTodasPromociones();
            }
        } catch (Exception e) {
            mostrarMensajeError("Error al cargar promociones: " + e.getMessage());
        }
    }

    /**
     * Crear nueva promoción
     * Ajax: <p:commandButton action="#{promocionBean.crearPromocion}" update="formPromocion" />
     */
    public void crearPromocion() {
        try {
            promocionService.crearPromocion(nuevaPromocion);
            cargarPromociones();
            cargarEstadisticas();
            cerrarDialogo();
            mostrarMensajeExito("Promoción creada correctamente");
            inicializarNuevaPromocion();
        } catch (IllegalArgumentException e) {
            mostrarMensajeError("Validación: " + e.getMessage());
        } catch (Exception e) {
            mostrarMensajeError("Error al crear promoción: " + e.getMessage());
        }
    }

    /**
     * Preparar edición de promoción
     */
    public void prepararEdicion(PromocionDTO promocion) {
        this.promocionSeleccionada = promocion;
        this.modoEdicion = true;
        this.dialogoVisible = true;
    }

    /**
     * Actualizar promoción
     * Ajax: <p:commandButton action="#{promocionBean.actualizarPromocion}" />
     */
    public void actualizarPromocion() {
        try {
            promocionService.actualizarPromocion(
                promocionSeleccionada.getReglaId(), 
                promocionSeleccionada
            );
            cargarPromociones();
            cargarEstadisticas();
            cerrarDialogo();
            mostrarMensajeExito("Promoción actualizada correctamente");
        } catch (IllegalArgumentException e) {
            mostrarMensajeError("Validación: " + e.getMessage());
        } catch (Exception e) {
            mostrarMensajeError("Error al actualizar promoción: " + e.getMessage());
        }
    }

    /**
     * Eliminar promoción
     * Ajax: <p:commandButton action="#{promocionBean.eliminarPromocion(promocion)}" />
     */
    public void eliminarPromocion(PromocionDTO promocion) {
        try {
            promocionService.eliminarPromocion(promocion.getReglaId());
            cargarPromociones();
            cargarEstadisticas();
            mostrarMensajeExito("Promoción eliminada correctamente");
        } catch (Exception e) {
            mostrarMensajeError("Error al eliminar promoción: " + e.getMessage());
        }
    }

    /**
     * Buscar promociones por nombre
     * Ajax: <p:commandButton action="#{promocionBean.buscarPorNombre}" />
     */
    public void buscarPorNombre() {
        try {
            if (filtroNombre != null && !filtroNombre.trim().isEmpty()) {
                promociones = promocionService.buscarPorNombre(filtroNombre);
            } else {
                cargarPromociones();
            }
        } catch (Exception e) {
            mostrarMensajeError("Error en la búsqueda: " + e.getMessage());
        }
    }

    /**
     * Filtrar por tipo
     * Ajax: <p:commandButton action="#{promocionBean.filtrarPorTipo}" />
     */
    public void filtrarPorTipo() {
        try {
            if (filtroTipo != null && !filtroTipo.isEmpty()) {
                promociones = promocionService.obtenerPorTipo(filtroTipo);
            } else {
                cargarPromociones();
            }
        } catch (Exception e) {
            mostrarMensajeError("Error al filtrar: " + e.getMessage());
        }
    }

    /**
     * Cargar estadísticas
     */
    public void cargarEstadisticas() {
        try {
            estadisticas = promocionService.obtenerEstadisticas();
        } catch (Exception e) {
            mostrarMensajeError("Error al cargar estadísticas: " + e.getMessage());
        }
    }

    /**
     * Abrir diálogo para nueva promoción
     */
    public void abrirDialogoNuevo() {
        inicializarNuevaPromocion();
        modoEdicion = false;
        dialogoVisible = true;
    }

    /**
     * Cerrar diálogo
     */
    public void cerrarDialogo() {
        dialogoVisible = false;
        promocionSeleccionada = null;
    }

    /**
     * Inicializar nueva promoción con valores por defecto
     */
    private void inicializarNuevaPromocion() {
        nuevaPromocion = PromocionDTO.builder()
            .nombreRegla("")
            .tipoDescuento("Porcentaje")
            .valorDescuento(BigDecimal.ZERO)
            .acumulable(true)
            .exclusivo(false)
            .fechaInicio(LocalDateTime.now())
            .build();
    }

    /**
     * Obtener tipos de descuento disponibles
     * Para dropdown en vista: <p:selectOneMenu value="#{promocionBean.nuevaPromocion.tipoDescuento}">
     */
    public String[] getTiposDescuento() {
        return new String[]{"Porcentaje", "Monto Fijo", "2x1", "Envio Gratis"};
    }

    /**
     * Validar si una promoción está activa
     */
    public boolean isPromocionActiva(PromocionDTO promocion) {
        return Boolean.TRUE.equals(promocion.getActiva());
    }

    /**
     * Obtener clase CSS según estado de promoción
     */
    public String getEstadoClass(PromocionDTO promocion) {
        return switch (promocion.getEstadoTexto()) {
            case "Activa" -> "badge-success";
            case "Programada" -> "badge-info";
            case "Expirada" -> "badge-secondary";
            default -> "badge-light";
        };
    }

    // ========== Métodos de utilidad JSF ==========

    private void mostrarMensajeExito(String mensaje) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_INFO, "Éxito", mensaje));
    }

    private void mostrarMensajeError(String mensaje) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", mensaje));
    }

    private void mostrarMensajeAdvertencia(String mensaje) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_WARN, "Advertencia", mensaje));
    }
}
