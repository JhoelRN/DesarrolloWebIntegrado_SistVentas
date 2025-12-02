package com.macrosur.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración para servir archivos estáticos (imágenes subidas)
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/productos}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtener el path absoluto del directorio de uploads
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        
        // Servir archivos desde /uploads/productos/** mapeando al directorio físico
        registry.addResourceHandler("/uploads/productos/**")
                .addResourceLocations("file:" + uploadPath.toString() + "/")
                .setCachePeriod(3600); // Cache de 1 hora

        System.out.println("🖼️  Sirviendo /uploads/productos/** desde: " + uploadPath.toString());
    }
}
