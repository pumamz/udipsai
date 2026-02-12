package com.ucacue.udipsai.modules.psicologiaclinica.repository;

import com.ucacue.udipsai.modules.psicologiaclinica.domain.PsicologiaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PsicologiaClinicaRepository extends JpaRepository<PsicologiaClinica, Integer> {
    PsicologiaClinica findByPacienteIdAndActivo(Integer idPaciente, boolean activo);
    List<PsicologiaClinica> findByActivo(boolean activo);
}
