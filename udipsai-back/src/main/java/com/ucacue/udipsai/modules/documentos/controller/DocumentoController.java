package com.ucacue.udipsai.modules.documentos.controller;

import com.ucacue.udipsai.modules.documentos.service.DocumentoService;
import com.ucacue.udipsai.modules.documentos.domain.Documento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
@Slf4j
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @PostMapping
    public ResponseEntity<Documento> crearDocumento(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pacienteId") Integer pacienteId,
            @RequestParam("nombre") String nombre ) {
        log.info("Petición POST para guardar documento: {} para paciente ID: {}", nombre, pacienteId);
        try {
            Documento savedDocumento = documentoService.crearDocumento(file, pacienteId, nombre);
            return ResponseEntity.ok(savedDocumento);
        } catch (Exception e) {
            log.error("Error al guardar documento: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Documento> obtenerDocumentoPorId(@PathVariable Integer id) {
        log.info("Petición GET para obtener documento por ID: {}", id);
        Optional<Documento> documento = documentoService.obtenerDocumentoPorId(id);
        return documento.map(ResponseEntity::ok).orElseGet(() -> {
            log.warn("Documento ID {} no encontrado", id);
            return ResponseEntity.notFound().build();
        });
    }

    @GetMapping("/{id}/descargar")
    @ResponseBody
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Integer id) {
        log.info("Petición GET para descargar documento ID: {}", id);
        Resource file = documentoService.cargarDocumentoComoRecurso(id);
        if (file == null) {
            log.warn("Recurso de documento ID {} no encontrado", id);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDocumento(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar documento ID: {}", id);
        documentoService.eliminarDocumento(id);
        return ResponseEntity.noContent().build();
    }
}
