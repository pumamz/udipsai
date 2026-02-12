package com.ucacue.udipsai.modules.sedes.service;

import com.ucacue.udipsai.modules.sedes.domain.Sede;
import com.ucacue.udipsai.modules.sedes.dto.SedeCriteriaDTO;
import com.ucacue.udipsai.modules.sedes.repository.SedeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import org.springframework.util.StringUtils;

@Service
@Slf4j
public class SedeService {

    @Autowired
    private SedeRepository sedeRepository;

    public Page<Sede> listarSedesActivas(Pageable pageable) {
        log.info("Consultando sedes activas paginadas");
        return sedeRepository.findByActivoTrue(pageable);
    }

    public Optional<Sede> obtenerSedePorId(Integer id) {
        log.debug("Buscando sede con ID: {}", id);
        return sedeRepository.findById(id);
    }

    public List<Sede> listarSedesSinPaginacion(SedeCriteriaDTO criteria) {
        log.info("Listando sedes sin paginación para reportes con criterios: {}", criteria);
        Specification<Sede> spec = createSpecification(criteria);
        return sedeRepository.findAll(spec);
    }

    public Page<Sede> filtrarSedes(SedeCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando sedes con criterios: {}", criteria);
        Specification<Sede> spec = createSpecification(criteria);
        return sedeRepository.findAll(spec, pageable);
    }

    private Specification<Sede> createSpecification(SedeCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getSearch())) {
                String likePattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("nombre")), likePattern));
            }

            if (criteria.getActivo() != null) {
                predicates.add(cb.equal(root.get("activo"), criteria.getActivo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public Sede crearSede(Sede sede) {
        log.info("Creando nueva sede con nombre: {}", sede.getNombre());
        sede.setNombre(sede.getNombre());
        sede.setActivo(true);
        return sedeRepository.save(sede);
    }

    @Transactional
    public Sede actualizarSede(Integer id, Sede nuevaSede) {
        return sedeRepository.findById(id).map(sedeExistente -> {
            log.info("Actualizando sede ID: {}. Nuevo nombre: {}", id, nuevaSede.getNombre());
            sedeExistente.setNombre(nuevaSede.getNombre());
            return sedeRepository.save(sedeExistente);
        }).orElseThrow(() -> {
            log.warn("Intento fallido de actualizar: Sede ID {} no encontrada", id);
            return new RuntimeException("Sede no encontrada");
        });
    }

    @Transactional
    public void eliminarSede(Integer id) {
        sedeRepository.findById(id).ifPresentOrElse(
                sede -> {
                    log.info("Desactivando sede ID: {}", id);
                    sede.setActivo(false);
                    sedeRepository.save(sede);
                },
                () -> log.warn("Intento de eliminar sede inexistente ID: {}", id));
    }
}
