package com.ucacue.udipsai.modules.historiaclinica.repository;

import com.ucacue.udipsai.modules.historiaclinica.domain.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Integer> {
    HistoriaClinica findByPacienteIdAndActivo(Integer idPaciente, boolean activo);
}
