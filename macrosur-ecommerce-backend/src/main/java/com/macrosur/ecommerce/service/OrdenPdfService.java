package com.macrosur.ecommerce.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.macrosur.ecommerce.entity.DetalleOrdenReposicion;
import com.macrosur.ecommerce.entity.OrdenReposicion;
import com.macrosur.ecommerce.repository.OrdenReposicionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class OrdenPdfService {
    
    private final OrdenReposicionRepository ordenReposicionRepository;
    
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(41, 128, 185); // Azul corporativo
    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(52, 152, 219);
    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("#,##0.00");
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    
    /**
     * Generar PDF de orden de reposición
     */
    public byte[] generarPdfOrden(Integer ordenId) {
        OrdenReposicion orden = ordenReposicionRepository.findById(ordenId)
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(40, 40, 40, 40);
            
            // Título del documento
            agregarEncabezado(document, orden);
            
            // Información de la orden
            agregarInformacionOrden(document, orden);
            
            // Información del proveedor
            agregarInformacionProveedor(document, orden);
            
            // Tabla de productos
            agregarTablaProductos(document, orden);
            
            // Total
            agregarTotal(document, orden);
            
            // Pie de página
            agregarPiePagina(document, orden);
            
            document.close();
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF: " + e.getMessage(), e);
        }
    }
    
    private void agregarEncabezado(Document document, OrdenReposicion orden) {
        // Título principal
        Paragraph titulo = new Paragraph("ORDEN DE COMPRA")
            .setFontSize(24)
            .setBold()
            .setFontColor(PRIMARY_COLOR)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(10);
        document.add(titulo);
        
        // Subtítulo con número de orden
        Paragraph numeroOrden = new Paragraph("N° " + String.format("%06d", orden.getOrdenReposicionId()))
            .setFontSize(18)
            .setBold()
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(20);
        document.add(numeroOrden);
        
        // Información de la empresa (Macrosur)
        Table empresaTable = new Table(UnitValue.createPercentArray(new float[]{1}))
            .useAllAvailableWidth()
            .setMarginBottom(20);
        
        Cell empresaCell = new Cell()
            .add(new Paragraph("MACROSUR E-COMMERCE").setBold().setFontSize(12))
            .add(new Paragraph("RUT: 76.XXX.XXX-X").setFontSize(10))
            .add(new Paragraph("Dirección: Av. Principal 1234, Santiago").setFontSize(10))
            .add(new Paragraph("Teléfono: +56 2 2XXX XXXX").setFontSize(10))
            .add(new Paragraph("Email: compras@macrosur.cl").setFontSize(10))
            .setBorder(Border.NO_BORDER)
            .setBackgroundColor(new DeviceRgb(245, 245, 245))
            .setPadding(10);
        
        empresaTable.addCell(empresaCell);
        document.add(empresaTable);
    }
    
    private void agregarInformacionOrden(Document document, OrdenReposicion orden) {
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
            .useAllAvailableWidth()
            .setMarginBottom(15);
        
        infoTable.addCell(crearCeldaEtiqueta("Fecha Solicitud:"));
        infoTable.addCell(crearCeldaValor(orden.getFechaSolicitud().format(DATE_FORMAT)));
        
        if (orden.getFechaAutorizacion() != null) {
            infoTable.addCell(crearCeldaEtiqueta("Fecha Autorización:"));
            infoTable.addCell(crearCeldaValor(orden.getFechaAutorizacion().format(DATE_FORMAT)));
        }
        
        infoTable.addCell(crearCeldaEtiqueta("Estado:"));
        infoTable.addCell(crearCeldaValor(orden.getEstadoAutorizacion().getDescripcion()));
        
        if (orden.getUsuarioAutoriza() != null) {
            infoTable.addCell(crearCeldaEtiqueta("Autorizado por:"));
            infoTable.addCell(crearCeldaValor(orden.getUsuarioAutoriza().getNombre() + " " + 
                orden.getUsuarioAutoriza().getApellido()));
        }
        
        document.add(infoTable);
    }
    
    private void agregarInformacionProveedor(Document document, OrdenReposicion orden) {
        Paragraph proveedorTitulo = new Paragraph("INFORMACIÓN DEL PROVEEDOR")
            .setFontSize(12)
            .setBold()
            .setFontColor(PRIMARY_COLOR)
            .setMarginTop(10)
            .setMarginBottom(10);
        document.add(proveedorTitulo);
        
        Table proveedorTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
            .useAllAvailableWidth()
            .setMarginBottom(20);
        
        proveedorTable.addCell(crearCeldaEtiqueta("Razón Social:"));
        proveedorTable.addCell(crearCeldaValor(orden.getProveedor().getNombre()));
        
        if (orden.getProveedor().getContacto() != null) {
            proveedorTable.addCell(crearCeldaEtiqueta("Contacto:"));
            proveedorTable.addCell(crearCeldaValor(orden.getProveedor().getContacto()));
        }
        
        if (orden.getProveedor().getTelefono() != null) {
            proveedorTable.addCell(crearCeldaEtiqueta("Teléfono:"));
            proveedorTable.addCell(crearCeldaValor(orden.getProveedor().getTelefono()));
        }
        
        document.add(proveedorTable);
    }
    
    private void agregarTablaProductos(Document document, OrdenReposicion orden) {
        Paragraph productosTitulo = new Paragraph("DETALLE DE PRODUCTOS")
            .setFontSize(12)
            .setBold()
            .setFontColor(PRIMARY_COLOR)
            .setMarginBottom(10);
        document.add(productosTitulo);
        
        // Tabla de productos
        float[] columnWidths = {0.5f, 1f, 2f, 0.8f, 1f, 1.2f};
        Table table = new Table(UnitValue.createPercentArray(columnWidths))
            .useAllAvailableWidth();
        
        // Encabezados
        table.addHeaderCell(crearCeldaEncabezado("#"));
        table.addHeaderCell(crearCeldaEncabezado("SKU"));
        table.addHeaderCell(crearCeldaEncabezado("Producto"));
        table.addHeaderCell(crearCeldaEncabezado("Cantidad"));
        table.addHeaderCell(crearCeldaEncabezado("Precio Unit."));
        table.addHeaderCell(crearCeldaEncabezado("Subtotal"));
        
        // Filas de productos
        int item = 1;
        for (DetalleOrdenReposicion detalle : orden.getDetalles()) {
            table.addCell(crearCeldaProducto(String.valueOf(item++)));
            table.addCell(crearCeldaProducto(detalle.getVariante().getSku()));
            table.addCell(crearCeldaProducto(detalle.getVariante().getProducto().getNombreProducto()));
            table.addCell(crearCeldaProductoNumero(String.valueOf(detalle.getCantidadPedida())));
            table.addCell(crearCeldaProductoNumero("$" + MONEY_FORMAT.format(detalle.getCostoUnitario())));
            
            BigDecimal subtotal = detalle.getCostoUnitario()
                .multiply(new BigDecimal(detalle.getCantidadPedida()));
            table.addCell(crearCeldaProductoNumero("$" + MONEY_FORMAT.format(subtotal)));
        }
        
        document.add(table);
    }
    
    private void agregarTotal(Document document, OrdenReposicion orden) {
        // Tabla para el total
        Table totalTable = new Table(UnitValue.createPercentArray(new float[]{3, 1}))
            .useAllAvailableWidth()
            .setMarginTop(20);
        
        Cell totalLabelCell = new Cell()
            .add(new Paragraph("TOTAL").setBold().setFontSize(14))
            .setTextAlignment(TextAlignment.RIGHT)
            .setBorder(Border.NO_BORDER)
            .setPaddingRight(10);
        
        Cell totalValueCell = new Cell()
            .add(new Paragraph("$" + MONEY_FORMAT.format(orden.getCostoTotal()))
                .setBold()
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR))
            .setTextAlignment(TextAlignment.RIGHT)
            .setBackgroundColor(new DeviceRgb(245, 245, 245))
            .setPadding(10);
        
        totalTable.addCell(totalLabelCell);
        totalTable.addCell(totalValueCell);
        
        document.add(totalTable);
    }
    
    private void agregarPiePagina(Document document, OrdenReposicion orden) {
        // Notas adicionales
        Paragraph notas = new Paragraph("\nNOTAS:")
            .setBold()
            .setFontSize(10)
            .setMarginTop(30);
        document.add(notas);
        
        Paragraph notaDetalle = new Paragraph(
            "• Este documento constituye una orden de compra formal.\n" +
            "• Favor confirmar recepción y fecha estimada de entrega.\n" +
            "• Cualquier modificación debe ser autorizada por escrito.\n" +
            "• Incluir número de orden en toda la documentación relacionada."
        ).setFontSize(9).setMarginBottom(20);
        document.add(notaDetalle);
        
        // Línea de separación
        Table separador = new Table(UnitValue.createPercentArray(new float[]{1}))
            .useAllAvailableWidth()
            .setMarginTop(30);
        
        Cell lineaCell = new Cell()
            .add(new Paragraph(""))
            .setBorderTop(new com.itextpdf.layout.borders.SolidBorder(ColorConstants.LIGHT_GRAY, 1))
            .setBorderBottom(Border.NO_BORDER)
            .setBorderLeft(Border.NO_BORDER)
            .setBorderRight(Border.NO_BORDER);
        
        separador.addCell(lineaCell);
        document.add(separador);
        
        // Información de contacto
        Paragraph contacto = new Paragraph(
            "Departamento de Compras - MACROSUR E-COMMERCE\n" +
            "Email: compras@macrosur.cl | Tel: +56 2 2XXX XXXX"
        )
        .setFontSize(8)
        .setTextAlignment(TextAlignment.CENTER)
        .setMarginTop(10);
        document.add(contacto);
    }
    
    // Métodos auxiliares para crear celdas con estilos consistentes
    
    private Cell crearCeldaEtiqueta(String texto) {
        return new Cell()
            .add(new Paragraph(texto).setBold())
            .setBorder(Border.NO_BORDER)
            .setPadding(5);
    }
    
    private Cell crearCeldaValor(String texto) {
        return new Cell()
            .add(new Paragraph(texto))
            .setBorder(Border.NO_BORDER)
            .setPadding(5);
    }
    
    private Cell crearCeldaEncabezado(String texto) {
        return new Cell()
            .add(new Paragraph(texto).setBold().setFontColor(ColorConstants.WHITE))
            .setBackgroundColor(HEADER_COLOR)
            .setTextAlignment(TextAlignment.CENTER)
            .setPadding(8);
    }
    
    private Cell crearCeldaProducto(String texto) {
        return new Cell()
            .add(new Paragraph(texto).setFontSize(10))
            .setPadding(8)
            .setBorder(new com.itextpdf.layout.borders.SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
    }
    
    private Cell crearCeldaProductoNumero(String texto) {
        return new Cell()
            .add(new Paragraph(texto).setFontSize(10))
            .setTextAlignment(TextAlignment.RIGHT)
            .setPadding(8)
            .setBorder(new com.itextpdf.layout.borders.SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
    }
}
