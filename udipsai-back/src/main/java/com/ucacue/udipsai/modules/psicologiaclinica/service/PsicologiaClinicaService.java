package com.ucacue.udipsai.modules.psicologiaclinica.service;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.psicologiaclinica.domain.PsicologiaClinica;
import com.ucacue.udipsai.modules.psicologiaclinica.dto.PsicologiaClinicaDTO;
import com.ucacue.udipsai.modules.psicologiaclinica.repository.PsicologiaClinicaRepository;
import com.ucacue.udipsai.modules.psicologiaclinica.dto.PsicologiaClinicaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PsicologiaClinicaService {

    @Autowired
    private PsicologiaClinicaRepository repository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<PsicologiaClinicaDTO> listarFichasPsicologiaClinica() {
        log.info("Consultando todas las fichas de psicología clínica activas");
        return repository.findAll().stream()
                .filter(PsicologiaClinica::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PsicologiaClinicaDTO obtenerFichaPsicologiaClinicaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha de psicología clínica por paciente ID: {}", pacienteId);
        PsicologiaClinica ficha = repository.findByPacienteIdAndActivo(pacienteId, true);
        if (ficha != null && ficha.getActivo()) {
            return convertirADTO(ficha);
        }
        return null;
    }
    
    @Transactional
    public PsicologiaClinicaDTO crearFichaPsicologiaClinica(PsicologiaClinicaRequest request) {
        log.info("Iniciando creación de ficha psicología clínica para paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            log.error("ID de paciente nulo en request");
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }
        
        PsicologiaClinica existing = repository.findByPacienteIdAndActivo(request.getPacienteId(), true);
        if (existing != null) {
            throw new IllegalStateException("Ya existe una ficha de psicología clínica para este paciente");
        }

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
            .orElseThrow(() -> {
                log.error("Paciente ID {} no encontrado", request.getPacienteId());
                return new RuntimeException("Paciente no encontrado");
            });

        PsicologiaClinica ficha = new PsicologiaClinica();
        ficha.setPaciente(paciente);
        ficha.setActivo(true);
        mapRequestToEntity(request, ficha);
        
        PsicologiaClinica saved = repository.save(ficha);
        log.info("Ficha creada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public PsicologiaClinicaDTO actualizarFichaPsicologiaClinica(Integer id, PsicologiaClinicaRequest request) {
        log.info("Iniciando actualización de ficha psicología clínica ID: {}", id);
        
        PsicologiaClinica ficha = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));
            
        if (!ficha.getActivo()) {
            throw new RuntimeException("No se puede editar una ficha inactiva");
        }

        mapRequestToEntity(request, ficha);
        
        PsicologiaClinica saved = repository.save(ficha);
        log.info("Ficha actualizada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    private void mapRequestToEntity(PsicologiaClinicaRequest request, PsicologiaClinica ficha) {
        if (request.getAnamnesis() != null) ficha.setAnamnesis(request.getAnamnesis());
        if (request.getSuenio() != null) ficha.setSuenio(request.getSuenio());
        if (request.getConducta() != null) ficha.setConducta(request.getConducta());
        if (request.getSexualidad() != null) ficha.setSexualidad(request.getSexualidad());
        if (request.getEvaluacionLenguaje() != null) ficha.setEvaluacionLenguaje(request.getEvaluacionLenguaje());
        if (request.getEvaluacionAfectiva() != null) ficha.setEvaluacionAfectiva(request.getEvaluacionAfectiva());
        if (request.getEvaluacionCognitiva() != null) ficha.setEvaluacionCognitiva(request.getEvaluacionCognitiva());
        if (request.getEvaluacionPensamiento() != null) ficha.setEvaluacionPensamiento(request.getEvaluacionPensamiento());
        if (request.getDiagnostico() != null) ficha.setDiagnostico(request.getDiagnostico());
    }

    public void eliminarFichaPsicologiaClinica(Integer id) {
        log.info("Eliminando (desactivando) ficha psicología clínica ID: {}", id);
        if (id == null) return;
        repository.findById(id).ifPresent(f -> {
            f.setActivo(false);
            repository.save(f);
            log.info("Ficha ID {} desactivada", id);
        });
    }

    private PsicologiaClinicaDTO convertirADTO(PsicologiaClinica ficha) {
        PsicologiaClinicaDTO dto = new PsicologiaClinicaDTO();
        dto.setId(ficha.getId());
        dto.setPaciente(ficha.getPaciente() != null ? new PacienteFichaDTO(
                ficha.getPaciente().getId(), ficha.getPaciente().getNombresApellidos(), ficha.getPaciente().getCedula())
                : null);
        dto.setActivo(ficha.getActivo());
        
        dto.setAnamnesis(ficha.getAnamnesis());
        dto.setSuenio(ficha.getSuenio());
        dto.setConducta(ficha.getConducta());
        dto.setSexualidad(ficha.getSexualidad());
        dto.setEvaluacionLenguaje(ficha.getEvaluacionLenguaje());
        dto.setEvaluacionAfectiva(ficha.getEvaluacionAfectiva());
        dto.setEvaluacionCognitiva(ficha.getEvaluacionCognitiva());
        dto.setEvaluacionPensamiento(ficha.getEvaluacionPensamiento());
        dto.setDiagnostico(ficha.getDiagnostico());
        
        return dto;
    }
}