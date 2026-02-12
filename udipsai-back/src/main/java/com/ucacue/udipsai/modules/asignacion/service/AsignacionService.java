package com.ucacue.udipsai.modules.asignacion.service;

import com.ucacue.udipsai.modules.asignacion.domain.Asignacion;
import com.ucacue.udipsai.modules.asignacion.dto.AsignacionDTO;
import com.ucacue.udipsai.modules.asignacion.dto.AsignacionRequest;
import com.ucacue.udipsai.modules.asignacion.repository.AsignacionRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteAsignacionDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.dto.PasanteAsignacionDTO;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    @Transactional(readOnly = true)
    public List<AsignacionDTO> listarAsignaciones() {
        log.info("Consultando todas las asignaciones activas");
        return asignacionRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<AsignacionDTO> crearAsignacion(AsignacionRequest request) {
        log.info("Creando asignaciones para Pasante ID: {} con {} pacientes", request.getPasanteId(), request.getPacienteIds().size());

        Pasante pasante = pasanteRepository.findById(request.getPasanteId())
                .orElseThrow(() -> {
                    log.error("Error al crear asignación: Pasante con ID {} no encontrado", request.getPasanteId());
                    return new jakarta.persistence.EntityNotFoundException("Pasante no encontrado");
                });

        List<Asignacion> nuevasAsignaciones = request.getPacienteIds().stream().map(pacienteId -> {
            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> {
                        log.error("Error al crear asignación: Paciente con ID {} no encontrado", pacienteId);
                        return new jakarta.persistence.EntityNotFoundException("Paciente con ID " + pacienteId + " no encontrado");
                    });

            if (asignacionRepository.existsByPasanteIdAndPacienteIdAndActivoTrue(pasante.getId(), paciente.getId())) {
                log.warn("La asignación entre Pasante {} y Paciente {} ya existe. Omitiendo.", pasante.getId(), paciente.getId());
                return null;
            }

            Asignacion asignacion = new Asignacion();
            asignacion.setPaciente(paciente);
            asignacion.setPasante(pasante);
            asignacion.setActivo(true);
            return asignacion;
        }).filter(java.util.Objects::nonNull).collect(Collectors.toList());

        if (nuevasAsignaciones.isEmpty()) {
            throw new IllegalArgumentException("No se crearon nuevas asignaciones (posiblemente todos los pacientes ya estaban asignados)");
        }

        List<Asignacion> guardadas = asignacionRepository.saveAll(nuevasAsignaciones);
        log.info("{} asignaciones creadas exitosamente", guardadas.size());

        return guardadas.stream().map(this::convertirADTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AsignacionDTO> listarAsignacionesPorPasanteId(Integer pasanteId) {
        log.info("Consultando asignaciones activas para el pasante ID: {}", pasanteId);
        return asignacionRepository.findByPasanteIdAndActivoTrue(pasanteId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public void eliminarAsignacion(Long id) {
        if (id == null) {
            log.warn("Intento de eliminar asignación con ID nulo");
            return;
        }
        asignacionRepository.findById(id).ifPresentOrElse(a -> {
            log.info("Eliminando (desactivando) asignación ID: {}", id);
            a.setActivo(false);
            asignacionRepository.save(a);
        }, () -> log.warn("Intento de eliminar asignación inexistente ID: {}", id));
    }

    public AsignacionDTO convertirADTO(Asignacion asignacion) {
        return AsignacionDTO.builder()
                .id(asignacion.getId())
                .paciente(asignacion.getPaciente() != null ? new PacienteAsignacionDTO(
                    asignacion.getPaciente().getId(),
                    asignacion.getPaciente().getNombresApellidos(),
                    asignacion.getPaciente().getCedula()
                ) : null)
                .pasante(asignacion.getPasante() != null ? new PasanteAsignacionDTO(
                    asignacion.getPasante().getId(),
                    asignacion.getPasante().getNombresApellidos(),
                    asignacion.getPasante().getCedula()
                ) : null)
                .activo(asignacion.getActivo())
                .build();
    }
}
