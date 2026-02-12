package com.ucacue.udipsai.modules.psicologiaeducativa.service;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaRequest;
import com.ucacue.udipsai.modules.psicologiaeducativa.domain.PsicologiaEducativa;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.repository.PsicologiaEducativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PsicologiaEducativaService {

    @Autowired
    private PsicologiaEducativaRepository psicologiaEducativaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<PsicologiaEducativaDTO> listarFichasPsicologiaEducativa() {
        log.info("Consultando todas las fichas de psicología educativa activas");
        return psicologiaEducativaRepository.findAll().stream()
                .filter(PsicologiaEducativa::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PsicologiaEducativaDTO obtenerFichaPsicologiaEducativaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha de psicología educativa por paciente ID: {}", pacienteId);
        PsicologiaEducativa ficha = psicologiaEducativaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (ficha != null && ficha.getActivo()) {
            return convertirADTO(ficha);
        }
        return null;
    }

    @Transactional
    public PsicologiaEducativaDTO crearFichaPsicologiaEducativa(PsicologiaEducativaRequest request) {
        log.info("Iniciando creación de ficha psicología educativa para paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            log.error("El ID del paciente es requerido");
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }

        PsicologiaEducativa existing = psicologiaEducativaRepository.findByPacienteIdAndActivo(request.getPacienteId(),
                true);
        if (existing != null) {
            throw new IllegalStateException("Ya existe una ficha de psicología educativa para este paciente");
        }

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> {
                    log.error("Paciente ID {} no encontrado", request.getPacienteId());
                    throw new RuntimeException("Paciente no encontrado");
                });

        PsicologiaEducativa ficha = new PsicologiaEducativa();
        ficha.setPaciente(paciente);
        ficha.setActivo(true);
        mapRequestToEntity(request, ficha);

        PsicologiaEducativa saved = psicologiaEducativaRepository.save(ficha);
        log.info("Ficha psicología educativa creada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public PsicologiaEducativaDTO actualizarFichaPsicologiaEducativa(Integer id, PsicologiaEducativaRequest request) {
        log.info("Iniciando actualización de ficha psicología educativa ID: {}", id);

        PsicologiaEducativa ficha = psicologiaEducativaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));

        if (!ficha.getActivo()) {
            throw new RuntimeException("No se puede editar una ficha inactiva");
        }

        mapRequestToEntity(request, ficha);

        PsicologiaEducativa saved = psicologiaEducativaRepository.save(ficha);
        log.info("Ficha psicología educativa actualizada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    private void mapRequestToEntity(PsicologiaEducativaRequest request, PsicologiaEducativa ficha) {
        if (request.getHistoriaEscolar() != null)
            ficha.setHistoriaEscolar(request.getHistoriaEscolar());
        if (request.getDesarrollo() != null)
            ficha.setDesarrollo(request.getDesarrollo());
        if (request.getAdaptacion() != null)
            ficha.setAdaptacion(request.getAdaptacion());
        if (request.getEstadoGeneral() != null)
            ficha.setEstadoGeneral(request.getEstadoGeneral());
    }

    public void eliminarFichaPsicologiaEducativa(Integer id) {
        log.info("Eliminando (desactivando) ficha psicología educativa ID: {}", id);
        if (id != null) {
            psicologiaEducativaRepository.findById(id).ifPresent(f -> {
                f.setActivo(false);
                psicologiaEducativaRepository.save(f);
                log.info("Ficha ID {} desactivada", id);
            });
        }
    }

    private PsicologiaEducativaDTO convertirADTO(PsicologiaEducativa ficha) {
        PsicologiaEducativaDTO dto = new PsicologiaEducativaDTO();
        dto.setId(ficha.getId());
        dto.setPaciente(ficha.getPaciente() != null ? new PacienteFichaDTO(
                ficha.getPaciente().getId(), ficha.getPaciente().getNombresApellidos(), ficha.getPaciente().getCedula())
                : null);
        dto.setActivo(ficha.getActivo());

        dto.setHistoriaEscolar(ficha.getHistoriaEscolar());
        dto.setDesarrollo(ficha.getDesarrollo());
        dto.setAdaptacion(ficha.getAdaptacion());
        dto.setEstadoGeneral(ficha.getEstadoGeneral());

        return dto;
    }
}