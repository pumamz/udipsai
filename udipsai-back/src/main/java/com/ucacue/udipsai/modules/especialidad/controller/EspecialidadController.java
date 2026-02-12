package com.ucacue.udipsai.modules.especialidad.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadCriteriaDTO;
import com.ucacue.udipsai.modules.especialidad.service.EspecialidadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/especialidades")
@Slf4j
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES')")
    public ResponseEntity<Page<Especialidad>> listarEspecialidadesActivas(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(especialidadService.listarEspecialidadesActivas(pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES')")
    public ResponseEntity<Page<Especialidad>> filtrarEspecialidades(
            EspecialidadCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(especialidadService.filtrarEspecialidades(criteria, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES')")
    public ResponseEntity<Especialidad> obtenerPorId(@PathVariable Integer id) {
        return especialidadService.obtenerEspecialidadPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Especialidad con ID {} no encontrada", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES_CREAR')")
    public ResponseEntity<Especialidad> crearEspecialidad(@RequestBody Especialidad especialidad) {
        return ResponseEntity.ok(especialidadService.crearEspecialidad(especialidad));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES_EDITAR')")
    public ResponseEntity<Especialidad> actualizarEspecialidad(@PathVariable Integer id, @RequestBody Especialidad especialidad) {
        try {
            return ResponseEntity.ok(especialidadService.actualizarEspecialidad(id, especialidad));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES_ELIMINAR')")
    public ResponseEntity<Void> eliminarEspecialidad(@PathVariable Integer id) {
        especialidadService.eliminarEspecialidad(id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.ucacue.udipsai.modules.especialidad.service.EspecialidadReportService especialidadReportService;

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_ESPECIALIDADES')")
    public ResponseEntity<org.springframework.core.io.Resource> exportExcel(EspecialidadCriteriaDTO criteria) {
        try {
            org.springframework.core.io.Resource file = new org.springframework.core.io.InputStreamResource(especialidadReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=especialidades.xlsx")
                    .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
