package com.macrosur.ecommerce.test;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String plainPassword = "123456";
        String existingHash = "$2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se";
        
        System.out.println("Testing BCrypt password validation:");
        System.out.println("Plain password: " + plainPassword);
        System.out.println("Existing hash: " + existingHash);
        
        boolean matches = encoder.matches(plainPassword, existingHash);
        System.out.println("Password matches: " + matches);
        
        // Generar un nuevo hash para comparar
        String newHash = encoder.encode(plainPassword);
        System.out.println("New hash generated: " + newHash);
        System.out.println("New hash matches: " + encoder.matches(plainPassword, newHash));
    }
}