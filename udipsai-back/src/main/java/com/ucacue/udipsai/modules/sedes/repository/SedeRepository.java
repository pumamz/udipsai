package com.ucacue.udipsai.modules.sedes.repository;

import com.ucacue.udipsai.modules.sedes.domain.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Integer>, JpaSpecificationExecutor<Sede> {
    List<Sede> findByActivoTrue();
    Page<Sede> findByActivoTrue(Pageable pageable);
    Optional<Sede> findByNombre(String nombre);
    List<Sede> findByNombreIgnoreCase(String nombre);


}
