package com.macrosur.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp", "gif");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public FileStorageService(@Value("${file.upload-dir:uploads/productos}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de uploads: " + uploadDir, ex);
        }
    }

    /**
     * Guarda un archivo en el sistema de archivos
     * @param file Archivo a guardar
     * @param codigoProducto Código del producto para generar nombre único
     * @return Ruta relativa del archivo guardado
     */
    public String storeFile(MultipartFile file, String codigoProducto) {
        // Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Validar tamaño
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("El archivo excede el tamaño máximo permitido de 5MB");
        }

        // Obtener nombre original y extensión
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);

        // Validar extensión
        if (!ALLOWED_EXTENSIONS.contains(fileExtension.toLowerCase())) {
            throw new IllegalArgumentException(
                "Tipo de archivo no permitido. Solo se aceptan: " + String.join(", ", ALLOWED_EXTENSIONS)
            );
        }

        try {
            // Verificar que el nombre no contenga caracteres peligrosos
            if (originalFileName.contains("..")) {
                throw new IllegalArgumentException("El nombre del archivo contiene secuencia de ruta inválida");
            }

            // Generar nombre único: CODIGO_TIMESTAMP_UUID.ext
            String fileName = String.format(
                "%s_%d_%s.%s",
                codigoProducto,
                System.currentTimeMillis(),
                UUID.randomUUID().toString().substring(0, 8),
                fileExtension
            );

            // Guardar archivo
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retornar ruta relativa para guardar en BD
            return "/uploads/productos/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("No se pudo guardar el archivo. Error: " + ex.getMessage(), ex);
        }
    }

    /**
     * Elimina un archivo del sistema de archivos
     * @param filePath Ruta relativa del archivo (ej: /uploads/productos/ALF001_123.jpg)
     * @return true si se eliminó correctamente
     */
    public boolean deleteFile(String filePath) {
        try {
            if (filePath == null || filePath.isEmpty()) {
                return false;
            }

            // Extraer solo el nombre del archivo de la ruta
            String fileName = Paths.get(filePath).getFileName().toString();
            Path fileToDelete = this.fileStorageLocation.resolve(fileName).normalize();

            // Verificar que el archivo existe y está dentro del directorio permitido
            if (!fileToDelete.startsWith(this.fileStorageLocation)) {
                throw new SecurityException("Intento de acceso fuera del directorio permitido");
            }

            return Files.deleteIfExists(fileToDelete);
        } catch (IOException ex) {
            System.err.println("Error al eliminar archivo: " + ex.getMessage());
            return false;
        }
    }

    /**
     * Obtiene la extensión de un archivo
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
