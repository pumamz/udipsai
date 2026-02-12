package com.ucacue.udipsai.modules.paciente.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.io.IOException;
import com.ucacue.udipsai.modules.paciente.dto.*;
import com.ucacue.udipsai.modules.paciente.service.PacienteReportService;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pacientes")
@Slf4j
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private PacienteReportService pacienteReportService;

    @Autowired
    private ObjectMapper objectMapper;


    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<Page<PacienteDTO>> listarPacientesActivos(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Petición GET para listar pacientes activos paginados");
        return ResponseEntity.ok(pacienteService.listarPacientesActivos(pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<Page<PacienteDTO>> filtrarPacientes(
            PacienteCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Petición GET para filtrar pacientes");
        return ResponseEntity.ok(pacienteService.filtrarPacientes(criteria, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PACIENTES') and @asignacionSecurity.checkPasanteAcceso(#id)")
    public ResponseEntity<PacienteDTO> obtenerPacientePorId(@PathVariable Integer id) {
        log.info("Petición GET para obtener paciente ID: {}", id);
        PacienteDTO dto = pacienteService.obtenerPacientePorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        }
        log.warn("Paciente no encontrado ID: {}", id);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/foto/{filename:.+}")
    @ResponseBody
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<Resource> obtenerFotoPaciente(@PathVariable String filename) {
        log.debug("Solicitando foto de paciente: {}", filename);
        Resource file = storageService.loadAsResource(filename);
        if (file == null) {
            log.warn("Foto no encontrada: {}", filename);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
            .body(file);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_PACIENTES_CREAR')")
    public ResponseEntity<?> crearPaciente(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "fichaCompromiso", required = false) MultipartFile fichaCompromiso,
            @RequestPart(value = "fichaDeteccion", required = false) MultipartFile fichaDeteccion,
            @RequestPart(value = "otrosDocumentos", required = false) List<MultipartFile> otrosDocumentos) {
        log.info("Petición POST para crear paciente. Data length: {}", dataJson.length());
        try {
            PacienteRequest request = objectMapper.readValue(dataJson, PacienteRequest.class);
            PacienteDTO created = pacienteService.crearPaciente(request, file, fichaCompromiso, fichaDeteccion, otrosDocumentos);
            return ResponseEntity.ok(created);
        } catch (JsonProcessingException e) {
            log.error("Error al parsear JSON en creación de paciente: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error al crear paciente: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating paciente: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_PACIENTES_EDITAR') and @asignacionSecurity.checkPasanteAcceso(#id)")
    public ResponseEntity<?> actualizarPaciente(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "fichaCompromiso", required = false) MultipartFile fichaCompromiso,
            @RequestPart(value = "fichaDeteccion", required = false) MultipartFile fichaDeteccion,
            @RequestPart(value = "otrosDocumentos", required = false) List<MultipartFile> otrosDocumentos) {
        log.info("Petición PUT para actualizar paciente ID: {}", id);
        try {
            PacienteRequest request = objectMapper.readValue(dataJson, PacienteRequest.class);
            PacienteDTO updated = pacienteService.actualizarPaciente(id, request, file, fichaCompromiso, fichaDeteccion, otrosDocumentos);
            return ResponseEntity.ok(updated);
        } catch (JsonProcessingException e) {
            log.error("Error al parsear JSON en actualización de paciente: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error al actualizar paciente ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Error updating paciente: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PACIENTES_ELIMINAR') and @asignacionSecurity.checkPasanteAcceso(#id)")
    public ResponseEntity<?> eliminarPaciente(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar paciente ID: {}", id);
        try {
            pacienteService.eliminarPaciente(id);
            return ResponseEntity.ok("Paciente eliminado (inactivado)");
        } catch (Exception e) {
            log.error("Error al eliminar paciente ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/resumen-fichas")
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<PacienteSummaryDTO> obtenerResumenFichas(@PathVariable Integer id) {

        log.info("Petición GET para obtener resumen de fichas del paciente ID: {}", id);
        return ResponseEntity.ok(pacienteService.obtenerResumenFichas(id));
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<Resource> exportExcel(PacienteCriteriaDTO criteria) {
        try {
            Resource file = new org.springframework.core.io.InputStreamResource(pacienteReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pacientes.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (IOException e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            log.error("Error inesperado al exportar Excel: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasAuthority('PERM_PACIENTES') and @asignacionSecurity.checkPasanteAcceso(#id)")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Integer id) {
        try {
            byte[] pdf = pacienteReportService.exportarPdfDetalle(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=paciente_detalle.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            log.error("Error al exportar PDF ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/documentos/{id}")
    @PreAuthorize("hasAuthority('PERM_PACIENTES')")
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Integer id) {
        log.info("Petición GET para descargar documento ID: {}", id);
        Resource file = pacienteService.descargarDocumento(id);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
            .body(file);
    }

    @DeleteMapping("/documentos/{id}")
    @PreAuthorize("hasAuthority('PERM_PACIENTES_ELIMINAR')")
    public ResponseEntity<?> eliminarDocumento(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar documento ID: {}", id);
        try {
            pacienteService.eliminarDocumento(id);
            return ResponseEntity.ok("Documento eliminado");
        } catch (Exception e) {
            log.error("Error al eliminar documento: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

