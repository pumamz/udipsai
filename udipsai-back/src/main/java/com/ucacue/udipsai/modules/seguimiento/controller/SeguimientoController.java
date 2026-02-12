package com.ucacue.udipsai.modules.seguimiento.controller;

import com.ucacue.udipsai.modules.seguimiento.dto.SeguimientoDTO;
import com.ucacue.udipsai.modules.seguimiento.dto.SeguimientoRequest;
import com.ucacue.udipsai.modules.seguimiento.service.SeguimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(origins = "*")
@Slf4j
public class SeguimientoController {

    @Autowired
    private SeguimientoService seguimientoService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<SeguimientoDTO>> listarSeguimientosActivos() {
        log.info("Petición GET para listar todos los seguimientos activos");
        return ResponseEntity.ok(seguimientoService.listarSeguimientosActivos());
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<SeguimientoDTO>> listarSeguimientosPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para listar seguimientos por paciente ID: {}", pacienteId);
        return ResponseEntity.ok(seguimientoService.listarSeguimientosPorPacienteId(pacienteId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearSeguimiento(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición POST para crear seguimiento");
        try {
            SeguimientoRequest request = objectMapper.readValue(dataJson, SeguimientoRequest.class);
            return ResponseEntity.ok(seguimientoService.crearSeguimiento(request, file));
        } catch (Exception e) {
            log.error("Error al crear seguimiento: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizarSeguimiento(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("Petición PUT para actualizar seguimiento ID: {}", id);
        try {
            SeguimientoRequest request = objectMapper.readValue(dataJson, SeguimientoRequest.class);
            return ResponseEntity.ok(seguimientoService.actualizarSeguimiento(id, request, file));
        } catch (Exception e) {
            log.error("Error al actualizar seguimiento ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSeguimiento(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar seguimiento ID: {}", id);
        seguimientoService.eliminarSeguimiento(id);
        return ResponseEntity.noContent().build();
    }
}
