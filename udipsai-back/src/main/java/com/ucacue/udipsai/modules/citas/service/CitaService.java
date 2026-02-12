package com.ucacue.udipsai.modules.citas.service;

import com.ucacue.udipsai.modules.citas.domain.Cita;
import com.ucacue.udipsai.modules.citas.dto.*;
import com.ucacue.udipsai.modules.citas.repository.CitaRepository;
import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.especialidad.repository.EspecialidadRepository;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CitaService {

    @Autowired
    private CitaRepository citaRepo;

    @Autowired
    private PacienteRepository pacienteRepo;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private EspecialidadRepository especialidadRepo;

    @Autowired
    private PasanteRepository pasanteRepo;

    @Autowired
    private EspecialistaRepository especialistaRepo;

    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitas(Pageable pageable, HttpServletRequest request) {

        Page<Cita> citas = citaRepo.findAll(pageable);

        if (citas.isEmpty()) {
            return new ResponseEntity<>(Page.empty(pageable), HttpStatus.OK);
        }

        Page<CitaDTO> dtos = citas.map(this::mapearDTO);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> obtenerCitaPorId(Integer idCita, HttpServletRequest request) {

        Cita cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita con id " + idCita + " no encontrada"));

        CitaDTO dto = mapearDTO(cita);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> registrarCita(RegistrarCitaDTO dto, HttpServletRequest request) {

        if (dto.getIdPaciente() == null || dto.getIdEspecialidad() == null
                || dto.getFecha() == null || dto.getHora() == null || dto.getIdProfesional() == null
                || dto.getTipoProfesional() == null) {
            throw new IllegalArgumentException("Faltan datos para el registro de la cita");
        }

        Paciente paciente = pacienteRepo.findById(dto.getIdPaciente())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));

        Especialidad especialidad = especialidadRepo.findById(dto.getIdEspecialidad())
                .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada"));

        validarFechaHora(dto.getFecha(), dto.getHora());

        Pasante pasante = null;
        Especialista especialista = null;
        String profesionalNombre = "";

        if ("PASANTE".equalsIgnoreCase(dto.getTipoProfesional())) {
            pasante = pasanteRepo.findById(dto.getIdProfesional())
                    .orElseThrow(() -> new EntityNotFoundException("Pasante no encontrado"));
            if (!Boolean.TRUE.equals(pasante.getActivo())) {
                throw new IllegalArgumentException("El pasante no está activo");
            }
            if (pasante.getInicioPasantia() != null && pasante.getFinPasantia() != null) {
                if (dto.getFecha().isBefore(pasante.getInicioPasantia())
                        || dto.getFecha().isAfter(pasante.getFinPasantia())) {
                    throw new IllegalArgumentException("La fecha está fuera del periodo de pasantía");
                }
            }
            profesionalNombre = pasante.getNombresApellidos();

            if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndPasante_Id(Cita.Estado.PENDIENTE, dto.getFecha(),
                    dto.getHora(), pasante.getId())) {
                throw new IllegalArgumentException("Pasante " + profesionalNombre + " ya tiene una cita a esa hora");
            }

        } else if ("ESPECIALISTA".equalsIgnoreCase(dto.getTipoProfesional())) {
            especialista = especialistaRepo.findById(dto.getIdProfesional())
                    .orElseThrow(() -> new EntityNotFoundException("Especialista no encontrado"));
            if (!Boolean.TRUE.equals(especialista.getActivo())) {
                throw new IllegalArgumentException("El especialista no está activo");
            }
            profesionalNombre = especialista.getNombresApellidos();

            if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndEspecialista_Id(Cita.Estado.PENDIENTE, dto.getFecha(),
                    dto.getHora(), especialista.getId())) {
                throw new IllegalArgumentException(
                        "Especialista " + profesionalNombre + " ya tiene una cita a esa hora");
            }
        } else {
            throw new IllegalArgumentException("Tipo de profesional inválido: " + dto.getTipoProfesional());
        }

        if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndPaciente_Id(Cita.Estado.PENDIENTE, dto.getFecha(),
                dto.getHora(), dto.getIdPaciente())) {
            throw new IllegalArgumentException("El paciente ya tiene una cita asignada en ese horario");
        }

        int duration = (dto.getDuracionMinutes() != null && dto.getDuracionMinutes() > 0) ? dto.getDuracionMinutes()
                : 60;
        LocalTime newEnd = dto.getHora().plusMinutes(duration);

        checkRangeOverlap(dto.getIdProfesional(), dto.getTipoProfesional(), dto.getFecha(), dto.getHora(), newEnd,
                null);

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHoraInicio(dto.getHora());
        cita.setHoraFin(newEnd);
        cita.setEstado(Cita.Estado.PENDIENTE);
        cita.setPaciente(paciente);
        cita.setEspecialidad(especialidad);
        cita.setPasante(pasante);
        cita.setEspecialista(especialista);

        Cita saved = citaRepo.save(cita);
        return new ResponseEntity<>(mapearDTO(saved), HttpStatus.CREATED);
    }

    private void checkRangeOverlap(Integer idProf, String tipo, LocalDate fecha, LocalTime newStart, LocalTime newEnd,
            Integer excludeCitaId) {
        List<Cita> citasDia = new ArrayList<>();
        if ("PASANTE".equalsIgnoreCase(tipo)) {
            citasDia = citaRepo.findCitasOcupadasByPasanteAndFecha(idProf, fecha);
        } else {
            citasDia = citaRepo.findCitasOcupadasByEspecialistaAndFecha(idProf, fecha);
        }

        for (Cita existing : citasDia) {
            if (excludeCitaId != null && existing.getId().equals(excludeCitaId))
                continue;

            LocalTime existingStart = existing.getHoraInicio();
            LocalTime existingEnd = existing.getHoraFin();

            if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
                throw new IllegalArgumentException(
                        "El profesional ya tiene una cita ocupada en el rango " + existingStart + " - " + existingEnd);
            }
        }
    }

    @Transactional
    public ResponseEntity<?> reagendarCita(Integer idCita, RegistrarCitaDTO dto, HttpServletRequest request) {

        Cita cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada"));

        if (!canModify(cita)) {
            throw new IllegalArgumentException(
                    "La cita no se puede reagendar en su estado actual: " + cita.getEstado());
        }

        if (dto.getIdPaciente() == null || dto.getIdEspecialidad() == null
                || dto.getFecha() == null || dto.getHora() == null || dto.getIdProfesional() == null
                || dto.getTipoProfesional() == null) {
            throw new IllegalArgumentException("Faltan datos para reagendar");
        }

        Paciente paciente = pacienteRepo.findById(dto.getIdPaciente()).orElseThrow();
        Especialidad especialidad = especialidadRepo.findById(dto.getIdEspecialidad()).orElseThrow();

        Pasante pasante = null;
        Especialista especialista = null;

        if ("PASANTE".equalsIgnoreCase(dto.getTipoProfesional())) {
            pasante = pasanteRepo.findById(dto.getIdProfesional())
                    .orElseThrow(() -> new EntityNotFoundException("Pasante no encontrado"));
            if (Boolean.TRUE.equals(pasante.getActivo()) == false)
                throw new IllegalArgumentException("Pasante inactivo");
        } else if ("ESPECIALISTA".equalsIgnoreCase(dto.getTipoProfesional())) {
            especialista = especialistaRepo.findById(dto.getIdProfesional())
                    .orElseThrow(() -> new EntityNotFoundException("Especialista no encontrado"));
            if (Boolean.TRUE.equals(especialista.getActivo()) == false)
                throw new IllegalArgumentException("Especialista inactivo");
        }

        int duration = (dto.getDuracionMinutes() != null && dto.getDuracionMinutes() > 0) ? dto.getDuracionMinutes()
                : 60;
        LocalTime newEnd = dto.getHora().plusMinutes(duration);

        validarFechaHora(dto.getFecha(), dto.getHora());

        checkRangeOverlap(dto.getIdProfesional(), dto.getTipoProfesional(), dto.getFecha(), dto.getHora(), newEnd,
                idCita);

        cita.setFecha(dto.getFecha());
        cita.setHoraInicio(dto.getHora());
        cita.setHoraFin(newEnd);
        cita.setEstado(Cita.Estado.PENDIENTE);
        cita.setPaciente(paciente);
        cita.setEspecialidad(especialidad);
        cita.setPasante(pasante);
        cita.setEspecialista(especialista);

        Cita saved = citaRepo.save(cita);
        return new ResponseEntity<>(mapearDTO(saved), HttpStatus.OK);
    }

    public void cancelarCita(Integer id) {
        cancelarCitaResponseEntity(id);
    }

    public ResponseEntity<?> cancelarCitaResponseEntity(Integer idCita) {
        return changeState(idCita, Cita.Estado.CANCELADA);
    }

    public void faltaJustificada(Integer id) {
        faltaJustificadaResponseEntity(id);
    }

    public ResponseEntity<?> faltaJustificadaResponseEntity(Integer idCita) {
        return changeState(idCita, Cita.Estado.FALTA_JUSTIFICADA);
    }

    public ResponseEntity<?> faltaInjustificadaResponseEntity(Integer idCita) {
        return changeState(idCita, Cita.Estado.FALTA_INJUSTIFICADA);
    }

    public ResponseEntity<?> finalizarCitaResponseEntity(Integer idCita) {
        return changeState(idCita, Cita.Estado.FINALIZADA);
    }

    private ResponseEntity<?> changeState(Integer id, Cita.Estado newState) {
        Cita cita = citaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Cita no encontrada"));

        if (cita.getEstado() != Cita.Estado.PENDIENTE && cita.getEstado() != Cita.Estado.FINALIZADA) {
            if (newState == Cita.Estado.CANCELADA && cita.getEstado() != Cita.Estado.PENDIENTE) {
                throw new IllegalArgumentException("No se puede cancelar una cita que no está pendiente");
            }
        }

        cita.setEstado(newState);
        citaRepo.save(cita);
        return ResponseEntity.ok(new CitaResponse("Estado actualizado a " + newState));
    }

    private void validarFechaHora(LocalDate fecha, LocalTime hora) {
        DayOfWeek dia = fecha.getDayOfWeek();
        if (dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("No se pueden agendar citas los fines de semana");
        }
        LocalDateTime fechaHoraCita = LocalDateTime.of(fecha, hora);
        if (fechaHoraCita.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se pueden agendar citas en fechas u horas pasadas");
        }
    }

    private boolean canModify(Cita cita) {
        return cita.getEstado() == Cita.Estado.PENDIENTE ||
                cita.getEstado() == Cita.Estado.FALTA_JUSTIFICADA ||
                cita.getEstado() == Cita.Estado.FALTA_INJUSTIFICADA;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorProfesional(Integer idProfesional, Pageable pageable,
            String tipo) {
        Page<Cita> citas;

        if (tipo == null) {
            boolean isEsp = especialistaRepo.existsById(idProfesional);
            boolean isPas = pasanteRepo.existsById(idProfesional);

            if (isEsp)
                tipo = "ESPECIALISTA";
            else if (isPas)
                tipo = "PASANTE";
            else
                return new ResponseEntity<>(Page.empty(pageable), HttpStatus.OK);
        }

        if ("PASANTE".equalsIgnoreCase(tipo)) {
            citas = citaRepo.findAllByPasante_IdIn(List.of(idProfesional), pageable);
        } else {
            List<Integer> ids = new ArrayList<>();
            ids.add(idProfesional);
            citas = citaRepo.findAllByEspecialista_Id(idProfesional, pageable);
        }

        return new ResponseEntity<>(citas.map(this::mapearDTO), HttpStatus.OK);
    }

    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorProfesional(Integer idProfesional, Pageable pageable) {
        return obtenerCitasPorProfesional(idProfesional, pageable, null);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorEspecialidad(Integer idEspecialidad, Pageable pageable) {
        Page<Cita> citas = citaRepo.findAllByEspecialidad_Id(idEspecialidad, pageable);
        return new ResponseEntity<>(citas.map(this::mapearDTO), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> obtenerResumenDashboard(Integer profesionalId) {
        String tipo = "ESPECIALISTA";
        if (pasanteRepo.existsById(profesionalId) && !especialistaRepo.existsById(profesionalId)) {
            tipo = "PASANTE";
        }

        long citasHoy = 0;
        long pendientesTotales = 0;

        if ("PASANTE".equals(tipo)) {
            citasHoy = citaRepo.countByPasante_IdAndFecha(profesionalId, LocalDate.now());
            pendientesTotales = citaRepo.countByPasante_IdAndEstado(profesionalId, Cita.Estado.PENDIENTE);
        } else {
            citasHoy = citaRepo.countByEspecialista_IdAndFecha(profesionalId, LocalDate.now());
            pendientesTotales = citaRepo.countByEspecialista_IdAndEstado(profesionalId, Cita.Estado.PENDIENTE);
        }

        Map<String, Object> response = Map.of("citasHoy", citasHoy, "pendientesTotales", pendientesTotales);
        return ResponseEntity.ok(response);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<String>> encontrarHorasLibresProfesional(Integer profesionalId, LocalDate fecha,
            HttpServletRequest request) {
        boolean isPasante = pasanteRepo.existsById(profesionalId);
        boolean isEspecialista = especialistaRepo.existsById(profesionalId);

        List<LocalTime> horasOcupadas = new ArrayList<>();
        if (isEspecialista) {
            horasOcupadas.addAll(citaRepo.findHorasOcupadasByEspecialistaAndFecha(profesionalId, fecha));
        }
        if (isPasante) {
            if (!isEspecialista) {
                horasOcupadas.addAll(citaRepo.findHorasOcupadasByPasanteAndFecha(profesionalId, fecha));
            }
        }

        List<String> horasLibres = new ArrayList<>();
        LocalTime horaInicio = LocalTime.of(8, 0);
        LocalTime horaReceso = LocalTime.of(12, 0);
        LocalTime horaFin = LocalTime.of(17, 0);

        while (horaInicio.isBefore(horaFin)) {
            if (!horasOcupadas.contains(horaInicio) && !horaInicio.equals(horaReceso)) {
                horasLibres.add(horaInicio.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
            horaInicio = horaInicio.plusHours(1);
        }
        return new ResponseEntity<>(horasLibres, HttpStatus.OK);
    }

    public CitaDTO mapearDTO(Cita cita) {
        PacienteDTO pacienteDTO = pacienteService.convertirADTO(cita.getPaciente());

        EspecialidadDTO especialidadDTO = new EspecialidadDTO(cita.getEspecialidad().getId(),
                cita.getEspecialidad().getArea(), null);

        EspecialistaDTO especialistaDTO = null;

        if (cita.getPasante() != null) {
            Pasante p = cita.getPasante();
            especialistaDTO = EspecialistaDTO.builder()
                    .id(p.getId())
                    .cedula(p.getCedula())
                    .nombresApellidos(p.getNombresApellidos())
                    .fotoUrl(p.getFotoUrl())
                    .activo(p.getActivo())
                    .especialidad(new EspecialidadDTO(p.getEspecialidad().getId(), p.getEspecialidad().getArea(), null))
                    .sede(p.getSede() != null ? new SedeDTO(p.getSede().getId(), p.getSede().getNombre()) : null)
                    .build();
        } else if (cita.getEspecialista() != null) {
            Especialista e = cita.getEspecialista();
            especialistaDTO = EspecialistaDTO.builder()
                    .id(e.getId())
                    .cedula(e.getCedula())
                    .nombresApellidos(e.getNombresApellidos())
                    .fotoUrl(e.getFotoUrl())
                    .activo(e.getActivo())
                    .especialidad(new EspecialidadDTO(e.getEspecialidad().getId(), e.getEspecialidad().getArea(), null))
                    .sede(e.getSede() != null ? new SedeDTO(e.getSede().getId(), e.getSede().getNombre()) : null)
                    .build();
        }

        return new CitaDTO(
                cita.getId(),
                cita.getFecha(),
                cita.getHoraInicio(),
                cita.getHoraFin(),
                cita.getEstado().toString(),
                pacienteDTO,
                especialistaDTO,
                especialidadDTO);
    }

    static class CitaResponse {
        private String message;

        public CitaResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
