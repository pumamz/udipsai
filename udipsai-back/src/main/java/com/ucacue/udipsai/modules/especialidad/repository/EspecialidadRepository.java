package com.ucacue.udipsai.modules.especialidad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer>, JpaSpecificationExecutor<Especialidad> {
    List<Especialidad> findByActivoTrue();
    Page<Especialidad> findByActivoTrue(Pageable pageable);
}
