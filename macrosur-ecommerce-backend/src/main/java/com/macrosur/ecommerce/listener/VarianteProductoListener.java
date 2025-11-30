package com.macrosur.ecommerce.listener;

import com.macrosur.ecommerce.entity.VarianteProducto;
import com.macrosur.ecommerce.service.ProductoService;
import jakarta.persistence.PostPersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * Listener JPA para crear automáticamente registros de inventario
 * cuando se crea una nueva variante de producto.
 * 
 * ENFOQUE HÍBRIDO: 
 * - Auto-crea inventario con cantidad=0 en ubicación principal
 * - Evita incongruencias de datos (siempre hay registro de inventario)
 * - Permite ajustes manuales posteriores por el administrador
 */
@Component
public class VarianteProductoListener {
    
    private static ApplicationContext applicationContext;
    
    @Autowired
    public void setApplicationContext(ApplicationContext context) {
        applicationContext = context;
    }
    
    /**
     * Se ejecuta después de persistir una nueva VarianteProducto
     * Crea automáticamente el registro de inventario inicial
     */
    @PostPersist
    public void afterPersist(VarianteProducto variante) {
        try {
            // Obtener el servicio desde el contexto de Spring
            ProductoService productoService = applicationContext.getBean(ProductoService.class);
            
            // Crear inventario automático para esta variante
            productoService.crearInventarioAutomaticoParaVariante(variante);
            
        } catch (Exception e) {
            // Log pero no fallar el proceso principal
            System.err.println("Error al crear inventario automático para variante " + 
                variante.getSku() + ": " + e.getMessage());
        }
    }
}
