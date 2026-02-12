package com.ucacue.udipsai.modules.permisos;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermisoService {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    public PermisosDTO obtenerPermisosEspecialista(Integer id) {
        Especialista especialista = especialistaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));
        return mapToDTO(especialista.getPermisos());
    }

    public PermisosDTO obtenerPermisosPasante(Integer id) {
        Pasante pasante = pasanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pasante no encontrado"));
        return mapToDTO(pasante.getPermisos());
    }

    @Transactional
    public PermisosDTO actualizarPermisosEspecialista(Integer id, PermisosDTO dto) {
        Especialista especialista = especialistaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));
        
        if (especialista.getPermisos() == null) {
            especialista.setPermisos(new Permisos());
        }
        
        updatePermisosFromDTO(especialista.getPermisos(), dto);
        especialistaRepository.save(especialista);
        return mapToDTO(especialista.getPermisos());
    }

    @Transactional
    public PermisosDTO actualizarPermisosPasante(Integer id, PermisosDTO dto) {
        Pasante pasante = pasanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pasante no encontrado"));

        if (pasante.getPermisos() == null) {
            pasante.setPermisos(new Permisos());
        }

        updatePermisosFromDTO(pasante.getPermisos(), dto);
        pasanteRepository.save(pasante);
        return mapToDTO(pasante.getPermisos());
    }

    private PermisosDTO mapToDTO(Permisos entity) {
        if (entity == null) return new PermisosDTO();
        PermisosDTO dto = new PermisosDTO();
        dto.setId(entity.getId());
        
        dto.setPacientes(entity.getPacientes());
        dto.setPacientesCrear(entity.getPacientesCrear());
        dto.setPacientesEditar(entity.getPacientesEditar());
        dto.setPacientesEliminar(entity.getPacientesEliminar());

        dto.setPasantes(entity.getPasantes());
        dto.setPasantesCrear(entity.getPasantesCrear());
        dto.setPasantesEditar(entity.getPasantesEditar());
        dto.setPasantesEliminar(entity.getPasantesEliminar());

        dto.setSedes(entity.getSedes());
        dto.setSedesCrear(entity.getSedesCrear());
        dto.setSedesEditar(entity.getSedesEditar());
        dto.setSedesEliminar(entity.getSedesEliminar());

        dto.setEspecialistas(entity.getEspecialistas());
        dto.setEspecialistasCrear(entity.getEspecialistasCrear());
        dto.setEspecialistasEditar(entity.getEspecialistasEditar());
        dto.setEspecialistasEliminar(entity.getEspecialistasEliminar());

        dto.setEspecialidades(entity.getEspecialidades());
        dto.setEspecialidadesCrear(entity.getEspecialidadesCrear());
        dto.setEspecialidadesEditar(entity.getEspecialidadesEditar());
        dto.setEspecialidadesEliminar(entity.getEspecialidadesEliminar());

        dto.setAsignaciones(entity.getAsignaciones());
        dto.setAsignacionesCrear(entity.getAsignacionesCrear());
        dto.setAsignacionesEditar(entity.getAsignacionesEditar());
        dto.setAsignacionesEliminar(entity.getAsignacionesEliminar());

        dto.setRecursos(entity.getRecursos());
        dto.setRecursosCrear(entity.getRecursosCrear());
        dto.setRecursosEditar(entity.getRecursosEditar());
        dto.setRecursosEliminar(entity.getRecursosEliminar());

        dto.setInstitucionesEducativas(entity.getInstitucionesEducativas());
        dto.setInstitucionesEducativasCrear(entity.getInstitucionesEducativasCrear());
        dto.setInstitucionesEducativasEditar(entity.getInstitucionesEducativasEditar());
        dto.setInstitucionesEducativasEliminar(entity.getInstitucionesEducativasEliminar());

        dto.setHistoriaClinica(entity.getHistoriaClinica());
        dto.setHistoriaClinicaCrear(entity.getHistoriaClinicaCrear());
        dto.setHistoriaClinicaEditar(entity.getHistoriaClinicaEditar());
        dto.setHistoriaClinicaEliminar(entity.getHistoriaClinicaEliminar());

        dto.setFonoAudiologia(entity.getFonoAudiologia());
        dto.setFonoAudiologiaCrear(entity.getFonoAudiologiaCrear());
        dto.setFonoAudiologiaEditar(entity.getFonoAudiologiaEditar());
        dto.setFonoAudiologiaEliminar(entity.getFonoAudiologiaEliminar());

        dto.setPsicologiaClinica(entity.getPsicologiaClinica());
        dto.setPsicologiaClinicaCrear(entity.getPsicologiaClinicaCrear());
        dto.setPsicologiaClinicaEditar(entity.getPsicologiaClinicaEditar());
        dto.setPsicologiaClinicaEliminar(entity.getPsicologiaClinicaEliminar());

        dto.setPsicologiaEducativa(entity.getPsicologiaEducativa());
        dto.setPsicologiaEducativaCrear(entity.getPsicologiaEducativaCrear());
        dto.setPsicologiaEducativaEditar(entity.getPsicologiaEducativaEditar());
        dto.setPsicologiaEducativaEliminar(entity.getPsicologiaEducativaEliminar());
        
        return dto;
    }

    private void updatePermisosFromDTO(Permisos entity, PermisosDTO dto) {
        if (dto.getPacientes() != null) entity.setPacientes(dto.getPacientes());
        if (dto.getPacientesCrear() != null) entity.setPacientesCrear(dto.getPacientesCrear());
        if (dto.getPacientesEditar() != null) entity.setPacientesEditar(dto.getPacientesEditar());
        if (dto.getPacientesEliminar() != null) entity.setPacientesEliminar(dto.getPacientesEliminar());

        if (dto.getPasantes() != null) entity.setPasantes(dto.getPasantes());
        if (dto.getPasantesCrear() != null) entity.setPasantesCrear(dto.getPasantesCrear());
        if (dto.getPasantesEditar() != null) entity.setPasantesEditar(dto.getPasantesEditar());
        if (dto.getPasantesEliminar() != null) entity.setPasantesEliminar(dto.getPasantesEliminar());

        if (dto.getSedes() != null) entity.setSedes(dto.getSedes());
        if (dto.getSedesCrear() != null) entity.setSedesCrear(dto.getSedesCrear());
        if (dto.getSedesEditar() != null) entity.setSedesEditar(dto.getSedesEditar());
        if (dto.getSedesEliminar() != null) entity.setSedesEliminar(dto.getSedesEliminar());

        if (dto.getEspecialistas() != null) entity.setEspecialistas(dto.getEspecialistas());
        if (dto.getEspecialistasCrear() != null) entity.setEspecialistasCrear(dto.getEspecialistasCrear());
        if (dto.getEspecialistasEditar() != null) entity.setEspecialistasEditar(dto.getEspecialistasEditar());
        if (dto.getEspecialistasEliminar() != null) entity.setEspecialistasEliminar(dto.getEspecialistasEliminar());

        if (dto.getEspecialidades() != null) entity.setEspecialidades(dto.getEspecialidades());
        if (dto.getEspecialidadesCrear() != null) entity.setEspecialidadesCrear(dto.getEspecialidadesCrear());
        if (dto.getEspecialidadesEditar() != null) entity.setEspecialidadesEditar(dto.getEspecialidadesEditar());
        if (dto.getEspecialidadesEliminar() != null) entity.setEspecialidadesEliminar(dto.getEspecialidadesEliminar());

        if (dto.getAsignaciones() != null) entity.setAsignaciones(dto.getAsignaciones());
        if (dto.getAsignacionesCrear() != null) entity.setAsignacionesCrear(dto.getAsignacionesCrear());
        if (dto.getAsignacionesEditar() != null) entity.setAsignacionesEditar(dto.getAsignacionesEditar());
        if (dto.getAsignacionesEliminar() != null) entity.setAsignacionesEliminar(dto.getAsignacionesEliminar());

        if (dto.getRecursos() != null) entity.setRecursos(dto.getRecursos());
        if (dto.getRecursosCrear() != null) entity.setRecursosCrear(dto.getRecursosCrear());
        if (dto.getRecursosEditar() != null) entity.setRecursosEditar(dto.getRecursosEditar());
        if (dto.getRecursosEliminar() != null) entity.setRecursosEliminar(dto.getRecursosEliminar());

        if (dto.getInstitucionesEducativas() != null) entity.setInstitucionesEducativas(dto.getInstitucionesEducativas());
        if (dto.getInstitucionesEducativasCrear() != null) entity.setInstitucionesEducativasCrear(dto.getInstitucionesEducativasCrear());
        if (dto.getInstitucionesEducativasEditar() != null) entity.setInstitucionesEducativasEditar(dto.getInstitucionesEducativasEditar());
        if (dto.getInstitucionesEducativasEliminar() != null) entity.setInstitucionesEducativasEliminar(dto.getInstitucionesEducativasEliminar());

        if (dto.getHistoriaClinica() != null) entity.setHistoriaClinica(dto.getHistoriaClinica());
        if (dto.getHistoriaClinicaCrear() != null) entity.setHistoriaClinicaCrear(dto.getHistoriaClinicaCrear());
        if (dto.getHistoriaClinicaEditar() != null) entity.setHistoriaClinicaEditar(dto.getHistoriaClinicaEditar());
        if (dto.getHistoriaClinicaEliminar() != null) entity.setHistoriaClinicaEliminar(dto.getHistoriaClinicaEliminar());

        if (dto.getFonoAudiologia() != null) entity.setFonoAudiologia(dto.getFonoAudiologia());
        if (dto.getFonoAudiologiaCrear() != null) entity.setFonoAudiologiaCrear(dto.getFonoAudiologiaCrear());
        if (dto.getFonoAudiologiaEditar() != null) entity.setFonoAudiologiaEditar(dto.getFonoAudiologiaEditar());
        if (dto.getFonoAudiologiaEliminar() != null) entity.setFonoAudiologiaEliminar(dto.getFonoAudiologiaEliminar());

        if (dto.getPsicologiaClinica() != null) entity.setPsicologiaClinica(dto.getPsicologiaClinica());
        if (dto.getPsicologiaClinicaCrear() != null) entity.setPsicologiaClinicaCrear(dto.getPsicologiaClinicaCrear());
        if (dto.getPsicologiaClinicaEditar() != null) entity.setPsicologiaClinicaEditar(dto.getPsicologiaClinicaEditar());
        if (dto.getPsicologiaClinicaEliminar() != null) entity.setPsicologiaClinicaEliminar(dto.getPsicologiaClinicaEliminar());

        if (dto.getPsicologiaEducativa() != null) entity.setPsicologiaEducativa(dto.getPsicologiaEducativa());
        if (dto.getPsicologiaEducativaCrear() != null) entity.setPsicologiaEducativaCrear(dto.getPsicologiaEducativaCrear());
        if (dto.getPsicologiaEducativaEditar() != null) entity.setPsicologiaEducativaEditar(dto.getPsicologiaEducativaEditar());
        if (dto.getPsicologiaEducativaEliminar() != null) entity.setPsicologiaEducativaEliminar(dto.getPsicologiaEducativaEliminar());
    }
}
