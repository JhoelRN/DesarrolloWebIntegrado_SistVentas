package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "operadores_logisticos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperadorLogistico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "operador_id")
    private Integer operadorId;
    
    @Column(nullable = false, length = 150)
    private String nombre;
    
    @Column(name = "url_rastreo_base", nullable = false, length = 255)
    private String urlRastreoBase;
}
