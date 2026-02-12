package com.ucacue.udipsai.modules.paciente.repository;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer>, JpaSpecificationExecutor<Paciente> {

        List<Paciente> findByActivoTrue();

        Page<Paciente> findByActivoTrue(Pageable pageable);

        Optional<Paciente> findByCedula(String cedula);

        boolean existsByCedula(String cedula);

        @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Paciente p WHERE " +
                        "LOWER(p.nombresApellidos) = LOWER(:nombresApellidos) AND " +
                        "LOWER(p.ciudad) = LOWER(:ciudad) AND " +
                        "p.cedula = :cedula AND " +
                        "p.fechaNacimiento = :fechaNacimiento")
        boolean existsByNombresApellidosAndCiudadAndCedulaAndFechaNacimiento(
                        @Param("nombresApellidos") String nombresApellidos,
                        @Param("ciudad") String ciudad,
                        @Param("cedula") String cedula,
                        @Param("fechaNacimiento") LocalDate fechaNacimiento);
}