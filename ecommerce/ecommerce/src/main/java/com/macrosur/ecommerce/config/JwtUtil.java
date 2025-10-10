package com.macrosur.ecommerce.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Clase de utilidad para la generación y validación de JSON Web Tokens (JWT).
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME; // En milisegundos

    /**
     * Extrae el nombre de usuario del token JWT.
     * @param token El token JWT.
     * @return El nombre de usuario (subject) del token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la fecha de expiración del token JWT.
     * @param token El token JWT.
     * @return La fecha de expiración del token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del token JWT.
     * @param token El token JWT.
     * @param claimsResolver Función para resolver el claim.
     * @param <T> Tipo del claim.
     * @return El claim extraído.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae todos los claims del token JWT.
     * @param token El token JWT.
     * @return Todos los claims del token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Verifica si el token JWT ha expirado.
     * @param token El token JWT.
     * @return true si el token ha expirado, false en caso contrario.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Valida un token JWT contra los detalles del usuario.
     * @param token El token JWT.
     * @param userDetails Los detalles del usuario.
     * @return true si el token es válido para el usuario, false en caso contrario.
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Genera un token JWT para un nombre de usuario dado.
     * @param userName El nombre de usuario.
     * @return El token JWT generado.
     */
    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userName);
    }

    /**
     * Genera un token JWT con claims adicionales para un nombre de usuario dado.
     * @param claims Claims adicionales a incluir en el token.
     * @param userName El nombre de usuario.
     * @return El token JWT generado.
     */
    public String generateToken(Map<String, Object> claims, String userName) {
        return createToken(claims, userName);
    }

    /**
     * Crea el token JWT.
     * @param claims Los claims del token.
     * @param userName El nombre de usuario (subject).
     * @return El token JWT.
     */
    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Obtiene la clave de firma para JWT.
     * @return La clave de firma.
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}