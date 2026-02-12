package com.ucacue.udipsai.modules.permisos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permisos")
@CrossOrigin(origins = "*")
public class PermisoController {

    @Autowired
    private PermisoService permisoService;

    @GetMapping("/especialista/{id}")
    public ResponseEntity<PermisosDTO> obtenerPermisosEspecialista(@PathVariable Integer id) {
        return ResponseEntity.ok(permisoService.obtenerPermisosEspecialista(id));
    }

    @PutMapping("/especialista/{id}")
    @PreAuthorize("hasAnyRole('ESPECIALISTA')")
    public ResponseEntity<PermisosDTO> actualizarPermisosEspecialista(@PathVariable Integer id, @RequestBody PermisosDTO dto) {
        return ResponseEntity.ok(permisoService.actualizarPermisosEspecialista(id, dto));
    }

    @GetMapping("/pasante/{id}")
    public ResponseEntity<PermisosDTO> obtenerPermisosPasante(@PathVariable Integer id) {
        return ResponseEntity.ok(permisoService.obtenerPermisosPasante(id));
    }

    @PutMapping("/pasante/{id}")
    @PreAuthorize("hasAnyRole('ESPECIALISTA')")
    public ResponseEntity<PermisosDTO> actualizarPermisosPasante(@PathVariable Integer id, @RequestBody PermisosDTO dto) {
        return ResponseEntity.ok(permisoService.actualizarPermisosPasante(id, dto));
    }
}
