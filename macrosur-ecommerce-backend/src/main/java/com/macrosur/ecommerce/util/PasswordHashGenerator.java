package com.macrosur.ecommerce.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin"; // Aquí pones la contraseña que quieras
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("Contraseña original: " + rawPassword);
        System.out.println("Hash generado: " + hashedPassword);
    }
}
