package com.ucacue.udipsai.modules.especialistas.service;

import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.especialidad.repository.EspecialidadRepository;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaCriteriaDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaRequest;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.permisos.Permisos;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;
import com.ucacue.udipsai.modules.sedes.repository.SedeRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.ucacue.udipsai.common.util.CedulaValidatorService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import org.springframework.util.StringUtils;

@Service
@Slf4j
public class EspecialistaService {

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private CedulaValidatorService cedulaValidatorService;

    @Transactional(readOnly = true)
    public Page<EspecialistaDTO> listarEspecialistasActivos(Pageable pageable) {
        return especialistaRepository.findByActivoTrue(pageable)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public EspecialistaDTO obtenerEspecialistaPorId(Integer id) {
        if (id == null)
            return null;
        return especialistaRepository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Especialista con ID " + id + " no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<EspecialistaDTO> listarEspecialistasSinPaginacion(EspecialistaCriteriaDTO criteria) {
        log.info("Listando especialistas sin paginación para reportes con criterios: {}", criteria);
        Specification<Especialista> spec = createSpecification(criteria);
        return especialistaRepository.findAll(spec).stream().map(this::convertirADTO).toList();
    }

    @Transactional(readOnly = true)
    public Page<EspecialistaDTO> filtrarEspecialistas(EspecialistaCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando especialistas con criterios: {}", criteria);
        Specification<Especialista> spec = createSpecification(criteria);
        return especialistaRepository.findAll(spec, pageable).map(this::convertirADTO);
    }

    private Specification<Especialista> createSpecification(EspecialistaCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getSearch())) {
                String likePattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombresApellidos")), likePattern),
                        cb.like(cb.lower(root.get("cedula")), likePattern)));
            }

            if (criteria.getEspecialidadId() != null) {
                Join<Object, Object> espJoin = root.join("especialidad");
                predicates.add(cb.equal(espJoin.get("id"), criteria.getEspecialidadId()));
            }

            if (criteria.getSedeId() != null) {
                Join<Object, Object> sedeJoin = root.join("sede");
                predicates.add(cb.equal(sedeJoin.get("id"), criteria.getSedeId()));
            }

            if (criteria.getActivo() != null) {
                predicates.add(cb.equal(root.get("activo"), criteria.getActivo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public EspecialistaDTO crearEspecialista(EspecialistaRequest request, MultipartFile foto) {
        log.info("Iniciando creación de especialista. Cédula: {}", request.getCedula());

        if (!cedulaValidatorService.validarCedulaEcuatoriana(request.getCedula())) {
            log.error("Cédula inválida: {}", request.getCedula());
            throw new RuntimeException("La cédula ingresada no es válida.");
        }

        if (especialistaRepository.existsByCedula(request.getCedula())) {
            log.error("Ya existe un especialista con la cédula: {}", request.getCedula());
            throw new RuntimeException("Ya existe un especialista con la cédula: " + request.getCedula());
        }

        Especialista especialista = new Especialista();
        mapearRequestAEntidad(request, especialista);
        especialista.setActivo(true);
        
        if (request.getPermisos() != null) {
            especialista.setPermisos(request.getPermisos());
        } else {
            Permisos permisos = new Permisos();
            permisos.setPacientes(true);
            permisos.setHistoriaClinica(true);
            especialista.setPermisos(permisos);
        }

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            especialista.setFotoUrl(filename);
            log.info("Foto guardada para especialista ID: {}", especialista.getId());
        }

        if (request.getContrasenia() == null || request.getContrasenia().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        Especialista saved = especialistaRepository.save(especialista);
        log.info("Especialista creado exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public EspecialistaDTO actualizarEspecialista(Integer id, EspecialistaRequest request, MultipartFile foto) {
        log.info("Iniciando actualización de especialista ID: {}", id);
        if (id == null)
            throw new IllegalArgumentException("ID requerido para actualizar");
        Especialista especialista = especialistaRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error al actualizar: Especialista no encontrado ID: {}", id);
                    return new RuntimeException("Especialista no encontrado");
                });

        if (!cedulaValidatorService.validarCedulaEcuatoriana(request.getCedula())) {
            log.error("Cédula inválida: {}", request.getCedula());
            throw new RuntimeException("La cédula ingresada no es válida.");
        }

        mapearRequestAEntidad(request, especialista);
        
        if (request.getPermisos() != null) {
             if (especialista.getPermisos() != null) {
                 especialista.getPermisos().updateFrom(request.getPermisos());
             } else {
                 especialista.setPermisos(request.getPermisos());
             }
        }

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            especialista.setFotoUrl(filename);
            log.info("Foto guardada para especialista ID: {}", id);
        }

        Especialista saved = especialistaRepository.save(especialista);
        log.info("Especialista actualizado exitosamente con cédula: {}", saved.getCedula());

        return convertirADTO(saved);
    }
    
    public void eliminarEspecialista(Integer id) {
        if (id == null)
            return;
        especialistaRepository.findById(id).ifPresentOrElse(e -> {
            log.info("Desactivando especialista ID: {}", id);
            e.setActivo(false);
            especialistaRepository.save(e);
        }, () -> log.warn("Intento de eliminar especialista inexistente ID: {}", id));
    }

    private void mapearRequestAEntidad(EspecialistaRequest request, Especialista especialista) {
        especialista.setCedula(request.getCedula());
        especialista.setNombresApellidos(request.getNombresApellidos());
        if (request.getContrasenia() != null && !request.getContrasenia().isEmpty()) {
            especialista.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        }

        if (request.getEspecialidadId() != null) {
            especialista.setEspecialidad(especialidadRepository.findById(request.getEspecialidadId()).orElse(null));
        }

        if (request.getSedeId() != null) {
            especialista.setSede(sedeRepository.findById(request.getSedeId()).orElse(null));
        }

        if (request.getActivo() != null) {
            especialista.setActivo(request.getActivo());
        }
    }

    public EspecialistaDTO convertirADTO(Especialista especialista) {
        return EspecialistaDTO.builder()
                .id(especialista.getId())
                .cedula(especialista.getCedula())
                .nombresApellidos(especialista.getNombresApellidos())
                .fotoUrl(especialista.getFotoUrl())
                .especialidad(especialista.getEspecialidad() != null ? new EspecialidadDTO(
                        especialista.getEspecialidad().getId(), especialista.getEspecialidad().getArea(), null) : null)
                .sede(especialista.getSede() != null ? new SedeDTO(
                    especialista.getSede().getId(), especialista.getSede().getNombre()) : null)
                .activo(especialista.getActivo())
                .permisos(especialista.getPermisos())
                .build();
    }
}
