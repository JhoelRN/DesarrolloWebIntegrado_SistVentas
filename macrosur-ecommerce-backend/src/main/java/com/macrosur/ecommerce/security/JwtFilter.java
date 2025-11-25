package com.macrosur.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.macrosur.ecommerce.service.UserDetailsServiceImpl;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, jakarta.servlet.ServletException {

        // Skip JWT processing for login, test, reports and debug endpoints
        String path = req.getRequestURI();
        if (path.equals("/api/auth/login") || path.equals("/api/auth/test") || 
            path.startsWith("/api/reports/") || path.startsWith("/api/debug/")) {
            chain.doFilter(req, res);
            return;
        }

        System.out.println("🔍 JWT Filter processing: " + path);
        
        final String authHeader = req.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            System.out.println("✅ JWT token found");
            try {
                if (jwtUtil.validateToken(jwt)) {
                    username = jwtUtil.extractUsername(jwt);
                    System.out.println("✅ JWT valid, username: " + username);
                } else {
                    System.out.println("❌ JWT validation failed");
                }
            } catch (Exception e) {
                System.out.println("❌ JWT error: " + e.getMessage());
                // Invalid token, continue without authentication
                chain.doFilter(req, res);
                return;
            }
        } else {
            System.out.println("❌ No Authorization header or Bearer token");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                System.out.println("🔄 Loading user details for: " + username);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authentication set for: " + username);
                } else {
                    System.out.println("❌ UserDetails is null for: " + username);
                }
            } catch (Exception e) {
                System.out.println("❌ Error loading user: " + e.getMessage());
                // Error loading user, continue without authentication
            }
        }

        chain.doFilter(req, res);
    }
}
