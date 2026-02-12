package com.ucacue.udipsai.modules.instituciones.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaCriteriaDTO;
import com.ucacue.udipsai.modules.instituciones.service.InstitucionEducativaService;
import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import java.util.Optional;

@RestController
@RequestMapping("/api/instituciones")
@CrossOrigin(origins = "*")
@Slf4j
public class InstitucionEducativaController {

    private final InstitucionEducativaService institucionEducativaService;

    public InstitucionEducativaController(InstitucionEducativaService institucionEducativaService) {
        this.institucionEducativaService = institucionEducativaService;
    }

    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS')")
    public ResponseEntity<Page<InstitucionEducativa>> listarInstitucionesActivas(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(institucionEducativaService.listarInstitucionesActivas(pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS')")
    public ResponseEntity<Page<InstitucionEducativa>> filtrarInstituciones(
            InstitucionEducativaCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(institucionEducativaService.filtrarInstituciones(criteria, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS')")
    public ResponseEntity<InstitucionEducativa> obtenerInstitucionPorId(@PathVariable Integer id) {
        log.info("Petición GET para obtener institución educativa ID: {}", id);
        Optional<InstitucionEducativa> institucionOpt = institucionEducativaService.obtenerInstitucionPorId(id);
        if (institucionOpt.isPresent()) {
            return ResponseEntity.ok(institucionOpt.get());
        }
        log.warn("Institución educativa no encontrada ID: {}", id);
        return ResponseEntity.notFound().build();
    }

    @PostMapping()
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS_CREAR')")
    public ResponseEntity<InstitucionEducativa> crearInstitucion(@RequestBody InstitucionEducativa institucionEducativa) {
        log.info("Petición POST para crear institución educativa: {}", institucionEducativa.getNombre());
        try {
            InstitucionEducativa created = institucionEducativaService.crearInstitucion(institucionEducativa);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error al crear institución educativa: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS_EDITAR')")
    public ResponseEntity<InstitucionEducativa> actualizarInstitucion(@PathVariable Integer id, @RequestBody InstitucionEducativa nuevaInstitucion) {
        log.info("Petición PUT para actualizar institución educativa ID: {}", id);
        try {
            InstitucionEducativa institucionActualizada = institucionEducativaService.actualizarInstitucion(id, nuevaInstitucion);
            return ResponseEntity.ok(institucionActualizada);
        } catch (RuntimeException e) {
            log.error("Error al actualizar institución educativa ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS_ELIMINAR')")
    public ResponseEntity<Void> eliminarInstitucion(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar institución educativa ID: {}", id);
        institucionEducativaService.eliminarInstitucion(id);
        return ResponseEntity.noContent().build();
    }
    @org.springframework.beans.factory.annotation.Autowired
    private com.ucacue.udipsai.modules.instituciones.service.InstitucionReportService institucionReportService;

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_INSTITUCIONES_EDUCATIVAS')")
    public ResponseEntity<org.springframework.core.io.Resource> exportExcel(InstitucionEducativaCriteriaDTO criteria) {
        try {
            org.springframework.core.io.Resource file = new org.springframework.core.io.InputStreamResource(institucionReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=instituciones.xlsx")
                    .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
