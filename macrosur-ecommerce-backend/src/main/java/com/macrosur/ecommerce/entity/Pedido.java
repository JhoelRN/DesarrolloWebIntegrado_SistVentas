package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pedido_id")
    private Long pedidoId;
    
    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;
    
    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido = LocalDateTime.now();
    
    @Convert(converter = EstadoPedidoConverter.class)
    @Column(name = "estado", nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE_PAGO;
    
    @Column(name = "total_neto", nullable = false)
    private BigDecimal totalNeto;
    
    @Column(name = "total_impuestos", nullable = false)
    private BigDecimal totalImpuestos;
    
    @Column(name = "total_envio", nullable = false)
    private BigDecimal totalEnvio;
    
    @Column(name = "total_descuento")
    private BigDecimal totalDescuento = BigDecimal.ZERO;
    
    @Column(name = "total_final", nullable = false)
    private BigDecimal totalFinal;
    
    @Convert(converter = MetodoEntregaConverter.class)
    @Column(name = "metodo_entrega", nullable = false)
    private MetodoEntrega metodoEntrega;
    
    @Column(name = "direccion_envio_id")
    private Integer direccionEnvioId;
    
    @Column(name = "ubicacion_retiro_id")
    private Integer ubicacionRetiroId;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();
    
    public enum EstadoPedido {
        PENDIENTE_PAGO("Pendiente Pago"),
        PAGADO("Pagado"),
        EN_PREPARACION("En Preparacion"),
        DESPACHADO("Despachado"),
        ENTREGADO("Entregado"),
        CANCELADO("Cancelado");
        
        private final String descripcion;
        
        EstadoPedido(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum MetodoEntrega {
        DOMICILIO("Domicilio"),
        RETIRO_EN_TIENDA("Retiro en Tienda");
        
        private final String descripcion;
        
        MetodoEntrega(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    // Converters para mapear los enums a los valores de la base de datos
    @Converter(autoApply = false)
    public static class EstadoPedidoConverter implements AttributeConverter<EstadoPedido, String> {
        @Override
        public String convertToDatabaseColumn(EstadoPedido attribute) {
            return attribute == null ? null : attribute.getDescripcion();
        }

        @Override
        public EstadoPedido convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            for (EstadoPedido estado : EstadoPedido.values()) {
                if (estado.getDescripcion().equals(dbData)) {
                    return estado;
                }
            }
            throw new IllegalArgumentException("Estado desconocido: " + dbData);
        }
    }
    
    @Converter(autoApply = false)
    public static class MetodoEntregaConverter implements AttributeConverter<MetodoEntrega, String> {
        @Override
        public String convertToDatabaseColumn(MetodoEntrega attribute) {
            return attribute == null ? null : attribute.getDescripcion();
        }

        @Override
        public MetodoEntrega convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            for (MetodoEntrega metodo : MetodoEntrega.values()) {
                if (metodo.getDescripcion().equals(dbData)) {
                    return metodo;
                }
            }
            throw new IllegalArgumentException("Método de entrega desconocido: " + dbData);
        }
    }
}
