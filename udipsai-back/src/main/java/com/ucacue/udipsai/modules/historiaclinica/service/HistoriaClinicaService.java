package com.ucacue.udipsai.modules.historiaclinica.service;

import com.ucacue.udipsai.modules.historiaclinica.domain.HistoriaClinica;
import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaDTO;
import com.ucacue.udipsai.modules.historiaclinica.repository.HistoriaClinicaRepository;
import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaRequest;
import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class HistoriaClinicaService {

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private StorageService storageService;

    @Transactional(readOnly = true)
    public List<HistoriaClinicaDTO> listarHistoriasClinicas() {

        log.info("Consultando todas las historias clínicas activas");
        return historiaClinicaRepository.findAll().stream()
                .filter(HistoriaClinica::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HistoriaClinicaDTO obtenerHistoriaClinicaPorPacienteId(Integer pacienteId) {

        log.info("Consultando historia clínica activa para el paciente ID: {}", pacienteId);
        HistoriaClinica historia = historiaClinicaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (historia != null && historia.getActivo()) {
            return convertirADTO(historia);
        }
        return null;
    }

    @Transactional
    public HistoriaClinicaDTO crearHistoriaClinica(HistoriaClinicaRequest request, MultipartFile genogramaFile) {
        log.info("Iniciando creación de historia clínica para Paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            log.error("El ID del paciente es requerido");
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }
        
        HistoriaClinica existing = historiaClinicaRepository.findByPacienteIdAndActivo(request.getPacienteId(), true);
        if (existing != null) {
             throw new IllegalStateException("Ya existe una historia clínica para este paciente");
        }

        HistoriaClinica historia = new HistoriaClinica();
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> {
                    log.error("Error al guardar historia: Paciente ID {} no encontrado", request.getPacienteId());
                    return new RuntimeException("Paciente no encontrado");
                });
        historia.setPaciente(paciente);
        historia.setActivo(true);
        
        mapRequestToEntity(request, historia);
        handleGenograma(historia, genogramaFile);

        HistoriaClinica saved = historiaClinicaRepository.save(historia);
        log.info("Historia clínica creada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public HistoriaClinicaDTO actualizarHistoriaClinica(Integer id, HistoriaClinicaRequest request, MultipartFile genogramaFile) {
        log.info("Iniciando actualización de historia clínica ID: {}", id);
        
        HistoriaClinica historia = historiaClinicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historia clínica no encontrada"));
                
        if (!historia.getActivo()) {
            throw new RuntimeException("No se puede editar una historia clínica inactiva");
        }

        mapRequestToEntity(request, historia);
        handleGenograma(historia, genogramaFile);

        HistoriaClinica saved = historiaClinicaRepository.save(historia);
        log.info("Historia clínica actualizada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    private void mapRequestToEntity(HistoriaClinicaRequest request, HistoriaClinica historia) {
        if (request.getFecha() != null)
            historia.setFecha(request.getFecha());
        if (request.getInformacionGeneral() != null)
            historia.setInformacionGeneral(request.getInformacionGeneral());
        if (request.getDatosFamiliares() != null)
            historia.setDatosFamiliares(request.getDatosFamiliares());
        if (request.getHistoriaPrenatal() != null)
            historia.setHistoriaPrenatal(request.getHistoriaPrenatal());
        if (request.getHistoriaNatal() != null)
            historia.setHistoriaNatal(request.getHistoriaNatal());
        if (request.getHistoriaPostnatal() != null)
            historia.setHistoriaPostnatal(request.getHistoriaPostnatal());
        if (request.getDesarrolloMotor() != null)
            historia.setDesarrolloMotor(request.getDesarrolloMotor());
        if (request.getAlimentacion() != null)
            historia.setAlimentacion(request.getAlimentacion());
        if (request.getAntecedentesMedicos() != null)
            historia.setAntecedentesMedicos(request.getAntecedentesMedicos());
    }

    private void handleGenograma(HistoriaClinica historia, MultipartFile genogramaFile) {
        if (genogramaFile != null && !genogramaFile.isEmpty()) {
            String filename = storageService.store(genogramaFile);
            log.info("Genograma almacenado: {}", filename);
            if (historia.getInformacionGeneral() == null) {
                historia.setInformacionGeneral(new InformacionGeneral());
            }
            historia.getInformacionGeneral().setGenogramaUrl(filename);
        }
    }

    public Resource cargarGenogramaComoRecurso(Integer pacienteId) {
        log.info("Solicitando recurso genograma para paciente ID: {}", pacienteId);
        HistoriaClinica historia = historiaClinicaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (historia != null && historia.getInformacionGeneral() != null && historia.getInformacionGeneral().getGenogramaUrl() != null) {
            return storageService.loadAsResource(historia.getInformacionGeneral().getGenogramaUrl());
        }
        log.warn("Genograma no encontrado o URL nula para paciente ID: {}", pacienteId);
        return null;
    }

    @Transactional
    public void eliminarHistoriaClinica(Integer id) {

        if (id == null)
            return;
        log.info("Eliminando historia clínica ID: {}", id);
        historiaClinicaRepository.findById(id).ifPresent(f -> {
            f.setActivo(false);
            historiaClinicaRepository.save(f);
            log.info("Historia clínica ID: {} desactivada", id);
        });
    }

    private HistoriaClinicaDTO convertirADTO(HistoriaClinica historia) {
        HistoriaClinicaDTO dto = new HistoriaClinicaDTO();
        dto.setId(historia.getId());
        dto.setPaciente(historia.getPaciente() != null ? new PacienteFichaDTO(
                historia.getPaciente().getId(), historia.getPaciente().getNombresApellidos(), historia.getPaciente().getCedula())
                : null);
        dto.setActivo(historia.getActivo());
        dto.setFecha(historia.getFecha());

        dto.setInformacionGeneral(historia.getInformacionGeneral());
        dto.setDatosFamiliares(historia.getDatosFamiliares());
        dto.setHistoriaPrenatal(historia.getHistoriaPrenatal());
        dto.setHistoriaNatal(historia.getHistoriaNatal());
        dto.setHistoriaPostnatal(historia.getHistoriaPostnatal());
        dto.setDesarrolloMotor(historia.getDesarrolloMotor());
        dto.setAlimentacion(historia.getAlimentacion());
        dto.setAntecedentesMedicos(historia.getAntecedentesMedicos());

        return dto;
    }
}
