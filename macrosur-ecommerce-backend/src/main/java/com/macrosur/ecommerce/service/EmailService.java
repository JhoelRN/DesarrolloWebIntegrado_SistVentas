package com.macrosur.ecommerce.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

/**
 * Servicio para envío de notificaciones por correo electrónico
 * con plantillas HTML profesionales usando Thymeleaf
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${mail.from}")
    private String fromEmail;

    @Value("${mail.from-name}")
    private String fromName;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Envía un email con plantilla HTML
     *
     * @param to           Destinatario
     * @param subject      Asunto
     * @param templateName Nombre de la plantilla (ej: "emails/order-confirmation")
     * @param variables    Variables para la plantilla
     */
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            // Procesar plantilla Thymeleaf
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            // Crear mensaje
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            // Enviar
            mailSender.send(message);
            log.info("Email enviado exitosamente a: {} con plantilla: {}", to, templateName);

        } catch (MessagingException e) {
            log.error("Error enviando email a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error procesando plantilla de email {}: {}", templateName, e.getMessage(), e);
            throw new RuntimeException("Error procesando plantilla: " + e.getMessage(), e);
        }
    }

    /**
     * Envía email de confirmación de pedido
     */
    public void sendOrderConfirmation(String customerEmail, Map<String, Object> orderData) {
        sendHtmlEmail(
                customerEmail,
                "Confirmación de Pedido #" + orderData.get("orderId"),
                "emails/order-confirmation",
                orderData
        );
    }

    /**
     * Envía email de bienvenida a nuevo usuario
     */
    public void sendWelcomeEmail(String userEmail, String userName) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "loginUrl", "http://localhost:5173/login"
        );
        sendHtmlEmail(
                userEmail,
                "Bienvenido a Macrosur E-commerce",
                "emails/welcome",
                variables
        );
    }

    /**
     * Envía email de recuperación de contraseña
     */
    public void sendPasswordResetEmail(String userEmail, String resetToken) {
        Map<String, Object> variables = Map.of(
                "resetUrl", "http://localhost:5173/reset-password?token=" + resetToken,
                "expirationTime", "24 horas"
        );
        sendHtmlEmail(
                userEmail,
                "Recuperación de Contraseña - Macrosur",
                "emails/password-reset",
                variables
        );
    }

    /**
     * Envía alerta de stock bajo a administradores
     */
    public void sendLowStockAlert(String adminEmail, Map<String, Object> stockData) {
        sendHtmlEmail(
                adminEmail,
                "⚠️ Alerta: Stock Bajo - Acción Requerida",
                "emails/low-stock-alert",
                stockData
        );
    }

    /**
     * Envía notificación de cambio de estado de pedido
     */
    public void sendOrderStatusUpdate(String customerEmail, Map<String, Object> orderData) {
        String status = (String) orderData.get("status");
        sendHtmlEmail(
                customerEmail,
                "Actualización de Pedido #" + orderData.get("orderId") + " - " + status,
                "emails/order-status-update",
                orderData
        );
    }

    /**
     * Envía notificación de orden de reposición autorizada
     */
    public void sendRepositionOrderApproved(String supplierEmail, Map<String, Object> orderData) {
        sendHtmlEmail(
                supplierEmail,
                "Orden de Reposición Autorizada #" + orderData.get("orderId"),
                "emails/reposition-order-approved",
                orderData
        );
    }
}
