package com.ucacue.udipsai.modules.historiaclinica.controller;

import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaDTO;
import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaRequest;
import com.ucacue.udipsai.modules.historiaclinica.service.HistoriaClinicaReportService;
import com.ucacue.udipsai.modules.historiaclinica.service.HistoriaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/historia-clinica")
@Slf4j
public class HistoriaClinicaController {

    @Autowired
     private HistoriaClinicaService historiaClinicaService;

    @Autowired
    private com.ucacue.udipsai.modules.asignacion.service.AsignacionSecurityService asignacionSecurity;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA')")
    public List<HistoriaClinicaDTO> listarHistoriasClinicas() {
        log.info("Petición GET para listar todas las historias clínicas activas");
        return historiaClinicaService.listarHistoriasClinicas();
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<HistoriaClinicaDTO> obtenerHistoriaClinicaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener historia clínica del paciente ID: {}", pacienteId);
        HistoriaClinicaDTO historia = historiaClinicaService.obtenerHistoriaClinicaPorPacienteId(pacienteId);
        if (historia != null) {
            return ResponseEntity.ok(historia);
        }
        log.warn("Ficha clínica no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<HistoriaClinicaDTO> crearHistoriaClinica(
            @RequestParam("data") String data,
            @RequestParam(value = "genograma", required = false) MultipartFile genograma) throws IOException {
        
        log.info("Petición POST para crear historia clínica.");
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); 
            HistoriaClinicaRequest request = mapper.readValue(data, HistoriaClinicaRequest.class);
            
            if (!asignacionSecurity.checkPasanteAcceso(request.getPacienteId())) {
                 log.warn("Acceso denegado al crear historia clínica para paciente ID: {}", request.getPacienteId());
                 return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }

            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            boolean canCreate = auth.getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("PERM_HISTORIA_CLINICA_CREAR"));

            if (!canCreate) {
                log.warn("User {} does not have PERM_HISTORIA_CLINICA_CREAR", auth.getName());
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(historiaClinicaService.crearHistoriaClinica(request, genograma));
        } catch (IllegalStateException e) {
             log.warn("Ficha duplicada: {}", e.getMessage());
             return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).build();
        } catch (IOException e) {
            log.error("Error I/O: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error al crear historia clínica: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinicaDTO> actualizarHistoriaClinica(
            @PathVariable Integer id,
            @RequestParam("data") String data,
            @RequestParam(value = "genograma", required = false) MultipartFile genograma) throws IOException {
        
        log.info("Petición PUT para actualizar historia clínica ID: {}", id);
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); 
            HistoriaClinicaRequest request = mapper.readValue(data, HistoriaClinicaRequest.class);
            
            if (request.getPacienteId() != null) {
                if (!asignacionSecurity.checkPasanteAcceso(request.getPacienteId())) {
                     log.warn("Acceso denegado (Pasante) para paciente ID: {}", request.getPacienteId());
                     return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
                }
            }

            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            boolean canEdit = auth.getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("PERM_HISTORIA_CLINICA_EDITAR"));

            if (!canEdit) {
                 log.warn("User {} does not have PERM_HISTORIA_CLINICA_EDITAR", auth.getName());
                 return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(historiaClinicaService.actualizarHistoriaClinica(id, request, genograma));
        } catch (IOException e) {
            log.error("Error I/O: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error al actualizar historia clínica: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/paciente/{pacienteId}/genograma")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<Resource> descargarGenograma(@PathVariable Integer pacienteId) {
        log.info("Petición GET para descargar genograma del paciente ID: {}", pacienteId);
        Resource file = historiaClinicaService.cargarGenogramaComoRecurso(pacienteId);
        if (file == null) {
            log.warn("Genograma no encontrado para paciente ID: {}", pacienteId);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
    
    @Autowired
    private HistoriaClinicaReportService reportService;

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA')")
    public ResponseEntity<Resource> exportarExcel(@RequestParam(required = false) Integer pacienteId) {
        try {
            Resource file = new InputStreamResource(reportService.exportarExcel(pacienteId));
            String filename = pacienteId != null ? "historia_clinica_" + pacienteId + ".xlsx" : "historias_clinicas.xlsx";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar historias clínicas: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA_ELIMINAR')")
    public ResponseEntity<Void> eliminarHistoriaClinica(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar historia clínica ID: {}", id);
        historiaClinicaService.eliminarHistoriaClinica(id);
        return ResponseEntity.noContent().build();
    }
}
