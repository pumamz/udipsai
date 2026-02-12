package com.ucacue.udipsai.modules.psicologiaeducativa.controller;

import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaRequest;
import com.ucacue.udipsai.modules.psicologiaeducativa.service.PsicologiaEducativaReportService;
import com.ucacue.udipsai.modules.psicologiaeducativa.service.PsicologiaEducativaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/psicologia-educativa")
@Slf4j
public class PsicologiaEducativaController {

    @Autowired
    private PsicologiaEducativaService service;

    @Autowired
    private PsicologiaEducativaReportService reportService;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA')")
    public ResponseEntity<List<PsicologiaEducativaDTO>> listarFichasPsicologiaEducativa() {
        log.info("Petición GET para listar todas las fichas de psicología educativa activas");
        return ResponseEntity.ok(service.listarFichasPsicologiaEducativa());
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<PsicologiaEducativaDTO> obtenerFichaPsicologiaEducativaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener ficha de psicología educativa por paciente ID: {}", pacienteId);
        PsicologiaEducativaDTO ficha = service.obtenerFichaPsicologiaEducativaPorPacienteId(pacienteId);
        if (ficha != null) {
            return ResponseEntity.ok(ficha);
        }
        log.warn("Ficha de psicología educativa no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA_CREAR') and @asignacionSecurity.checkPasanteAcceso(#request.pacienteId)")
    public ResponseEntity<PsicologiaEducativaDTO> crearFichaPsicologiaEducativa(@RequestBody PsicologiaEducativaRequest request) {
        log.info("Petición POST para crear ficha de psicología educativa para paciente ID: {}", request.getPacienteId());
        try {
            return ResponseEntity.ok(service.crearFichaPsicologiaEducativa(request));
        } catch (IllegalStateException e) {
             log.warn("Intento de crear ficha duplicada: {}", e.getMessage());
             return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("Error al crear ficha de psicología educativa: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA_EDITAR')")
    public ResponseEntity<PsicologiaEducativaDTO> actualizarFichaPsicologiaEducativa(@PathVariable Integer id, @RequestBody PsicologiaEducativaRequest request) {
        log.info("Petición PUT para actualizar ficha de psicología educativa ID: {}", id);
        try {
            return ResponseEntity.ok(service.actualizarFichaPsicologiaEducativa(id, request));
        } catch (Exception e) {
            log.error("Error al actualizar ficha de psicología educativa: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA')")
    public ResponseEntity<Resource> exportarExcel(@RequestParam(required = false) Integer pacienteId) {
        try {
            Resource file = new InputStreamResource(reportService.exportarExcel(pacienteId));
            String filename = pacienteId != null ? "ficha_psicologia_educativa_" + pacienteId + ".xlsx" : "fichas_psicologia_educativa.xlsx";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar fichas de psicología educativa: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA_ELIMINAR')")
    public ResponseEntity<Void> eliminarFichaPsicologiaEducativa(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar ficha de psicología educativa ID: {}", id);
        service.eliminarFichaPsicologiaEducativa(id);
        return ResponseEntity.noContent().build();
    }
}
