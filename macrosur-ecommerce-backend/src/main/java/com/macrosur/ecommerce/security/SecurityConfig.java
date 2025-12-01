package com.macrosur.ecommerce.security;

import com.macrosur.ecommerce.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/auth/test").permitAll()
                        .requestMatchers("/api/clientes/**").permitAll() // TEMPORAL: Todas las rutas de clientes públicas (usa X-Cliente-Id)
                        .requestMatchers("/api/resenas/**").permitAll() // TEMPORAL: Todas las rutas de reseñas públicas (usa X-Cliente-Id)
                        .requestMatchers("/api/reports/**").permitAll() // TEMPORAL: Para probar reportes
                        .requestMatchers("/api/debug/**").permitAll() // TEMPORAL: Para debugging
                        .requestMatchers("/api/categorias", "/api/categorias/**").permitAll() // TEMPORAL: Endpoints de categorías públicos
                        .requestMatchers("/api/productos", "/api/productos/**").permitAll() // TEMPORAL: Endpoints de productos públicos
                        .requestMatchers("/api/inventario/stock/**").permitAll() // Consulta pública de stock para clientes
                        .requestMatchers("/api/pedidos", "/api/pedidos/**").permitAll() // TEMPORAL: Para cliente web (usa X-Cliente-Id), admin usa JWT
                        .requestMatchers("/api/logistica/**").authenticated() // Endpoints de logística requieren autenticación JWT
                        .requestMatchers("/uploads/**").permitAll() // Servir archivos estáticos (imágenes)
                        .requestMatchers("/error", "/actuator/health").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(
                    org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .userDetailsService(userDetailsService);

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

