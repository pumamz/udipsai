package com.ucacue.udipsai.modules.citas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ucacue.udipsai.modules.citas.domain.Cita;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer>, JpaSpecificationExecutor<Cita> {

        boolean existsByEstadoAndFechaAndHoraInicioAndPaciente_Id(Cita.Estado estado, LocalDate fecha, LocalTime hora,
                        Integer idPaciente);

        boolean existsByEstadoAndFechaAndHoraInicioAndPasante_Id(Cita.Estado estado, LocalDate fecha,
                        LocalTime hora,
                        Integer pasanteId);

        boolean existsByEstadoAndFechaAndHoraInicioAndEspecialista_Id(Cita.Estado estado, LocalDate fecha,
                        LocalTime hora,
                        Integer especialistaId);

        Page<Cita> findAll(Pageable pageable);

        Page<Cita> findAllByPaciente_Id(Integer idPaciente, Pageable pageable);

        Page<Cita> findAllByPasante_IdIn(List<Integer> ids, Pageable pageable);

        Page<Cita> findAllByEspecialista_Id(Integer id, Pageable pageable);

        Page<Cita> findAllByEspecialidad_Id(Integer especialidadId, Pageable pageable);

        @Query("SELECT c FROM Cita c WHERE (c.pasante.id = :profesionalId OR c.especialista.id = :profesionalId) AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<Cita> findCitasOcupadasByProfesionalAndFecha(Integer profesionalId, LocalDate fecha);

        @Query("SELECT c FROM Cita c WHERE c.pasante.id = :pasanteId AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<Cita> findCitasOcupadasByPasanteAndFecha(Integer pasanteId, LocalDate fecha);

        @Query("SELECT c FROM Cita c WHERE c.especialista.id = :especialistaId AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<Cita> findCitasOcupadasByEspecialistaAndFecha(Integer especialistaId, LocalDate fecha);

        @Query("SELECT c.horaInicio FROM Cita c WHERE c.pasante.id = :id AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<LocalTime> findHorasOcupadasByPasanteAndFecha(Integer id, LocalDate fecha);

        @Query("SELECT c.horaInicio FROM Cita c WHERE c.especialista.id = :id AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<LocalTime> findHorasOcupadasByEspecialistaAndFecha(Integer id, LocalDate fecha);

        long countByPasante_IdAndFecha(Integer id, LocalDate fecha);

        long countByEspecialista_IdAndFecha(Integer id, LocalDate fecha);

        long countByPasante_IdAndEstado(Integer id, Cita.Estado estado);

        long countByEspecialista_IdAndEstado(Integer id, Cita.Estado estado);
}
