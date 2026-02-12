package com.ucacue.udipsai.modules.citas.service;

import com.ucacue.udipsai.modules.citas.domain.Cita;
import com.ucacue.udipsai.modules.citas.dto.ReporteCitaDTO;
import com.ucacue.udipsai.modules.citas.dto.ReporteCitaRespuestaDTO;
import com.ucacue.udipsai.modules.citas.repository.CitaRepository;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReporteCitaService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private CitaRepository citaRepository;

    public ReporteCitaRespuestaDTO generarReportePorPaciente(Integer fichaPaciente, String tipoReporte,
            String alcance) {
        int limit = "COMPLETO".equalsIgnoreCase(alcance) ? 5000 : 10;

        Pageable pageable = PageRequest.of(0, limit,
                Sort.by("fecha").descending().and(Sort.by("horaInicio").descending()));
        Page<Cita> paginaCitas = citaRepository.findAllByPaciente_Id(fichaPaciente, pageable);

        List<Cita> listaCitas = paginaCitas.getContent();

        ReporteCitaRespuestaDTO respuesta = new ReporteCitaRespuestaDTO();

        String nombrePaciente = "Desconocido";
        if (fichaPaciente != null) {
            nombrePaciente = pacienteRepository.findById(fichaPaciente)
                    .map(p -> p.getNombresApellidos())
                    .orElse("Desconocido");
        }
        respuesta.setPacienteNombreCompleto(nombrePaciente);

        if (listaCitas.isEmpty()) {
            respuesta.setCitas(List.of());
            return respuesta;
        }

        List<ReporteCitaDTO> citasDTO = listaCitas.stream()
                .filter(cita -> {
                    if (cita.getEstado() == null)
                        return false;

                    String estado = cita.getEstado().name();
                    if ("PADRES".equalsIgnoreCase(tipoReporte)) {
                        return estado.equals("PENDIENTE");
                    } else {
                        return estado.equals("PENDIENTE") || estado.equals("FINALIZADA")
                                || estado.equals("FALTA_INJUSTIFICADA") || estado.equals("FALTA_JUSTIFICADA");
                    }
                })
                .map(cita -> {
                    LocalTime horaInicio = null;
                    if (cita.getHoraInicio() != null) {
                        horaInicio = cita.getHoraInicio();
                    }

                    LocalTime horaFin = null;
                    if (cita.getHoraFin() != null) {
                        horaFin = cita.getHoraFin();
                    }

                    String nombreProfesional = "Desconocido";
                    if (cita.getPasante() != null) {
                        nombreProfesional = cita.getPasante().getNombresApellidos();
                    } else if (cita.getEspecialista() != null) {
                        nombreProfesional = cita.getEspecialista().getNombresApellidos();
                    }

                    String especialidadNombre = "General";
                    if (cita.getEspecialidad() != null) {
                        especialidadNombre = cita.getEspecialidad().getArea();
                    }

                    return new ReporteCitaDTO(
                            cita.getFecha(),
                            horaInicio,
                            horaFin,
                            nombreProfesional,
                            especialidadNombre,
                            cita.getEstado() != null ? cita.getEstado().name() : "PENDIENTE");
                }).collect(Collectors.toList());

        Collections.reverse(citasDTO);
        respuesta.setCitas(citasDTO);

        return respuesta;
    }

    public Optional<ReporteCitaRespuestaDTO> generarReportePorCedula(String cedula, String tipoReporte,
            String alcance) {
        return pacienteRepository.findByCedula(cedula)
                .map(paciente -> generarReportePorPaciente(paciente.getId(), tipoReporte, alcance));
    }
}
