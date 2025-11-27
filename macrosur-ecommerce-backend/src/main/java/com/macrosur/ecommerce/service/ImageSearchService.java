package com.macrosur.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Servicio para buscar imágenes en Unsplash API
 * API gratuita con 50 requests por hora
 */
@Service
public class ImageSearchService {

    @Value("${unsplash.access-key:DEMO_KEY}")
    private String accessKey;

    private static final String UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
    private final RestTemplate restTemplate;

    public ImageSearchService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Buscar imágenes en Unsplash por query
     * @param query Término de búsqueda (ej: "alfombras", "cojines decorativos")
     * @param perPage Número de resultados (default: 12)
     * @return Lista de URLs de imágenes optimizadas
     */
    public List<ImageResult> searchImages(String query, Integer perPage) {
        try {
            if (perPage == null) perPage = 12;
            
            String url = String.format(
                "%s?query=%s&per_page=%d&client_id=%s",
                UNSPLASH_API_URL,
                query.replace(" ", "+"),
                perPage,
                accessKey
            );

            // Hacer request a Unsplash API
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null || !response.containsKey("results")) {
                return getFallbackImages(query);
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            List<ImageResult> images = new ArrayList<>();

            for (Map<String, Object> result : results) {
                Map<String, Object> urls = (Map<String, Object>) result.get("urls");
                Map<String, Object> user = (Map<String, Object>) result.get("user");
                
                if (urls != null) {
                    ImageResult img = new ImageResult();
                    // Usar imagen optimizada (regular = 1080px)
                    img.url = (String) urls.get("regular");
                    img.thumbnail = (String) urls.get("thumb");
                    img.author = user != null ? (String) user.get("name") : "Unknown";
                    img.description = (String) result.get("alt_description");
                    images.add(img);
                }
            }

            return images.isEmpty() ? getFallbackImages(query) : images;

        } catch (Exception e) {
            System.err.println("Error buscando imágenes en Unsplash: " + e.getMessage());
            return getFallbackImages(query);
        }
    }

    /**
     * Imágenes de respaldo usando placeholders si Unsplash falla
     */
    private List<ImageResult> getFallbackImages(String query) {
        List<ImageResult> fallbacks = new ArrayList<>();
        String[] colors = {"FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8", "F7DC6F"};
        
        for (int i = 0; i < 6; i++) {
            ImageResult img = new ImageResult();
            img.url = String.format("https://placehold.co/600/%s/FFFFFF?text=%s+%d", 
                                   colors[i], query.replace(" ", "+"), i+1);
            img.thumbnail = img.url;
            img.author = "Placeholder";
            img.description = query + " " + (i+1);
            fallbacks.add(img);
        }
        
        return fallbacks;
    }

    /**
     * DTO para resultado de búsqueda de imagen
     */
    public static class ImageResult {
        public String url;
        public String thumbnail;
        public String author;
        public String description;

        public String getUrl() { return url; }
        public String getThumbnail() { return thumbnail; }
        public String getAuthor() { return author; }
        public String getDescription() { return description; }
    }
}
