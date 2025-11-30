package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Controlador para pruebas y envío de correos electrónicos
 */
@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * Enviar email de prueba de confirmación de pedido
     */
    @PostMapping("/test/order-confirmation")
    public ResponseEntity<Map<String, Object>> testOrderConfirmation(@RequestParam String email) {
        try {
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("customerName", "Juan Pérez");
            orderData.put("orderId", "#ORD-12345");
            orderData.put("orderDate", new Date());
            
            // Items del pedido
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item1 = new HashMap<>();
            item1.put("productName", "Laptop HP");
            item1.put("variantName", "Core i5, 8GB RAM");
            item1.put("quantity", 1);
            item1.put("price", 2500.00);
            items.add(item1);
            
            Map<String, Object> item2 = new HashMap<>();
            item2.put("productName", "Mouse Logitech");
            item2.put("variantName", "Inalámbrico");
            item2.put("quantity", 2);
            item2.put("price", 45.00);
            items.add(item2);
            
            orderData.put("items", items);
            orderData.put("subtotal", 2590.00);
            orderData.put("shipping", 20.00);
            orderData.put("total", 2610.00);
            orderData.put("shippingAddress", "Av. Larco 1234, Miraflores, Lima, Perú");
            orderData.put("trackingUrl", "http://localhost:5173/profile/orders/12345");
            
            emailService.sendOrderConfirmation(email, orderData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de confirmación enviado exitosamente a " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar email de prueba de bienvenida
     */
    @PostMapping("/test/welcome")
    public ResponseEntity<Map<String, Object>> testWelcome(@RequestParam String email) {
        try {
            emailService.sendWelcomeEmail(email, "Juan Pérez");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de bienvenida enviado exitosamente a " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar email de prueba de recuperación de contraseña
     */
    @PostMapping("/test/password-reset")
    public ResponseEntity<Map<String, Object>> testPasswordReset(@RequestParam String email) {
        try {
            String resetToken = UUID.randomUUID().toString();
            emailService.sendPasswordResetEmail(email, resetToken);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de recuperación enviado exitosamente a " + email,
                "token", resetToken
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar email de prueba de alerta de stock bajo
     */
    @PostMapping("/test/low-stock-alert")
    public ResponseEntity<Map<String, Object>> testLowStockAlert(@RequestParam String email) {
        try {
            Map<String, Object> stockData = new HashMap<>();
            stockData.put("alertDate", new Date());
            stockData.put("criticalCount", 5);
            stockData.put("lowStockCount", 3);
            stockData.put("outOfStockCount", 2);
            
            // Productos críticos
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item1 = new HashMap<>();
            item1.put("productName", "Teclado Mecánico");
            item1.put("sku", "SKU-001");
            item1.put("ubicacion", "Almacén A");
            item1.put("currentStock", 0);
            item1.put("minStock", 10);
            items.add(item1);
            
            Map<String, Object> item2 = new HashMap<>();
            item2.put("productName", "Monitor 24\"");
            item2.put("sku", "SKU-002");
            item2.put("ubicacion", "Almacén B");
            item2.put("currentStock", 5);
            item2.put("minStock", 15);
            items.add(item2);
            
            Map<String, Object> item3 = new HashMap<>();
            item3.put("productName", "Webcam HD");
            item3.put("sku", "SKU-003");
            item3.put("ubicacion", "Almacén A");
            item3.put("currentStock", 0);
            item3.put("minStock", 20);
            items.add(item3);
            
            stockData.put("criticalItems", items);
            stockData.put("inventoryUrl", "http://localhost:5173/admin/inventory");
            stockData.put("createOrderUrl", "http://localhost:5173/admin/logistica/ordenes-reposicion");
            
            emailService.sendLowStockAlert(email, stockData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de alerta de stock enviado exitosamente a " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar email de prueba de actualización de estado
     */
    @PostMapping("/test/order-status-update")
    public ResponseEntity<Map<String, Object>> testOrderStatusUpdate(@RequestParam String email) {
        try {
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("customerName", "María González");
            orderData.put("orderId", "#ORD-67890");
            orderData.put("orderDate", new Date());
            orderData.put("newStatus", "En Tránsito");
            orderData.put("statusColor", "#17a2b8");
            orderData.put("updateDate", new Date());
            orderData.put("statusMessage", "Tu pedido ha sido despachado y está en camino. El transportista lo entregará en los próximos 2-3 días hábiles.");
            orderData.put("trackingNumber", "ABC123456789");
            orderData.put("carrier", "Olva Courier");
            
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, 3);
            orderData.put("estimatedDelivery", cal.getTime());
            
            orderData.put("statusStep", 3); // En tránsito = paso 3
            orderData.put("trackingUrl", "http://localhost:5173/profile/orders/67890");
            
            emailService.sendOrderStatusUpdate(email, orderData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de actualización de estado enviado exitosamente a " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar email de prueba de orden de reposición aprobada
     */
    @PostMapping("/test/reposition-order-approved")
    public ResponseEntity<Map<String, Object>> testRepositionOrderApproved(@RequestParam String email) {
        try {
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("supplierName", "Distribuidora TechPro SAC");
            orderData.put("orderId", "#ORD-REP-2025-001");
            orderData.put("approvalDate", new Date());
            
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, 7);
            orderData.put("expectedDate", cal.getTime());
            
            orderData.put("deliveryLocation", "Almacén Principal - Zona A");
            orderData.put("contactPerson", "Carlos Rodríguez");
            orderData.put("contactPhone", "+51 999 888 777");
            
            // Items de la orden
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item1 = new HashMap<>();
            item1.put("productName", "Laptop Dell Inspiron");
            item1.put("sku", "DELL-INS-15");
            item1.put("quantity", 50);
            item1.put("unitPrice", 2200.00);
            item1.put("subtotal", 110000.00);
            items.add(item1);
            
            Map<String, Object> item2 = new HashMap<>();
            item2.put("productName", "Mouse Inalámbrico");
            item2.put("sku", "MOUSE-WIFI-01");
            item2.put("quantity", 100);
            item2.put("unitPrice", 35.00);
            item2.put("subtotal", 3500.00);
            items.add(item2);
            
            Map<String, Object> item3 = new HashMap<>();
            item3.put("productName", "Teclado USB");
            item3.put("sku", "KB-USB-STD");
            item3.put("quantity", 80);
            item3.put("unitPrice", 45.00);
            item3.put("subtotal", 3600.00);
            items.add(item3);
            
            orderData.put("items", items);
            orderData.put("totalAmount", 117100.00);
            orderData.put("deliveryAddress", "Av. Industrial 456, Parque Industrial\nLima, Perú\nReferencia: Puerta 3, Almacén B");
            orderData.put("specialInstructions", "Por favor coordinar la entrega con 24 horas de anticipación. Horario de recepción: Lunes a Viernes 8:00 AM - 5:00 PM");
            orderData.put("paymentMethod", "Transferencia Bancaria");
            orderData.put("paymentTerms", "30 días fecha de factura");
            orderData.put("confirmUrl", "http://localhost:8081/api/reposition-orders/confirm/" + UUID.randomUUID());
            orderData.put("downloadUrl", "http://localhost:8081/api/reports/reposition-order/ORD-REP-2025-001");
            
            emailService.sendRepositionOrderApproved(email, orderData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de orden de reposición enviado exitosamente a " + email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Enviar todos los emails de prueba
     */
    @GetMapping("/test/all")
    public ResponseEntity<Map<String, Object>> testAllEmails(@RequestParam String email) {
        Map<String, Object> results = new LinkedHashMap<>();
        
        try {
            testOrderConfirmation(email);
            results.put("orderConfirmation", "✓ Enviado");
        } catch (Exception e) {
            results.put("orderConfirmation", "✗ Error: " + e.getMessage());
        }
        
        try {
            testWelcome(email);
            results.put("welcome", "✓ Enviado");
        } catch (Exception e) {
            results.put("welcome", "✗ Error: " + e.getMessage());
        }
        
        try {
            testPasswordReset(email);
            results.put("passwordReset", "✓ Enviado");
        } catch (Exception e) {
            results.put("passwordReset", "✗ Error: " + e.getMessage());
        }
        
        try {
            testLowStockAlert(email);
            results.put("lowStockAlert", "✓ Enviado");
        } catch (Exception e) {
            results.put("lowStockAlert", "✗ Error: " + e.getMessage());
        }
        
        try {
            testOrderStatusUpdate(email);
            results.put("orderStatusUpdate", "✓ Enviado");
        } catch (Exception e) {
            results.put("orderStatusUpdate", "✗ Error: " + e.getMessage());
        }
        
        try {
            testRepositionOrderApproved(email);
            results.put("repositionOrderApproved", "✓ Enviado");
        } catch (Exception e) {
            results.put("repositionOrderApproved", "✗ Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Proceso de envío completado. Revisa tu bandeja de entrada en " + email,
            "results", results
        ));
    }
}
