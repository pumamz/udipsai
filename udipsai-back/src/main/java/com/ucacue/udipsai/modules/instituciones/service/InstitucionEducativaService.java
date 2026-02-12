package com.ucacue.udipsai.modules.instituciones.service;

import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaCriteriaDTO;
import com.ucacue.udipsai.modules.instituciones.repository.InstitucionEducativaRepository;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

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
public class InstitucionEducativaService {

    private final InstitucionEducativaRepository institucionEducativaRepository;

    public InstitucionEducativaService(InstitucionEducativaRepository institucionEducativaRepository) {
        this.institucionEducativaRepository = institucionEducativaRepository;
    }

    public Page<InstitucionEducativa> listarInstitucionesActivas(Pageable pageable) {
        log.info("Consultando instituciones educativas activas paginadas");
        return institucionEducativaRepository.findByActivoTrue(pageable);
    }
    
    public List<InstitucionEducativa> listarInstitucionesSinPaginacion(InstitucionEducativaCriteriaDTO criteria) {
        log.info("Listando instituciones sin paginación para reportes con criteria: {}", criteria);
        Specification<InstitucionEducativa> spec = createSpecification(criteria);
        return institucionEducativaRepository.findAll(spec);
    }

    public Page<InstitucionEducativa> filtrarInstituciones(InstitucionEducativaCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando instituciones con criteria: {}", criteria);
        Specification<InstitucionEducativa> spec = createSpecification(criteria);
        return institucionEducativaRepository.findAll(spec, pageable);
    }

    private Specification<InstitucionEducativa> createSpecification(InstitucionEducativaCriteriaDTO criteria) {
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

    public Optional<InstitucionEducativa> obtenerInstitucionPorId(Integer id) {
        log.info("Consultando institución educativa ID: {}", id);
        if (id == null) return Optional.empty();
        return institucionEducativaRepository.findById(id);
    }

    public InstitucionEducativa crearInstitucion(InstitucionEducativa institucionEducativa) {
        if (institucionEducativaRepository.existsByNombre(institucionEducativa.getNombre())) {
            log.error("Intento de crear institución duplicada. ID: {}", institucionEducativa.getNombre());
            throw new RuntimeException("Institucion con nombre " + institucionEducativa.getNombre() + " ya existe");
        }
        log.info("Creando nueva institución educativa: {}", institucionEducativa.getNombre());
        institucionEducativa.setActivo(true); 
        return institucionEducativaRepository.save(institucionEducativa);
    }

    public InstitucionEducativa actualizarInstitucion(Integer id, InstitucionEducativa nuevaInstitucion) {
        log.info("Actualizando institución educativa ID: {}", id);
        if (id == null) throw new IllegalArgumentException("Id de institucion requerido");
        Optional<InstitucionEducativa> institucionOpt = institucionEducativaRepository.findById(id);
        if (institucionOpt.isPresent()) {
            InstitucionEducativa institucionExistente = institucionOpt.get();
            institucionExistente.setNombre(nuevaInstitucion.getNombre());
            institucionExistente.setDireccion(nuevaInstitucion.getDireccion());
            institucionExistente.setTipo(nuevaInstitucion.getTipo());
            if (nuevaInstitucion.getActivo() != null) {
                institucionExistente.setActivo(nuevaInstitucion.getActivo());
            }
            InstitucionEducativa updated = institucionEducativaRepository.save(institucionExistente);
            log.info("Institución educativa actualizada exitosamente ID: {}", updated.getId());
            return updated;
        } else {
            log.warn("Intento de actualizar institución inexistente ID: {}", id);
            throw new RuntimeException("Institución no encontrada");
        }
    }

    public void eliminarInstitucion(Integer id) {
        log.info("Eliminando institución educativa ID: {}", id);
        if (id == null) return;
        Optional<InstitucionEducativa> institucionOpt = institucionEducativaRepository.findById(id);
        if (institucionOpt.isPresent()) {
            InstitucionEducativa institucion = institucionOpt.get();
            institucion.setActivo(false);
            institucionEducativaRepository.save(institucion);
            log.info("Institución educativa desactivada ID: {}", id);
        } else {
            log.warn("Intento de eliminar institución inexistente ID: {}", id);
        }
    }
}
