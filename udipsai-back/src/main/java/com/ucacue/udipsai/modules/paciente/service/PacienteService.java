package com.ucacue.udipsai.modules.paciente.service;

import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import com.ucacue.udipsai.modules.instituciones.repository.InstitucionEducativaRepository;
import com.ucacue.udipsai.modules.paciente.dto.PacienteRequest;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteCriteriaDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteSummaryDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import com.ucacue.udipsai.modules.sedes.repository.SedeRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.extern.slf4j.Slf4j;
import com.ucacue.udipsai.common.util.CedulaValidatorService;
import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaDTO;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;
import com.ucacue.udipsai.modules.asignacion.repository.AsignacionRepository;
import com.ucacue.udipsai.modules.documentos.dto.DocumentoDTO;
import com.ucacue.udipsai.modules.documentos.repository.DocumentoRepository;
import com.ucacue.udipsai.modules.historiaclinica.repository.HistoriaClinicaRepository;
import com.ucacue.udipsai.modules.fonoaudiologia.repository.FonoaudiologiaRepository;
import com.ucacue.udipsai.modules.psicologiaclinica.repository.PsicologiaClinicaRepository;
import com.ucacue.udipsai.modules.psicologiaeducativa.repository.PsicologiaEducativaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private InstitucionEducativaRepository institucionEducativaRepository;

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Autowired
    private FonoaudiologiaRepository fonoaudiologiaRepository;

    @Autowired
    private PsicologiaClinicaRepository psicologiaClinicaRepository;

    @Autowired
    private PsicologiaEducativaRepository psicologiaEducativaRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    @Autowired
    private CedulaValidatorService cedulaValidatorService;

    @Transactional(readOnly = true)
    public Page<PacienteDTO> listarPacientesActivos(Pageable pageable) {
        return filtrarPacientes(new PacienteCriteriaDTO(), pageable);
    }

    @Transactional(readOnly = true)
    public PacienteDTO obtenerPacientePorId(Integer id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Paciente con ID " + id + " no encontrado"));
        return convertirADTO(paciente);
    }

    @Transactional(readOnly = true)
    public List<PacienteDTO> listarPacientesSinPaginacion(PacienteCriteriaDTO criteria) {
        log.info("Listando pacientes sin paginación para reportes con criterios: {}", criteria);
        Specification<Paciente> spec = createSpecification(criteria);
        return pacienteRepository.findAll(spec).stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PacienteDTO> filtrarPacientes(PacienteCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando pacientes con criterios: {}", criteria);
        Specification<Paciente> spec = createSpecification(criteria);
        return pacienteRepository.findAll(spec, pageable).map(this::convertirADTO);
    }

    private Specification<Paciente> createSpecification(PacienteCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PASANTE"))) {
                String cedula = auth.getName();
                var pasanteOpt = pasanteRepository.findByCedula(cedula);
                if (pasanteOpt.isPresent()) {
                    Integer pasanteId = pasanteOpt.get().getId();
                    List<Integer> assignedPatientIds = asignacionRepository.findByPasanteIdAndActivoTrue(pasanteId)
                            .stream()
                            .map(a -> a.getPaciente().getId())
                            .collect(Collectors.toList());
                    
                    if (assignedPatientIds.isEmpty()) {
                        predicates.add(cb.disjunction());
                    } else {
                        predicates.add(root.get("id").in(assignedPatientIds));
                    }
                } else {
                    predicates.add(cb.disjunction());
                }
            }
            
            if (StringUtils.hasText(criteria.getSearch())) {
                String searchPattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombresApellidos")), searchPattern),
                        cb.like(cb.lower(root.get("cedula")), searchPattern)));
            }

            if (StringUtils.hasText(criteria.getCiudad())) {
                predicates.add(cb.like(cb.lower(root.get("ciudad")),
                        "%" + criteria.getCiudad().toLowerCase() + "%"));
            }
            
            Boolean activeFilter = criteria.getActivo() != null ? criteria.getActivo() : true;
            predicates.add(cb.equal(root.get("activo"), activeFilter));

            if (criteria.getSedeId() != null) {
                Join<Object, Object> sedeJoin = root.join("sede");
                predicates.add(cb.equal(sedeJoin.get("id"), criteria.getSedeId()));
            }
            if (criteria.getInstitucionEducativaId() != null) {
                Join<Object, Object> ieJoin = root.join("institucionEducativa");
                predicates.add(cb.equal(ieJoin.get("id"), criteria.getInstitucionEducativaId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
    public PacienteDTO crearPaciente(PacienteRequest request, MultipartFile foto, MultipartFile fichaCompromiso, MultipartFile fichaDeteccion, List<MultipartFile> otrosDocumentos) {
        log.info("Iniciando creación de paciente: {}", request.getNombresApellidos());
        
        if (!cedulaValidatorService.validarCedulaEcuatoriana(request.getCedula())) {
            log.error("Cédula inválida: {}", request.getCedula());
            throw new RuntimeException("La cédula ingresada no es válida.");
        }

        if (pacienteRepository.existsByCedula(request.getCedula())) {
            log.error("Ya existe un paciente con la cédula: {}", request.getCedula());
            throw new RuntimeException("Ya existe un paciente con la cédula: " + request.getCedula());
        }

        Paciente paciente = new Paciente();
        mapearRequestAEntidad(request, paciente);
        paciente.setFechaApertura(LocalDateTime.now());
        paciente.setActivo(true);

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            paciente.setFotoUrl(filename);
            log.debug("Foto guardada para paciente ID: {}", paciente.getId());
        }

        Paciente saved = pacienteRepository.save(paciente);
        
        guardarDocumentoSiExiste(saved, fichaCompromiso, "Ficha Compromiso");
        guardarDocumentoSiExiste(saved, fichaDeteccion, "Ficha Detección");
        
        if (otrosDocumentos != null) {
            for (MultipartFile file : otrosDocumentos) {
                if (file != null && !file.isEmpty()) {
                    guardarDocumentoSiExiste(saved, file, file.getOriginalFilename());
                }
            }
        }
        
        saved = pacienteRepository.save(saved); 

        log.info("Paciente creado exitosamente con cédula: {}", saved.getCedula());
        return convertirADTO(saved);
    }

    @Transactional
    public PacienteDTO actualizarPaciente(Integer id, PacienteRequest request, MultipartFile foto, MultipartFile fichaCompromiso, MultipartFile fichaDeteccion, List<MultipartFile> otrosDocumentos) {
        log.info("Iniciando actualización de paciente ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error al actualizar: Paciente no encontrado ID: {}", id);
                    return new RuntimeException("Paciente no encontrado");
                });

        mapearRequestAEntidad(request, paciente);

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            paciente.setFotoUrl(filename);
            log.debug("Foto actualizada para paciente ID: {}", id);
        }

        guardarDocumentoSiExiste(paciente, fichaCompromiso, "Ficha Compromiso");
        guardarDocumentoSiExiste(paciente, fichaDeteccion, "Ficha Detección");

        if (otrosDocumentos != null) {
            for (MultipartFile file : otrosDocumentos) {
                if (file != null && !file.isEmpty()) {
                    guardarDocumentoSiExiste(paciente, file, file.getOriginalFilename());
                }
            }
        }

        Paciente saved = pacienteRepository.save(paciente);
        log.info("Paciente actualizado exitosamente ID: {}", saved.getId());

        return convertirADTO(saved);
    }

    private void guardarDocumentoSiExiste(Paciente paciente, MultipartFile file, String nombreDocumento) {
        if (file != null && !file.isEmpty()) {
            try {
                paciente.getDocumentos().stream()
                    .filter(d -> d.getNombre().equals(nombreDocumento) && d.getActivo())
                    .findFirst()
                    .ifPresent(d -> d.setActivo(false));

                String filename = storageService.store(file);
                com.ucacue.udipsai.modules.documentos.domain.Documento doc = new com.ucacue.udipsai.modules.documentos.domain.Documento();
                doc.setNombre(nombreDocumento);
                doc.setUrl(filename);
                doc.setPaciente(paciente);
                doc.setActivo(true);
                
                documentoRepository.save(doc);
                paciente.getDocumentos().add(doc);
                
                log.info("Documento '{}' guardado exitosamente con URL '{}' para paciente ID: {}", 
                    nombreDocumento, filename, paciente.getId());
            } catch (Exception e) {
                log.error("Error crítico al guardar documento '{}' para paciente ID {}: {}", 
                    nombreDocumento, paciente.getId(), e.getMessage(), e);
            }
        }
    }

    @Transactional
    public void eliminarPaciente(Integer id) {
        log.info("Iniciando eliminación de paciente ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Intento de eliminar paciente inexistente ID: {}", id);
                    return new RuntimeException("Paciente no encontrado");
                });
        paciente.setActivo(false);
        pacienteRepository.save(paciente);
        log.info("Paciente ID {} desactivado", id);
    }

    private void mapearRequestAEntidad(PacienteRequest request, Paciente paciente) {
        paciente.setNombresApellidos(request.getNombresApellidos());
        paciente.setCiudad(request.getCiudad());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setCedula(request.getCedula());
        paciente.setDomicilio(request.getDomicilio());
        paciente.setNumeroTelefono(request.getNumeroTelefono());
        paciente.setNumeroCelular(request.getNumeroCelular());
        paciente.setProyecto(request.getProyecto());
        paciente.setJornada(request.getJornada());
        paciente.setNivelEducativo(request.getNivelEducativo());
        paciente.setAnioEducacion(request.getAnioEducacion());
        paciente.setPerteneceInclusion(request.getPerteneceInclusion());
        paciente.setTieneDiscapacidad(request.getTieneDiscapacidad());
        paciente.setPortadorCarnet(request.getPortadorCarnet());
        paciente.setPerteneceAProyecto(request.getPerteneceAProyecto());
        paciente.setDiagnostico(request.getDiagnostico());
        paciente.setMotivoConsulta(request.getMotivoConsulta());
        paciente.setObservaciones(request.getObservaciones());
        paciente.setTipoDiscapacidad(request.getTipoDiscapacidad());
        paciente.setDetalleDiscapacidad(request.getDetalleDiscapacidad());
        paciente.setPorcentajeDiscapacidad(request.getPorcentajeDiscapacidad());

        if (request.getInstitucionEducativaId() != null && request.getInstitucionEducativaId() != 0) {
            InstitucionEducativa ie = institucionEducativaRepository.findById(request.getInstitucionEducativaId())
                    .orElseThrow(() -> new RuntimeException("Institucion Educativa not found"));
            paciente.setInstitucionEducativa(ie);
        }

        if (request.getSedeId() != null && request.getSedeId() != 0) {
            Sede sede = sedeRepository.findById(request.getSedeId())
                    .orElseThrow(() -> new RuntimeException("Sede not found"));
            paciente.setSede(sede);
        }
    }

    public PacienteDTO convertirADTO(Paciente paciente) {
        return PacienteDTO.builder()
                .id(paciente.getId())
                .fechaApertura(paciente.getFechaApertura())
                .activo(paciente.getActivo())
                .nombresApellidos(paciente.getNombresApellidos())
                .ciudad(paciente.getCiudad())
                .fechaNacimiento(paciente.getFechaNacimiento())
                .edad(paciente.getEdad())
                .cedula(paciente.getCedula())
                .domicilio(paciente.getDomicilio())
                .fotoUrl(paciente.getFotoUrl())
                .numeroTelefono(paciente.getNumeroTelefono())
                .numeroCelular(paciente.getNumeroCelular())
                .institucionEducativa(paciente.getInstitucionEducativa() != null ? new InstitucionEducativaDTO(
                        paciente.getInstitucionEducativa().getId(), paciente.getInstitucionEducativa().getNombre())
                        : null)
                .sede(paciente.getSede() != null ? new SedeDTO(
                        paciente.getSede().getId(), paciente.getSede().getNombre()) : null)
                .proyecto(paciente.getProyecto())
                .jornada(paciente.getJornada())
                .nivelEducativo(paciente.getNivelEducativo())
                .anioEducacion(paciente.getAnioEducacion())
                .perteneceInclusion(paciente.getPerteneceInclusion())
                .tieneDiscapacidad(paciente.getTieneDiscapacidad())
                .portadorCarnet(paciente.getPortadorCarnet())
                .perteneceAProyecto(paciente.getPerteneceAProyecto())
                .diagnostico(paciente.getDiagnostico())
                .motivoConsulta(paciente.getMotivoConsulta())
                .observaciones(paciente.getObservaciones())
                .tipoDiscapacidad(paciente.getTipoDiscapacidad())
                .detalleDiscapacidad(paciente.getDetalleDiscapacidad())
                .porcentajeDiscapacidad(paciente.getPorcentajeDiscapacidad())
                .documentos(paciente.getDocumentos() != null ? paciente.getDocumentos().stream()
                        .filter(d -> d.getActivo())
                        .map(d -> new DocumentoDTO(d.getId(), d.getUrl(), d.getNombre()))
                        .collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    @Autowired
    private DocumentoRepository documentoRepository;

    @Transactional(readOnly = true)
    public PacienteSummaryDTO obtenerResumenFichas(Integer id) {
        log.info("Obteniendo resumen de fichas para paciente ID: {}", id);
        Map<String, Integer> fichasMap = new HashMap<>();

        var hc = historiaClinicaRepository.findByPacienteIdAndActivo(id, true);
        if (hc != null) fichasMap.put("Historia Clínica", hc.getId());

        var fono = fonoaudiologiaRepository.findByPacienteIdAndActivo(id, true);
        if (fono != null) fichasMap.put("Fonoaudiología", fono.getId());

        var pc = psicologiaClinicaRepository.findByPacienteIdAndActivo(id, true);
        if (pc != null) fichasMap.put("Psicología Clínica", pc.getId());

        var pe = psicologiaEducativaRepository.findByPacienteIdAndActivo(id, true);
        if (pe != null) fichasMap.put("Psicología Educativa", pe.getId());

        List<com.ucacue.udipsai.modules.documentos.domain.Documento> extraDocs = documentoRepository.findByPacienteIdAndActivoTrue(id);
        log.info("Cargando {} documentos desde repositorio para resumen de paciente ID: {}", 
            extraDocs.size(), id);
        
        extraDocs.forEach(d -> {
            String nombre = d.getNombre();
            if (!StringUtils.hasText(nombre)) nombre = "Documento sin nombre";
            
            if (!fichasMap.containsKey(nombre)) {
                fichasMap.put(nombre, d.getId());
            } else if ("Ficha Compromiso".equals(nombre) || "Ficha Detección".equals(nombre)) {
                fichasMap.put(nombre, d.getId());
            } else {
                fichasMap.put(nombre + " (" + d.getId() + ")", d.getId());
            }
        });
        
        log.debug("Resumen de fichas generado: {}", fichasMap);

        return PacienteSummaryDTO.builder()
                .totalFichas(fichasMap.size())
                .fichas(fichasMap)
                .build();
    }

    @Transactional(readOnly = true)
    public Resource descargarDocumento(Integer id) {
        var documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        
        return storageService.loadAsResource(documento.getUrl());
    }

    @Transactional
    public void eliminarDocumento(Integer id) {
        var documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        documento.setActivo(false);
        documentoRepository.save(documento);
        log.info("Documento ID {} eliminado (lógicamente)", id);
    }
}
