# 🛒 Sistema de Ventas – Proyecto Integrador  
**Curso:** Desarrollo Web Integrado – UTP  
**Autor:** Jhoel René Mamani Huanca  

---

## 📘 Descripción General
Este proyecto implementa un **Sistema de Ventas (E-commerce)** desarrollado como parte del curso *Desarrollo Web Integrado*.  
Incluye el diseño completo del **frontend**, **backend** y **base de datos**, siguiendo una arquitectura profesional Cliente–Servidor.

El sistema permite gestionar productos, usuarios, pedidos, reportes y procesos típicos de una tienda virtual, incorporando buenas prácticas de ingeniería de software.

---

## 🏗 Arquitectura del Sistema
El proyecto se basa en una arquitectura **3-Capas**:

- **Frontend:** HTML5, CSS3, JavaScript, Axios  
- **Backend:** Java 21, Spring Boot 3, JPA/Hibernate, Flyway  
- **Base de Datos:** MySQL 8 (modelo normalizado, migraciones automáticas)  

---

## 📦 Funcionalidades Principales

### 👤 Módulo Cliente
- Catálogo de productos  
- Carrito de compras  
- Registro e inicio de sesión  
- Realización de pedidos  
- Perfil del usuario y seguimiento  

### 🛠 Módulo Administrador
- CRUD de productos  
- Gestión de usuarios  
- Gestión de pedidos  
- Reportes y dashboard con métricas básicas  

### 🔧 Backend – API REST
- Validación de datos  
- Seguridad y encriptación de contraseñas  
- Control de stock  
- Respuestas estandarizadas JSON  

---

## 🗄 Base de Datos
El sistema utiliza MySQL con tablas para:

- Usuarios y roles  
- Productos e imágenes  
- Categorías  
- Carritos y pedidos  
- Tokens de autenticación  

Migraciones gestionadas por **Flyway (V1–V8)**.

---

## 🚀 Instalación y Ejecución

### Backend
1. Clonar repositorio:  
   ```bash
   git clone https://github.com/JhoelRN/DesarrolloWebIntegrado_SistVentas
