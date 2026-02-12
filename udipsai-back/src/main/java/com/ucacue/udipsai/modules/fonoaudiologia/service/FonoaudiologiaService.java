package com.ucacue.udipsai.modules.fonoaudiologia.service;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.Fonoaudiologia;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaRequest;
import com.ucacue.udipsai.modules.fonoaudiologia.repository.FonoaudiologiaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FonoaudiologiaService {

    @Autowired
    private FonoaudiologiaRepository fonoaudiologiaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<FonoaudiologiaDTO> listarFichasFonoaudiologia() {
        log.info("Consultando todas las fichas de fonoaudiología activas");
        return fonoaudiologiaRepository.findAll().stream()
                .filter(Fonoaudiologia::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FonoaudiologiaDTO obtenerFichaFonoaudiologiaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha de fonoaudiología activa para el paciente ID: {}", pacienteId);
        Fonoaudiologia ficha = fonoaudiologiaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (ficha != null && ficha.getActivo()) {
            return convertirADTO(ficha);
        }
        return null;
    }
    
    @Transactional
    public FonoaudiologiaDTO crearFichaFonoaudiologia(FonoaudiologiaRequest request) {
        log.info("Iniciando creación de ficha fonoaudiología para Paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }
        
        Fonoaudiologia existing = fonoaudiologiaRepository.findByPacienteIdAndActivo(request.getPacienteId(), true);
        if (existing != null) {
            throw new IllegalStateException("Ya existe una ficha de fonoaudiología para este paciente");
        }

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
            .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Fonoaudiologia ficha = new Fonoaudiologia();
        ficha.setPaciente(paciente);
        ficha.setActivo(true);
        
        mapRequestToEntity(request, ficha);
        
        Fonoaudiologia saved = fonoaudiologiaRepository.save(ficha);
        log.info("Ficha de fonoaudiología creada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public FonoaudiologiaDTO actualizarFichaFonoaudiologia(Integer id, FonoaudiologiaRequest request) {
        log.info("Iniciando actualización de ficha fonoaudiología ID: {}", id);
        Fonoaudiologia ficha = fonoaudiologiaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));

        if (!ficha.getActivo()) {
             throw new RuntimeException("No se puede editar una ficha inactiva");
        }

        mapRequestToEntity(request, ficha);
        
        Fonoaudiologia saved = fonoaudiologiaRepository.save(ficha);
        log.info("Ficha de fonoaudiología actualizada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    private void mapRequestToEntity(FonoaudiologiaRequest request, Fonoaudiologia ficha) {
        if (request.getHabla() != null) ficha.setHabla(request.getHabla());
        if (request.getAudicion() != null) ficha.setAudicion(request.getAudicion());
        if (request.getFonacion() != null) ficha.setFonacion(request.getFonacion());
        if (request.getHistoriaAuditiva() != null) ficha.setHistoriaAuditiva(request.getHistoriaAuditiva());
        if (request.getVestibular() != null) ficha.setVestibular(request.getVestibular());
        if (request.getOtoscopia() != null) ficha.setOtoscopia(request.getOtoscopia());
    }

    public void eliminarFichaFonoaudiologia(Integer id) {
        if (id == null) return;
        log.info("Eliminando ficha fonoaudiología ID: {}", id);
        fonoaudiologiaRepository.findById(id).ifPresent(f -> {
            f.setActivo(false);
            fonoaudiologiaRepository.save(f);
            log.info("Ficha fonoaudiología ID: {} desactivada", id);
        });
    }

    private FonoaudiologiaDTO convertirADTO(Fonoaudiologia ficha) {
        FonoaudiologiaDTO dto = new FonoaudiologiaDTO();
        dto.setId(ficha.getId());
        dto.setPaciente(ficha.getPaciente() != null ? new PacienteFichaDTO(
                ficha.getPaciente().getId(), ficha.getPaciente().getNombresApellidos(), ficha.getPaciente().getCedula())
                : null);
        dto.setActivo(ficha.getActivo());
        
        dto.setHabla(ficha.getHabla());
        dto.setAudicion(ficha.getAudicion());
        dto.setFonacion(ficha.getFonacion());
        dto.setHistoriaAuditiva(ficha.getHistoriaAuditiva());
        dto.setVestibular(ficha.getVestibular());
        dto.setOtoscopia(ficha.getOtoscopia());
        
        return dto;
    }
}