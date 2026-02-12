package com.ucacue.udipsai.modules.pasante.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucacue.udipsai.modules.pasante.dto.PasanteCriteriaDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteRequest;
import com.ucacue.udipsai.modules.pasante.service.PasanteReportService;
import com.ucacue.udipsai.modules.pasante.service.PasanteService;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/pasantes")
@CrossOrigin(origins = "*")
@Slf4j
public class PasanteController {

    @Autowired
    private PasanteService pasanteService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasanteReportService pasanteReportService;

    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<Page<PasanteDTO>> listarPasantesActivos(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(pasanteService.listarPasantesActivos(pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<Page<PasanteDTO>> filtrarPasantes(
            PasanteCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(pasanteService.filtrarPasantes(criteria, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<PasanteDTO> obtenerPasantePorId(@PathVariable Integer id) {
        PasanteDTO pasante = pasanteService.obtenerPasantePorId(id);
        if (pasante != null) {
            return ResponseEntity.ok(pasante);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<List<PasanteDTO>> buscarPasantes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer especialistaId) {
        log.info("Petición búsqueda pasantes. Search: {}, EspecialistaId: {}", search, especialistaId);
        return ResponseEntity.ok(pasanteService.buscarPasantes(search, especialistaId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_PASANTES_CREAR')")
    public ResponseEntity<?> crearPasante(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición POST para crear pasante. Data: {}", dataJson);
        try {
            PasanteRequest request = objectMapper.readValue(dataJson, PasanteRequest.class);
            PasanteDTO created = pasanteService.crearPasante(request, file);
            return ResponseEntity.ok(created);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON al crear pasante: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON");
        } catch (Exception e) {
            log.error("Error al crear pasante: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating pasante: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_PASANTES_EDITAR')")
    public ResponseEntity<?> actualizarPasante(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición PUT para actualizar pasante ID: {}", id);
        try {
            PasanteRequest request = objectMapper.readValue(dataJson, PasanteRequest.class);
            PasanteDTO updated = pasanteService.actualizarPasante(id, request, file);
            return ResponseEntity.ok(updated);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON al actualizar pasante ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON");
        } catch (Exception e) {
            log.error("Error al actualizar pasante ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Error updating pasante: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PASANTES_ELIMINAR')")
    public ResponseEntity<Void> eliminarPasante(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar pasante ID: {}", id);
        pasanteService.eliminarPasante(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fotos/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> obtenerFotoPasante(@PathVariable String filename) {
        log.debug("Solicitando foto de pasante: {}", filename);
        Resource file = storageService.loadAsResource(filename);
        if (file == null) {
            log.warn("Foto no encontrada: {}", filename);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<Resource> exportExcel(PasanteCriteriaDTO criteria) {
        try {
            Resource file = new org.springframework.core.io.InputStreamResource(pasanteReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pasantes.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasAuthority('PERM_PASANTES')")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Integer id) {
        try {
            byte[] pdf = pasanteReportService.exportarPdfDetalle(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pasante_detalle.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            log.error("Error al exportar PDF ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
