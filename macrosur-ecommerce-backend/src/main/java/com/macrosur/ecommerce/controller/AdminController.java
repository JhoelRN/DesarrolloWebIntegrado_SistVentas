// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService userService;
    private final RolePermissionService rpService;

    @Autowired
    public AdminController(AdminUserService userService, RolePermissionService rpService) {
        this.userService = userService;
        this.rpService = rpService;
    }

    @GetMapping("/users")
    public List<UsuarioAdminDto> getAdminUsers() {
        return userService.getAdminUsers();
    }

    @PostMapping("/users")
    public ResponseEntity<UsuarioAdminDto> createAdminUser(@RequestBody CreateUserRequest request) {
        UsuarioAdminDto dto = userService.createAdminUser(request);
        return ResponseEntity.status(201).body(dto);
    }

    @PutMapping("/users/{id}")
    public UsuarioAdminDto updateAdminUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userService.updateAdminUser(id, request);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteAdminUser(@PathVariable Long id) {
        userService.deleteAdminUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/status")
    public UsuarioAdminDto toggleUserStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        return userService.toggleUserStatus(id, request);
    }

    @GetMapping("/roles")
    public List<RoleDto> getRoles() {
        return rpService.getRoles();
    }

    @GetMapping("/permissions")
    public List<PermissionDto> getPermissions() {
        return rpService.getPermissions();
    }

    @PutMapping("/roles/{id}/permissions")
    public ResponseEntity<Void> assignPermissionsToRole(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        rpService.assignPermissionsToRole(id, permissionIds);
        return ResponseEntity.noContent().build();
    }
}

