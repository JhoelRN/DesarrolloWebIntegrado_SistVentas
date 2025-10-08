use macrosur_ecommerce;
-- 6. CONTENIDO INFORMATIVO Y LEGAL
CREATE TABLE Contenido_Informativo (
    contenido_id INT PRIMARY KEY AUTO_INCREMENT,
    clave_unica VARCHAR(50) NOT NULL UNIQUE, -- Ej: Terminos_Condiciones, Quienes_Somos
    titulo VARCHAR(255) NOT NULL,
    contenido_html TEXT NOT NULL, -- Almacena el texto formatado
    ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);