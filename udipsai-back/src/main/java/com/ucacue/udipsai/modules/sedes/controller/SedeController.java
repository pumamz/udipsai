package com.ucacue.udipsai.modules.sedes.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.ucacue.udipsai.modules.sedes.dto.SedeCriteriaDTO;
import com.ucacue.udipsai.modules.sedes.service.SedeService;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/sedes")
@Slf4j
public class SedeController {

    private final SedeService sedeService;

    public SedeController(SedeService sedeService) {
        this.sedeService = sedeService;
    }

    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_SEDES')")
    public ResponseEntity<Page<Sede>> listarSedesActivas(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sedeService.listarSedesActivas(pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_SEDES')")
    public ResponseEntity<Page<Sede>> filtrarSedes(
            SedeCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sedeService.filtrarSedes(criteria, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SEDES')")
    public ResponseEntity<Sede> obtenerSedePorId(@PathVariable Integer id) {
        return sedeService.obtenerSedePorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Sede con ID {} no encontrada en la petición GET", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping()
    @PreAuthorize("hasAuthority('PERM_SEDES_CREAR')")
    public ResponseEntity<Sede> crearSede(@RequestBody Sede request) {
        Sede nuevaSede = sedeService.crearSede(request);
        return new ResponseEntity<>(nuevaSede, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SEDES_EDITAR')")
    public ResponseEntity<Sede> actualizarSede(@PathVariable Integer id, @RequestBody Sede nuevaSede) {
        try {
            return ResponseEntity.ok(sedeService.actualizarSede(id, nuevaSede));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_SEDES_ELIMINAR')")
    public ResponseEntity<Void> eliminarSede(@PathVariable Integer id) {
        log.info("Petición DELETE para desactivar sede ID: {}", id);
        sedeService.eliminarSede(id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.ucacue.udipsai.modules.sedes.service.SedeReportService sedeReportService;

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_SEDES')")
    public ResponseEntity<org.springframework.core.io.Resource> exportExcel(SedeCriteriaDTO criteria) {
        try {
            org.springframework.core.io.Resource file = new org.springframework.core.io.InputStreamResource(sedeReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sedes.xlsx")
                    .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
