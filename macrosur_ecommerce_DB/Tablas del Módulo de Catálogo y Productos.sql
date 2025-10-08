use macrosur_ecommerce;
-- 3. PRODUCTOS Y CATÁLOGO
CREATE TABLE Categorias (
    categoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    categoria_padre_id INT,
    visible_cliente BOOLEAN DEFAULT TRUE, -- Para la categoría "INACTIVO" o visibles
    FOREIGN KEY (categoria_padre_id) REFERENCES Categorias(categoria_id)
);

CREATE TABLE Productos (
    producto_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion_corta VARCHAR(500),
    ficha_tecnica_html TEXT, -- Permite formatos ricos en la descripción
    peso_kg DECIMAL(8, 2) NOT NULL, -- Crucial para el cálculo de envío
    volumen_m3 DECIMAL(8, 4), -- Para productos grandes (muebles, alfombras grandes)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto_Categoria (
    producto_id INT,
    categoria_id INT,
    PRIMARY KEY (producto_id, categoria_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id)
);

CREATE TABLE Atributos (
    atributo_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_atributo VARCHAR(100) NOT NULL UNIQUE -- Ej: Color, Material, Tamaño
);

CREATE TABLE Valores_Atributo (
    valor_id INT PRIMARY KEY AUTO_INCREMENT,
    atributo_id INT NOT NULL,
    valor VARCHAR(100) NOT NULL, -- Ej: Azul, Lino, 150x200 cm
    FOREIGN KEY (atributo_id) REFERENCES Atributos(atributo_id)
);

CREATE TABLE Variantes_Producto (
    variante_id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE, -- Stock Keeping Unit: Identificador de la unidad de venta
    precio_base DECIMAL(10, 2) NOT NULL,
    url_imagen_principal VARCHAR(255),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

-- Tabla de unión para variantes y sus valores de atributos (ej: (SKU-001, Color=Azul), (SKU-001, Material=Lino))
CREATE TABLE Variante_Valor (
    variante_id INT,
    valor_id INT,
    PRIMARY KEY (variante_id, valor_id),
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id),
    FOREIGN KEY (valor_id) REFERENCES Valores_Atributo(valor_id)
);