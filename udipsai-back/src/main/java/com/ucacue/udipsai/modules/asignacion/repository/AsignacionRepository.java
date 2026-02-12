package com.ucacue.udipsai.modules.asignacion.repository;

import com.ucacue.udipsai.modules.asignacion.domain.Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, Long>, JpaSpecificationExecutor<Asignacion> {
    List<Asignacion> findByActivoTrue();
    List<Asignacion> findByPasanteIdAndActivoTrue(Integer pasanteId);
    List<Asignacion> findByPacienteIdAndActivoTrue(Integer pacienteId);
    boolean existsByPasanteIdAndPacienteIdAndActivoTrue(Integer pasanteId, Integer pacienteId);
}