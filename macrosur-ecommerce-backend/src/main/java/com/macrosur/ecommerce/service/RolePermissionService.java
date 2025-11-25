// java
package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.*;
import com.macrosur.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RolePermissionService {

    private final RoleRepository roleRepo;
    private final PermissionRepository permissionRepo;

    @Autowired
    public RolePermissionService(RoleRepository roleRepo, PermissionRepository permissionRepo) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
    }

    public List<RoleDto> getRoles() {
        return roleRepo.findAll().stream().map(r -> {
            RoleDto dto = new RoleDto();
            dto.rol_id = r.getRol_id();
            dto.nombreRol = r.getNombreRol();
            return dto;
        }).collect(Collectors.toList());
    }

    public List<PermissionDto> getPermissions() {
        return permissionRepo.findAll().stream().map(p -> {
            PermissionDto dto = new PermissionDto();
            dto.permiso_id = p.getPermiso_id();
            dto.nombrePermiso = p.getNombrePermiso();
            return dto;
        }).collect(Collectors.toList());
    }

    public void assignPermissionsToRole(Long roleId, List<Long> permissionIds) {
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        Set<Permission> perms = new HashSet<>(permissionRepo.findAllById(permissionIds));
        role.setPermissions(perms);
        roleRepo.save(role);
    }
}
