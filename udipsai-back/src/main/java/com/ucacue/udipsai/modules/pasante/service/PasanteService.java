package com.ucacue.udipsai.modules.pasante.service;

import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.especialidad.repository.EspecialidadRepository;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;

import com.ucacue.udipsai.modules.especialistas.service.EspecialistaService;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.dto.PasanteCriteriaDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteRequest;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import com.ucacue.udipsai.modules.permisos.Permisos;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;
import com.ucacue.udipsai.modules.sedes.repository.SedeRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import com.ucacue.udipsai.common.util.CedulaValidatorService;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PasanteService {

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private PasanteRepository pasanteRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private EspecialistaService especialistaService;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private CedulaValidatorService cedulaValidatorService;

    @Transactional(readOnly = true)
    public Page<PasanteDTO> listarPasantesActivos(Pageable pageable) {
        return pasanteRepository.findByActivoTrue(pageable)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public PasanteDTO obtenerPasantePorId(Integer id) {
        if (id == null)
            return null;
        return pasanteRepository.findById(id)
                .map(this::convertirADTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<PasanteDTO> listarPasantesSinPaginacion(PasanteCriteriaDTO criteria) {
        log.info("Listando pasantes sin paginación para reportes con criterios: {}", criteria);
        Specification<Pasante> spec = createSpecification(criteria);
        return pasanteRepository.findAll(spec).stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PasanteDTO> filtrarPasantes(PasanteCriteriaDTO criteria, Pageable pageable) {
        log.info("Consultando pasantes con criterios: {}", criteria);
        Specification<Pasante> spec = createSpecification(criteria);
        return pasanteRepository.findAll(spec, pageable).map(this::convertirADTO);
    }

    private Specification<Pasante> createSpecification(PasanteCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getSearch())) {
                String likePattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombresApellidos")), likePattern),
                        cb.like(cb.lower(root.get("cedula")), likePattern)));
            }

            if (criteria.getCiudad() != null) {
                predicates.add(cb.equal(root.get("ciudad"), criteria.getCiudad()));
            }

            if (criteria.getActivo() != null) {
                predicates.add(cb.equal(root.get("activo"), criteria.getActivo()));
            }
            if (criteria.getEspecialistaId() != null) {
                Join<Object, Object> especialistaJoin = root.join("especialista");
                predicates.add(cb.equal(especialistaJoin.get("id"), criteria.getEspecialistaId()));
            }
            if (criteria.getEspecialidadId() != null) {
                Join<Object, Object> especialidadJoin = root.join("especialidad");
                predicates.add(cb.equal(especialidadJoin.get("id"), criteria.getEspecialidadId()));
            }

            if (criteria.getSedeId() != null) {
                Join<Object, Object> sedeJoin = root.join("sede");
                predicates.add(cb.equal(sedeJoin.get("id"), criteria.getSedeId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public PasanteDTO crearPasante(PasanteRequest request, MultipartFile foto) {
        log.info("Iniciando creación de pasante: {}", request.getCedula());

        if (!cedulaValidatorService.validarCedulaEcuatoriana(request.getCedula())) {
            log.error("Cédula inválida: {}", request.getCedula());
            throw new RuntimeException("La cédula ingresada no es válida.");
        }

        if (pasanteRepository.existsByCedula(request.getCedula())) {
            log.error("Intento de crear pasante duplicado. Cédula: {}", request.getCedula());
            throw new RuntimeException("Pasante con cédula " + request.getCedula() + " ya existe");
        }

        Pasante pasante = new Pasante();
        mapearRequestAEntidad(request, pasante);
        pasante.setActivo(true);

        if (request.getPermisos() != null) {
            pasante.setPermisos(request.getPermisos());
        } else {
            Permisos permisos = new Permisos();
            permisos.setPasantes(true);
            pasante.setPermisos(permisos);
        }

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            pasante.setFotoUrl(filename);
            log.debug("Foto guardada para pasante: {}", filename);
        }

        Pasante saved = pasanteRepository.save(pasante);
        log.info("Pasante creado exitosamente con cédula: {}", saved.getCedula());
        return convertirADTO(saved);
    }

    @Transactional
    public PasanteDTO actualizarPasante(Integer id, PasanteRequest request, MultipartFile foto) {
        log.info("Iniciando actualización de pasante ID: {}", id);
        if (id == null)
            throw new IllegalArgumentException("ID requerido para actualizar");
        Pasante pasante = pasanteRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Pasante ID {} no encontrado para actualización", id);
                    return new RuntimeException("Pasante no encontrado");
                });

        if (!cedulaValidatorService.validarCedulaEcuatoriana(request.getCedula())) {
            log.error("Cédula inválida: {}", request.getCedula());
            throw new RuntimeException("La cédula ingresada no es válida.");
        }

        mapearRequestAEntidad(request, pasante);

        if (request.getPermisos() != null) {
            if (pasante.getPermisos() != null) {
                pasante.getPermisos().updateFrom(request.getPermisos());
            } else {
                pasante.setPermisos(request.getPermisos());
            }
        }

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            pasante.setFotoUrl(filename);
            log.debug("Foto actualizada para pasante ID: {}", id);
        }

        Pasante saved = pasanteRepository.save(pasante);
        log.info("Pasante actualizado exitosamente ID: {}", saved.getId());

        return convertirADTO(saved);
    }

    public void eliminarPasante(Integer id) {
        log.info("Iniciando eliminación de pasante ID: {}", id);
        if (id == null)
            return;
        pasanteRepository.findById(id).ifPresent(p -> {
            p.setActivo(false);
            pasanteRepository.save(p);
            log.info("Pasante ID {} desactivado", id);
        });
    }

    @Transactional(readOnly = true)
    public List<PasanteDTO> buscarPasantes(String search, Integer especialistaId) {
        log.info("Buscando pasantes. Search: {}, EspecialistaId: {}", search, especialistaId);

        Specification<Pasante> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            String likePattern = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("nombresApellidos")), likePattern),
                    cb.like(cb.lower(root.get("cedula")), likePattern)));
        }

        if (especialistaId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("especialista").get("id"), especialistaId));
        }

        spec = spec.and((root, query, cb) -> cb.equal(root.get("activo"), true));

        return pasanteRepository.findAll(spec).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private void mapearRequestAEntidad(PasanteRequest request, Pasante pasante) {
        pasante.setCedula(request.getCedula());
        pasante.setNombresApellidos(request.getNombresApellidos());
        pasante.setEmail(request.getEmail());
        pasante.setInicioPasantia(request.getInicioPasantia());
        pasante.setFinPasantia(request.getFinPasantia());
        pasante.setCiudad(request.getCiudad());
        pasante.setFechaNacimiento(request.getFechaNacimiento());
        pasante.setDomicilio(request.getDomicilio());
        pasante.setNumeroTelefono(request.getNumeroTelefono());
        pasante.setNumeroCelular(request.getNumeroCelular());

        if (request.getEspecialistaId() != null) {
            pasante.setEspecialista(especialistaRepository.findById(request.getEspecialistaId()).orElse(null));
        }

        if (request.getEspecialidadId() != null) {
            pasante.setEspecialidad(especialidadRepository.findById(request.getEspecialidadId()).orElse(null));
        }

        if (request.getSedeId() != null) {
            pasante.setSede(sedeRepository.findById(request.getSedeId()).orElse(null));
        }

        if (request.getContrasenia() != null && !request.getContrasenia().isEmpty()) {
            pasante.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        }
    }

    public PasanteDTO convertirADTO(Pasante pasante) {
        return PasanteDTO.builder()
                .id(pasante.getId())
                .cedula(pasante.getCedula())
                .nombresApellidos(pasante.getNombresApellidos())
                .email(pasante.getEmail())
                .ciudad(pasante.getCiudad())
                .fechaNacimiento(pasante.getFechaNacimiento())
                .domicilio(pasante.getDomicilio())
                .numeroTelefono(pasante.getNumeroTelefono())
                .numeroCelular(pasante.getNumeroCelular())
                .fotoUrl(pasante.getFotoUrl())
                .inicioPasantia(pasante.getInicioPasantia())
                .finPasantia(pasante.getFinPasantia())
                .especialista(
                        pasante.getEspecialista() != null ? especialistaService.convertirADTO(pasante.getEspecialista())
                                : null)
                .sede(pasante.getSede() != null ? new SedeDTO(
                        pasante.getSede().getId(), pasante.getSede().getNombre())
                        : null)
                .especialidad(pasante.getEspecialidad() != null ? new EspecialidadDTO(
                        pasante.getEspecialidad().getId(), pasante.getEspecialidad().getArea(), null)
                        : null)
                .activo(pasante.getActivo())
                .permisos(pasante.getPermisos())
                .build();
    }
}
