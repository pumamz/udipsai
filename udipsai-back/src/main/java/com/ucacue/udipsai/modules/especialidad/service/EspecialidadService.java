package com.ucacue.udipsai.modules.especialidad.service;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadCriteriaDTO;
import com.ucacue.udipsai.modules.especialidad.repository.EspecialidadRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class EspecialidadService {

    @Autowired
    private EspecialidadRepository especialidadRepository;

    public Page<Especialidad> listarEspecialidadesActivas(Pageable pageable) {
        log.info("Consultando especialidades activas paginadas");
        return especialidadRepository.findByActivoTrue(pageable);
    }

    public Optional<Especialidad> obtenerEspecialidadPorId(Integer id) {
        log.debug("Buscando especialidad con ID: {}", id);
        return especialidadRepository.findById(id);
    }

    public List<Especialidad> listarEspecialidadesSinPaginacion(EspecialidadCriteriaDTO criteria) {
        log.info("Listando especialidades sin paginación para reportes con criterios: {}", criteria);
        Specification<Especialidad> spec = createSpecification(criteria);
        return especialidadRepository.findAll(spec);
    }

    public Page<Especialidad> filtrarEspecialidades(EspecialidadCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando especialidades con criterios: {}", criteria);
        Specification<Especialidad> spec = createSpecification(criteria);
        return especialidadRepository.findAll(spec, pageable);
    }

    private Specification<Especialidad> createSpecification(EspecialidadCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getSearch())) {
                String likePattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("area")), likePattern));
            }

            if (criteria.getActivo() != null) {
                predicates.add(cb.equal(root.get("activo"), criteria.getActivo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public Especialidad crearEspecialidad(Especialidad especialidad) {
        log.info("Creando nueva especialidad con area: {}", especialidad.getArea());
        especialidad.setActivo(true);
        return especialidadRepository.save(especialidad);
    }

    @Transactional
    public Especialidad actualizarEspecialidad(Integer id, Especialidad nuevaEspecialidad) {
        return especialidadRepository.findById(id).map(existente -> {
            log.info("Actualizando especialidad ID: {}. Nueva area: {}", id, nuevaEspecialidad.getArea());
            existente.setArea(nuevaEspecialidad.getArea());
            return especialidadRepository.save(existente);
        }).orElseThrow(() -> {
            log.warn("Intento fallido de actualizar: Especialidad ID {} no encontrada", id);
            return new RuntimeException("Especialidad no encontrada");
        });
    }

    @Transactional
    public void eliminarEspecialidad(Integer id) {
        especialidadRepository.findById(id).ifPresentOrElse(e -> {
            log.info("Desactivando especialidad ID: {}", id);
            e.setActivo(false);
            especialidadRepository.save(e);
        }, () -> log.warn("Intento de eliminar especialidad inexistente ID: {}", id));
    }
}
