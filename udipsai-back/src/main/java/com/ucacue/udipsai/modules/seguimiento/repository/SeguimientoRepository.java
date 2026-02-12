package com.ucacue.udipsai.modules.seguimiento.repository;

import com.ucacue.udipsai.modules.seguimiento.domain.Seguimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, Integer> {
    List<Seguimiento> findByActivo(Boolean activo);
    List<Seguimiento> findByPacienteIdAndActivo(Integer pacienteId, Boolean activo);
}
