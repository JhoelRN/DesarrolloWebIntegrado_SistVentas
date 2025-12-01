package com.macrosur.ecommerce.service;

import com.lowagie.text.DocumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

/**
 * Servicio para generar PDFs profesionales desde plantillas HTML/CSS con Thymeleaf y Flying Saucer
 */
@Service
public class PdfService {

    private static final Logger log = LoggerFactory.getLogger(PdfService.class);
    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /**
     * Genera un PDF a partir de una plantilla HTML Thymeleaf
     *
     * @param templateName Nombre de la plantilla (ej: "reports/invoice")
     * @param variables    Variables para la plantilla
     * @return Array de bytes del PDF generado
     */
    public byte[] generatePdfFromTemplate(String templateName, Map<String, Object> variables) {
        try {
            // 1. Procesar plantilla Thymeleaf con los datos
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            // 2. Convertir HTML a PDF con Flying Saucer
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            
            // Configurar el documento HTML
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            
            byte[] pdfBytes = outputStream.toByteArray();
            outputStream.close();

            log.info("PDF generado exitosamente desde plantilla: {}", templateName);
            return pdfBytes;

        } catch (DocumentException | IOException e) {
            log.error("Error generando PDF desde plantilla {}: {}", templateName, e.getMessage(), e);
            throw new RuntimeException("Error al generar PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Genera un PDF de factura
     */
    public byte[] generateInvoicePdf(Map<String, Object> invoiceData) {
        return generatePdfFromTemplate("reports/invoice", invoiceData);
    }

    /**
     * Genera un PDF de reporte de inventario
     */
    public byte[] generateInventoryReportPdf(Map<String, Object> reportData) {
        return generatePdfFromTemplate("reports/inventory-report", reportData);
    }

    /**
     * Genera un PDF de reporte de ventas
     */
    public byte[] generateSalesReportPdf(Map<String, Object> reportData) {
        return generatePdfFromTemplate("reports/sales-report", reportData);
    }

    /**
     * Genera un PDF de reporte de productos
     */
    public byte[] generateProductsReportPdf(Map<String, Object> reportData) {
        return generatePdfFromTemplate("reports/products-report", reportData);
    }

    /**
     * Genera un PDF de orden de reposición
     */
    public byte[] generateRepositionOrderPdf(Map<String, Object> orderData) {
        return generatePdfFromTemplate("reports/reposition-order", orderData);
    }
}
