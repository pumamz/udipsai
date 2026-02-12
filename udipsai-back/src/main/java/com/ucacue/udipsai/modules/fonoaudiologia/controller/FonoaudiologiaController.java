package com.ucacue.udipsai.modules.fonoaudiologia.controller;

import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaRequest;
import com.ucacue.udipsai.modules.fonoaudiologia.service.FonoaudiologiaReportService;
import com.ucacue.udipsai.modules.fonoaudiologia.service.FonoaudiologiaService;
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
@RequestMapping("/api/fonoaudiologia")
@Slf4j
public class FonoaudiologiaController {

    @Autowired
    private FonoaudiologiaService fonoaudiologiaService;

    @Autowired
    private FonoaudiologiaReportService fonoaudiologiaReportService;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA')")
    public List<FonoaudiologiaDTO> listarFichasFonoaudiologia() {
        log.info("Petición GET para listar todas las fichas de fonoaudiología activas");
        return fonoaudiologiaService.listarFichasFonoaudiologia();
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<FonoaudiologiaDTO> obtenerFichaFonoaudiologiaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener ficha de fonoaudiología del paciente ID: {}", pacienteId);
        FonoaudiologiaDTO ficha = fonoaudiologiaService.obtenerFichaFonoaudiologiaPorPacienteId(pacienteId);
        if (ficha != null) {
            return ResponseEntity.ok(ficha);
        }
        log.warn("Ficha de fonoaudiología no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA_CREAR') and @asignacionSecurity.checkPasanteAcceso(#request.pacienteId)")
    public ResponseEntity<FonoaudiologiaDTO> crearFichaFonoaudiologia(@RequestBody FonoaudiologiaRequest request) {
        log.info("Petición POST para crear ficha de fonoaudiología para Paciente ID: {}", request.getPacienteId());
        try {
            return ResponseEntity.ok(fonoaudiologiaService.crearFichaFonoaudiologia(request));
        } catch (IllegalStateException e) {
             log.warn("Intento de crear ficha duplicada: {}", e.getMessage());
             return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).build();
        } catch (IllegalArgumentException e) {
            log.error("Error de validación: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error al crear ficha fonoaudiología: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA_EDITAR')")
    public ResponseEntity<FonoaudiologiaDTO> actualizarFichaFonoaudiologia(@PathVariable Integer id, @RequestBody FonoaudiologiaRequest request) {
        log.info("Petición PUT para actualizar ficha de fonoaudiología ID: {}", id);
        try {
            return ResponseEntity.ok(fonoaudiologiaService.actualizarFichaFonoaudiologia(id, request));
        } catch (Exception e) {
            log.error("Error al actualizar ficha fonoaudiología: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA_ELIMINAR')")
    public ResponseEntity<Void> eliminarFichaFonoaudiologia(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar ficha fonoaudiología ID: {}", id);
        fonoaudiologiaService.eliminarFichaFonoaudiologia(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA')")
    public ResponseEntity<Resource> exportarExcel(@RequestParam(required = false) Integer pacienteId) {
        try {
            Resource file = new InputStreamResource(fonoaudiologiaReportService.exportarExcel(pacienteId));
            String filename = pacienteId != null ? "ficha_fonoaudiologia_" + pacienteId + ".xlsx" : "fichas_fonoaudiologia.xlsx";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar fichas de fonoaudiología: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
