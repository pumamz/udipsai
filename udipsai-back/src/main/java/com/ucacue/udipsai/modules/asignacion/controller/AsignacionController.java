package com.ucacue.udipsai.modules.asignacion.controller;

import com.ucacue.udipsai.modules.asignacion.dto.AsignacionDTO;
import com.ucacue.udipsai.modules.asignacion.dto.AsignacionRequest;
import com.ucacue.udipsai.modules.asignacion.service.AsignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
@Slf4j
public class AsignacionController {

    @Autowired
    private AsignacionService asignacionService;

    @GetMapping
    public List<AsignacionDTO> listarAsignaciones() {
        log.info("Petición GET para listar todas las asignaciones activas");
        return asignacionService.listarAsignaciones();
    }

    @PostMapping
    public ResponseEntity<List<AsignacionDTO>> crearAsignacion(@RequestBody @Valid AsignacionRequest request) {
        log.info("Petición POST para crear asignaciones para Pasante ID: {} con {} pacientes", request.getPasanteId(), request.getPacienteIds().size());
        return ResponseEntity.ok(asignacionService.crearAsignacion(request));
    }
    
    @GetMapping("/pasante/{pasanteId}")
    public List<AsignacionDTO> listarAsignacionesPorPasanteId(@PathVariable Integer pasanteId) {
        log.info("Petición GET para listar asignaciones del pasante ID: {}", pasanteId);
        return asignacionService.listarAsignacionesPorPasanteId(pasanteId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long id) {
        log.info("Petición DELETE para eliminar asignación ID: {}", id);
        asignacionService.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }
}
