package com.ucacue.udipsai.modules.seguimiento.service;

import com.ucacue.udipsai.modules.documentos.domain.Documento;

import com.ucacue.udipsai.modules.documentos.repository.DocumentoRepository;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.especialistas.service.EspecialistaService;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.modules.seguimiento.domain.Seguimiento;
import com.ucacue.udipsai.modules.seguimiento.dto.SeguimientoDTO;
import com.ucacue.udipsai.modules.seguimiento.dto.SeguimientoRequest;
import com.ucacue.udipsai.modules.seguimiento.repository.SeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import com.ucacue.udipsai.modules.documentos.dto.DocumentoDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SeguimientoService {

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private EspecialistaService especialistaService;

    @Autowired
    private PacienteService pacienteService;

    @Transactional(readOnly = true)
    public List<SeguimientoDTO> listarSeguimientosActivos() {
        log.info("Consultando todos los seguimientos activos");
        return seguimientoRepository.findByActivo(true).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeguimientoDTO> listarSeguimientosPorPacienteId(Integer pacienteId) {
        log.info("Consultando seguimientos para paciente ID: {}", pacienteId);
        return seguimientoRepository.findByPacienteIdAndActivo(pacienteId, true).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SeguimientoDTO crearSeguimiento(SeguimientoRequest request, MultipartFile file) {
        log.info("Creando nuevo seguimiento");
        Seguimiento seguimiento = new Seguimiento();
        mapearRequestAEntidad(request, seguimiento);
        seguimiento.setActivo(true);

        if (file != null && !file.isEmpty()) {
            guardarYAsociarDocumento(seguimiento, file);
        }

        Seguimiento saved = seguimientoRepository.save(seguimiento);
        log.info("Seguimiento creado exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public SeguimientoDTO actualizarSeguimiento(Integer id, SeguimientoRequest request, MultipartFile file) {
        log.info("Actualizando seguimiento ID: {}", id);
        if (id == null)
            throw new IllegalArgumentException("ID requerido para actualizar");
        Seguimiento seguimiento = seguimientoRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Seguimiento ID {} no encontrado", id);
                    return new RuntimeException("Seguimiento no encontrado");
                });
        mapearRequestAEntidad(request, seguimiento);

        if (file != null && !file.isEmpty()) {
            guardarYAsociarDocumento(seguimiento, file);
        }

        Seguimiento saved = seguimientoRepository.save(seguimiento);
        log.info("Seguimiento actualizado exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    public void eliminarSeguimiento(Integer id) {
        log.info("Eliminando (desactivando) seguimiento ID: {}", id);
        if (id == null)
            return;
        seguimientoRepository.findById(id).ifPresent(s -> {
            s.setActivo(false);
            seguimientoRepository.save(s);
            log.info("Seguimiento ID {} desactivado", id);
        });
    }

    private void mapearRequestAEntidad(SeguimientoRequest request, Seguimiento seguimiento) {
        if (request.getEspecialistaId() != null) {
            Especialista esp = especialistaRepository.findById(request.getEspecialistaId()).orElse(null);
            seguimiento.setEspecialista(esp);
        }
        if (request.getPacienteId() != null) {
            Paciente pac = pacienteRepository.findById(request.getPacienteId()).orElse(null);
            seguimiento.setPaciente(pac);
        }
        seguimiento.setFecha(request.getFecha());
        seguimiento.setObservacion(request.getObservacion());
        if (request.getActivo() != null)
            seguimiento.setActivo(request.getActivo());

        if (request.getDocumentoId() != null) {
            Documento doc = documentoRepository.findById(request.getDocumentoId()).orElse(null);
            seguimiento.setDocumento(doc);
        }
    }

    private void guardarYAsociarDocumento(Seguimiento seguimiento, MultipartFile file) {
        String filename = storageService.store(file);
        Documento doc = new Documento();
        doc.setNombre(file.getOriginalFilename());
        doc.setUrl(filename);
        doc.setActivo(true);

        if (seguimiento.getPaciente() != null) {
            doc.setPaciente(seguimiento.getPaciente());
        }

        documentoRepository.save(doc);
        seguimiento.setDocumento(doc);
    }

    public SeguimientoDTO convertirADTO(Seguimiento seguimiento) {
        return SeguimientoDTO.builder()
                .id(seguimiento.getId())
                .fecha(seguimiento.getFecha())
                .observacion(seguimiento.getObservacion())
                .activo(seguimiento.getActivo())
                .especialista(seguimiento.getEspecialista() != null ? especialistaService.convertirADTO(seguimiento.getEspecialista()) : null)
                .paciente(seguimiento.getPaciente() != null ? pacienteService.convertirADTO(seguimiento.getPaciente()) : null)
                .documento(seguimiento.getDocumento() != null ? new DocumentoDTO(seguimiento.getDocumento().getId(), seguimiento.getDocumento().getUrl(),
                        seguimiento.getDocumento().getNombre()) : null)
                .build();
    }
}
