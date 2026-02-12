package com.ucacue.udipsai.modules.especialistas.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaRequest;
import com.ucacue.udipsai.modules.especialistas.service.EspecialistaService;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaCriteriaDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/especialistas")
@CrossOrigin(origins = "*")
@Slf4j
public class EspecialistaController {

    @Autowired
    private EspecialistaService especialistaService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/activos")
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS')")
    public ResponseEntity<Page<EspecialistaDTO>> listarEspecialistasActivos(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(especialistaService.listarEspecialistasActivos(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS')")
    public ResponseEntity<EspecialistaDTO> obtenerEspecialistaPorId(@PathVariable Integer id) {
        EspecialistaDTO especialista = especialistaService.obtenerEspecialistaPorId(id);
        if (especialista != null) {
            return ResponseEntity.ok(especialista);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS')")
    public ResponseEntity<Page<EspecialistaDTO>> filtrarEspecialistas(
            EspecialistaCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(especialistaService.filtrarEspecialistas(criteria, pageable));
    }


    @GetMapping("/foto/{filename:.+}")
    @ResponseBody
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS')")
    public ResponseEntity<Resource> obtenerFotoEspecialista(@PathVariable String filename) {
        log.debug("Solicitud para obtener foto: {}", filename);
        Resource file = storageService.loadAsResource(filename);
        if (file == null) {
            log.warn("Foto {} no encontrada", filename);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS_CREAR')")
    public ResponseEntity<?> crearEspecialista(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición POST para crear especialista. Data: {}", dataJson);
        try {
            EspecialistaRequest request = objectMapper.readValue(dataJson, EspecialistaRequest.class);
            EspecialistaDTO created = especialistaService.crearEspecialista(request, file);
            return ResponseEntity.ok(created);
        } catch (JsonProcessingException e) {
            log.error("Error el parsear JSON en creación de especialista: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON");
        } catch (Exception e) {
            log.error("Error al crear especialista: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating especialista: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS_EDITAR')")
    public ResponseEntity<?> actualizarEspecialista(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición PUT para actualizar especialista ID: {}", id);
        try {
            EspecialistaRequest request = objectMapper.readValue(dataJson, EspecialistaRequest.class);
            EspecialistaDTO updated = especialistaService.actualizarEspecialista(id, request, file);
            return ResponseEntity.ok(updated);
        } catch (JsonProcessingException e) {
            log.error("Error al parsear JSON en actualización: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error parsing JSON");
        } catch (Exception e) {
            log.error("Error al actualizar especialista ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Error updating especialista: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS_ELIMINAR')")
    public ResponseEntity<Void> eliminarEspecialista(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar especialista ID: {}", id);
        especialistaService.eliminarEspecialista(id);
        return ResponseEntity.noContent().build();
    }

    @Autowired
    private com.ucacue.udipsai.modules.especialistas.service.EspecialistaReportService especialistaReportService;

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('PERM_ESPECIALISTAS')")
    public ResponseEntity<Resource> exportExcel(EspecialistaCriteriaDTO criteria) {
        try {
            Resource file = new org.springframework.core.io.InputStreamResource(especialistaReportService.exportarExcel(criteria));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=especialistas.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(file);
        } catch (Exception e) {
            log.error("Error al exportar Excel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
