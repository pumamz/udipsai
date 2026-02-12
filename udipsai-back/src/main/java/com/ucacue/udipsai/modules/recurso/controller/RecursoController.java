package com.ucacue.udipsai.modules.recurso.controller;

import java.io.IOException;

import com.ucacue.udipsai.modules.recurso.service.RecursoService;
import com.ucacue.udipsai.modules.recurso.domain.Recurso;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/recursos")
public class RecursoController {
    @Autowired
    private RecursoService recursoService;

    @GetMapping
    public List<Recurso> listar() {
        return recursoService.listarTodos();
    }

    @PostMapping(value = "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crear(
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("tipo") String tipo,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            if (archivo.isEmpty()) {
                return ResponseEntity.badRequest().body("El archivo es obligatorio");
            }

            Recurso nuevoRecurso = new Recurso();
            nuevoRecurso.setNombre(titulo);
            nuevoRecurso.setDescripcion(descripcion);
            nuevoRecurso.setTipo(tipo);

            Recurso guardado = recursoService.guardarConArchivo(nuevoRecurso, archivo);

            return ResponseEntity.ok(guardado);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir el archivo: " + e.getMessage());
        }
    }

    @PutMapping(value = "/reemplazar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> reemplazarArchivo(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            if (archivo == null || archivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Debes seleccionar un archivo nuevo."));
            }

            Recurso actualizado = recursoService.reemplazarArchivo(id, archivo);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Archivo actualizado correctamente",
                    "recurso", actualizado));

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error de escritura en disco"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        recursoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path file = recursoService.cargarArchivo(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}