package com.ucacue.udipsai.modules.citas.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ucacue.udipsai.modules.citas.dto.*;
import com.ucacue.udipsai.modules.citas.service.CitaService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/citas")
@Slf4j
public class CitaController {

    @Autowired
    private CitaService citaServ;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_CITAS')")
    public ResponseEntity<Page<CitaDTO>> obtenerCitas(
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitas(pageable, request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS') or hasRole('ROLE_ESPECIALISTA') or hasRole('ROLE_PASANTE')")
    public ResponseEntity<?> obtenerCita(@PathVariable Integer id, HttpServletRequest request) {
        return citaServ.obtenerCitaPorId(id, request);
    }

    @GetMapping("/horas-libres/{profesionalId}/")
    @PreAuthorize("hasAuthority('PERM_CITAS') or hasRole('ROLE_ESPECIALISTA') or hasRole('ROLE_PASANTE')")
    public ResponseEntity<?> encontrarHorasLibresProfesional(@PathVariable Integer profesionalId,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate fecha, HttpServletRequest request) {
        return citaServ.encontrarHorasLibresProfesional(profesionalId, fecha, request);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_CITAS_CREAR')")
    public ResponseEntity<?> registrarCita(@RequestBody RegistrarCitaDTO cita, HttpServletRequest request) {
        return citaServ.registrarCita(cita, request);
    }

    @PutMapping("/reagendar/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS_EDITAR') or hasRole('ROLE_ESPECIALISTA')")
    public ResponseEntity<?> reagendarCita(@PathVariable Integer id, @RequestBody RegistrarCitaDTO cita,
            HttpServletRequest request) {
        return citaServ.reagendarCita(id, cita, request);
    }

    @PatchMapping("/falta-justificada/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS_EDITAR') or hasRole('ROLE_ESPECIALISTA')")
    public ResponseEntity<?> faltaJustificada(@PathVariable Integer id) {
        return citaServ.faltaJustificadaResponseEntity(id);
    }

    @PatchMapping("/falta-injustificada/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS_EDITAR') or hasRole('ROLE_ESPECIALISTA')")
    public ResponseEntity<?> faltaInjustificada(@PathVariable Integer id) {
        return citaServ.faltaInjustificadaResponseEntity(id);
    }

    @PatchMapping("/finalizar/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS_EDITAR') or hasRole('ROLE_ESPECIALISTA')")
    public ResponseEntity<?> finalizarCita(@PathVariable Integer id) {
        return citaServ.finalizarCitaResponseEntity(id);
    }

    @PatchMapping("/cancelar/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS_ELIMINAR') or hasRole('ROLE_ESPECIALISTA')")
    public ResponseEntity<?> cancelarCita(@PathVariable Integer id) {
        return citaServ.cancelarCitaResponseEntity(id);
    }

    @GetMapping("/profesional/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS') or hasRole('ROLE_ESPECIALISTA') or hasRole('ROLE_PASANTE')")
    public ResponseEntity<?> obtenerCitasPorProfesional(@PathVariable Integer id,
            @RequestParam(required = false) String tipo,
            @PageableDefault(page = 0, size = 5, sort = "estado") Pageable pageable, HttpServletRequest request) {
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("estado").descending());
        return citaServ.obtenerCitasPorProfesional(id, pageable, tipo);
    }

    @GetMapping("/especialidad/{id}")
    @PreAuthorize("hasAuthority('PERM_CITAS')")
    public ResponseEntity<?> obtenerCitasPorEspecialidad(@PathVariable Integer id,
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEspecialidad(id, pageable);
    }

    @GetMapping("/resumen/{profesionalId}")
    @PreAuthorize("hasAuthority('PERM_CITAS') or hasRole('ROLE_ESPECIALISTA') or hasRole('ROLE_PASANTE')")
    public ResponseEntity<?> obtenerResumenDashboard(@PathVariable Integer profesionalId) {
        return citaServ.obtenerResumenDashboard(profesionalId);
    }

}
