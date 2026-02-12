package com.ucacue.udipsai.modules.citas.controller;

import com.ucacue.udipsai.modules.citas.dto.ReporteCitaRespuestaDTO;
import com.ucacue.udipsai.modules.citas.service.ReporteCitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas/reporte")
public class ReporteCitaController {

    @Autowired
    private ReporteCitaService reporteCitaService;

    @GetMapping("/paciente/{id}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorPaciente(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "SECRETARIA") String tipo,
            @RequestParam(defaultValue = "RAPIDO") String alcance) {
        return ResponseEntity.ok(reporteCitaService.generarReportePorPaciente(id, tipo, alcance));
    }

    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorCedula(
            @PathVariable String cedula,
            @RequestParam(defaultValue = "SECRETARIA") String tipo,
            @RequestParam(defaultValue = "RAPIDO") String alcance) {
        return reporteCitaService.generarReportePorCedula(cedula, tipo, alcance)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
