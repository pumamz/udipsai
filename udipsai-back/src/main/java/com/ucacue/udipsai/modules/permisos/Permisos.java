package com.ucacue.udipsai.modules.permisos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pacientes")
    private Boolean pacientes = false;
    @Column(name = "pacientes_crear")
    private Boolean pacientesCrear = false;
    @Column(name = "pacientes_editar")
    private Boolean pacientesEditar = false;
    @Column(name = "pacientes_eliminar")
    private Boolean pacientesEliminar = false;

    @Column(name = "pasantes")
    private Boolean pasantes = false;
    @Column(name = "pasantes_crear")
    private Boolean pasantesCrear = false;
    @Column(name = "pasantes_editar")
    private Boolean pasantesEditar = false;
    @Column(name = "pasantes_eliminar")
    private Boolean pasantesEliminar = false;

    @Column(name = "sedes")
    private Boolean sedes = false;
    @Column(name = "sedes_crear")
    private Boolean sedesCrear = false;
    @Column(name = "sedes_editar")
    private Boolean sedesEditar = false;
    @Column(name = "sedes_eliminar")
    private Boolean sedesEliminar = false;

    @Column(name = "especialistas")
    private Boolean especialistas = false;
    @Column(name = "especialistas_crear")
    private Boolean especialistasCrear = false;
    @Column(name = "especialistas_editar")
    private Boolean especialistasEditar = false;
    @Column(name = "especialistas_eliminar")
    private Boolean especialistasEliminar = false;

    @Column(name = "especialidades")
    private Boolean especialidades = false;
    @Column(name = "especialidades_crear")
    private Boolean especialidadesCrear = false;
    @Column(name = "especialidades_editar")
    private Boolean especialidadesEditar = false;
    @Column(name = "especialidades_eliminar")
    private Boolean especialidadesEliminar = false;

    @Column(name = "asignaciones")
    private Boolean asignaciones = false;
    @Column(name = "asignaciones_crear")
    private Boolean asignacionesCrear = false;
    @Column(name = "asignaciones_editar")
    private Boolean asignacionesEditar = false;
    @Column(name = "asignaciones_eliminar")
    private Boolean asignacionesEliminar = false;

    @Column(name = "recursos")
    private Boolean recursos = false;
    @Column(name = "recursos_crear")
    private Boolean recursosCrear = false;
    @Column(name = "recursos_editar")
    private Boolean recursosEditar = false;
    @Column(name = "recursos_eliminar")
    private Boolean recursosEliminar = false;

    @Column(name = "instituciones_educativas")
    private Boolean institucionesEducativas = false;
    @Column(name = "instituciones_educativas_crear")
    private Boolean institucionesEducativasCrear = false;
    @Column(name = "instituciones_educativas_editar")
    private Boolean institucionesEducativasEditar = false;
    @Column(name = "instituciones_educativas_eliminar")
    private Boolean institucionesEducativasEliminar = false;

    @Column(name = "historia_clinica")
    private Boolean historiaClinica = false;
    @Column(name = "historia_clinica_crear")
    private Boolean historiaClinicaCrear = false;
    @Column(name = "historia_clinica_editar")
    private Boolean historiaClinicaEditar = false;
    @Column(name = "historia_clinica_eliminar")
    private Boolean historiaClinicaEliminar = false;

    @Column(name = "fonoaudiologia")
    private Boolean fonoAudiologia = false;
    @Column(name = "fonoaudiologia_crear")
    private Boolean fonoAudiologiaCrear = false;
    @Column(name = "fonoaudiologia_editar")
    private Boolean fonoAudiologiaEditar = false;
    @Column(name = "fonoaudiologia_eliminar")
    private Boolean fonoAudiologiaEliminar = false;

    @Column(name = "psicologia_clinica")
    private Boolean psicologiaClinica = false;
    @Column(name = "psicologia_clinica_crear")
    private Boolean psicologiaClinicaCrear = false;
    @Column(name = "psicologia_clinica_editar")
    private Boolean psicologiaClinicaEditar = false;
    @Column(name = "psicologia_clinica_eliminar")
    private Boolean psicologiaClinicaEliminar = false;

    @Column(name = "psicologia_educativa")
    private Boolean psicologiaEducativa = false;
    @Column(name = "psicologia_educativa_crear")
    private Boolean psicologiaEducativaCrear = false;
    @Column(name = "psicologia_educativa_editar")
    private Boolean psicologiaEducativaEditar = false;
    @Column(name = "psicologia_educativa_eliminar")
    private Boolean psicologiaEducativaEliminar = false;

    @Column(name = "citas")
    private Boolean citas = false;
    @Column(name = "citas_crear")
    private Boolean citasCrear = false;
    @Column(name = "citas_editar")
    private Boolean citasEditar = false;
    @Column(name = "citas_eliminar")
    private Boolean citasEliminar = false;

    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Pacientes
        if (Boolean.TRUE.equals(this.pacientes)) authorities.add(new SimpleGrantedAuthority("PERM_PACIENTES"));
        if (Boolean.TRUE.equals(this.pacientesCrear)) authorities.add(new SimpleGrantedAuthority("PERM_PACIENTES_CREAR"));
        if (Boolean.TRUE.equals(this.pacientesEditar)) authorities.add(new SimpleGrantedAuthority("PERM_PACIENTES_EDITAR"));
        if (Boolean.TRUE.equals(this.pacientesEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_PACIENTES_ELIMINAR"));

        // Citas
        if (Boolean.TRUE.equals(this.citas)) authorities.add(new SimpleGrantedAuthority("PERM_CITAS"));
        if (Boolean.TRUE.equals(this.citasCrear)) authorities.add(new SimpleGrantedAuthority("PERM_CITAS_CREAR"));
        if (Boolean.TRUE.equals(this.citasEditar)) authorities.add(new SimpleGrantedAuthority("PERM_CITAS_EDITAR"));
        if (Boolean.TRUE.equals(this.citasEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_CITAS_ELIMINAR"));

        // Pasantes
        if (Boolean.TRUE.equals(this.pasantes)) authorities.add(new SimpleGrantedAuthority("PERM_PASANTES"));
        if (Boolean.TRUE.equals(this.pasantesCrear)) authorities.add(new SimpleGrantedAuthority("PERM_PASANTES_CREAR"));
        if (Boolean.TRUE.equals(this.pasantesEditar)) authorities.add(new SimpleGrantedAuthority("PERM_PASANTES_EDITAR"));
        if (Boolean.TRUE.equals(this.pasantesEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_PASANTES_ELIMINAR"));

        // Sedes
        if (Boolean.TRUE.equals(this.sedes)) authorities.add(new SimpleGrantedAuthority("PERM_SEDES"));
        if (Boolean.TRUE.equals(this.sedesCrear)) authorities.add(new SimpleGrantedAuthority("PERM_SEDES_CREAR"));
        if (Boolean.TRUE.equals(this.sedesEditar)) authorities.add(new SimpleGrantedAuthority("PERM_SEDES_EDITAR"));
        if (Boolean.TRUE.equals(this.sedesEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_SEDES_ELIMINAR"));

        // Especialistas
        if (Boolean.TRUE.equals(this.especialistas)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALISTAS"));
        if (Boolean.TRUE.equals(this.especialistasCrear)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALISTAS_CREAR"));
        if (Boolean.TRUE.equals(this.especialistasEditar)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALISTAS_EDITAR"));
        if (Boolean.TRUE.equals(this.especialistasEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALISTAS_ELIMINAR"));

        // Especialidades
        if (Boolean.TRUE.equals(this.especialidades)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALIDADES"));
        if (Boolean.TRUE.equals(this.especialidadesCrear)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALIDADES_CREAR"));
        if (Boolean.TRUE.equals(this.especialidadesEditar)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALIDADES_EDITAR"));
        if (Boolean.TRUE.equals(this.especialidadesEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALIDADES_ELIMINAR"));

        // Asignaciones
        if (Boolean.TRUE.equals(this.asignaciones)) authorities.add(new SimpleGrantedAuthority("PERM_ASIGNACIONES"));
        if (Boolean.TRUE.equals(this.asignacionesCrear)) authorities.add(new SimpleGrantedAuthority("PERM_ASIGNACIONES_CREAR"));
        if (Boolean.TRUE.equals(this.asignacionesEditar)) authorities.add(new SimpleGrantedAuthority("PERM_ASIGNACIONES_EDITAR"));
        if (Boolean.TRUE.equals(this.asignacionesEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_ASIGNACIONES_ELIMINAR"));

        // Recursos
        if (Boolean.TRUE.equals(this.recursos)) authorities.add(new SimpleGrantedAuthority("PERM_RECURSOS"));
        if (Boolean.TRUE.equals(this.recursosCrear)) authorities.add(new SimpleGrantedAuthority("PERM_RECURSOS_CREAR"));
        if (Boolean.TRUE.equals(this.recursosEditar)) authorities.add(new SimpleGrantedAuthority("PERM_RECURSOS_EDITAR"));
        if (Boolean.TRUE.equals(this.recursosEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_RECURSOS_ELIMINAR"));

        // Instituciones
        if (Boolean.TRUE.equals(this.institucionesEducativas)) authorities.add(new SimpleGrantedAuthority("PERM_INSTITUCIONES_EDUCATIVAS"));
        if (Boolean.TRUE.equals(this.institucionesEducativasCrear)) authorities.add(new SimpleGrantedAuthority("PERM_INSTITUCIONES_EDUCATIVAS_CREAR"));
        if (Boolean.TRUE.equals(this.institucionesEducativasEditar)) authorities.add(new SimpleGrantedAuthority("PERM_INSTITUCIONES_EDUCATIVAS_EDITAR"));
        if (Boolean.TRUE.equals(this.institucionesEducativasEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_INSTITUCIONES_EDUCATIVAS_ELIMINAR"));

        // Historia Clinica
        if (Boolean.TRUE.equals(this.historiaClinica)) authorities.add(new SimpleGrantedAuthority("PERM_HISTORIA_CLINICA"));
        if (Boolean.TRUE.equals(this.historiaClinicaCrear)) authorities.add(new SimpleGrantedAuthority("PERM_HISTORIA_CLINICA_CREAR"));
        if (Boolean.TRUE.equals(this.historiaClinicaEditar)) authorities.add(new SimpleGrantedAuthority("PERM_HISTORIA_CLINICA_EDITAR"));
        if (Boolean.TRUE.equals(this.historiaClinicaEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_HISTORIA_CLINICA_ELIMINAR"));

        // Fonoaudiologia
        if (Boolean.TRUE.equals(this.fonoAudiologia)) authorities.add(new SimpleGrantedAuthority("PERM_FONOAUDIOLOGIA"));
        if (Boolean.TRUE.equals(this.fonoAudiologiaCrear)) authorities.add(new SimpleGrantedAuthority("PERM_FONOAUDIOLOGIA_CREAR"));
        if (Boolean.TRUE.equals(this.fonoAudiologiaEditar)) authorities.add(new SimpleGrantedAuthority("PERM_FONOAUDIOLOGIA_EDITAR"));
        if (Boolean.TRUE.equals(this.fonoAudiologiaEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_FONOAUDIOLOGIA_ELIMINAR"));

        // Psicologia Clinica
        if (Boolean.TRUE.equals(this.psicologiaClinica)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_CLINICA"));
        if (Boolean.TRUE.equals(this.psicologiaClinicaCrear)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_CLINICA_CREAR"));
        if (Boolean.TRUE.equals(this.psicologiaClinicaEditar)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_CLINICA_EDITAR"));
        if (Boolean.TRUE.equals(this.psicologiaClinicaEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_CLINICA_ELIMINAR"));

        // Psicologia Educativa
        if (Boolean.TRUE.equals(this.psicologiaEducativa)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_EDUCATIVA"));
        if (Boolean.TRUE.equals(this.psicologiaEducativaCrear)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_EDUCATIVA_CREAR"));
        if (Boolean.TRUE.equals(this.psicologiaEducativaEditar)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_EDUCATIVA_EDITAR"));
        if (Boolean.TRUE.equals(this.psicologiaEducativaEliminar)) authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_EDUCATIVA_ELIMINAR"));

        return authorities;
    }

    public void updateFrom(Permisos other) {
        if (other == null) return;
        
        this.pacientes = other.pacientes;
        this.pacientesCrear = other.pacientesCrear;
        this.pacientesEditar = other.pacientesEditar;
        this.pacientesEliminar = other.pacientesEliminar;

        this.pasantes = other.pasantes;
        this.pasantesCrear = other.pasantesCrear;
        this.pasantesEditar = other.pasantesEditar;
        this.pasantesEliminar = other.pasantesEliminar;

        this.sedes = other.sedes;
        this.sedesCrear = other.sedesCrear;
        this.sedesEditar = other.sedesEditar;
        this.sedesEliminar = other.sedesEliminar;

        this.especialistas = other.especialistas;
        this.especialistasCrear = other.especialistasCrear;
        this.especialistasEditar = other.especialistasEditar;
        this.especialistasEliminar = other.especialistasEliminar;

        this.especialidades = other.especialidades;
        this.especialidadesCrear = other.especialidadesCrear;
        this.especialidadesEditar = other.especialidadesEditar;
        this.especialidadesEliminar = other.especialidadesEliminar;

        this.asignaciones = other.asignaciones;
        this.asignacionesCrear = other.asignacionesCrear;
        this.asignacionesEditar = other.asignacionesEditar;
        this.asignacionesEliminar = other.asignacionesEliminar;

        this.recursos = other.recursos;
        this.recursosCrear = other.recursosCrear;
        this.recursosEditar = other.recursosEditar;
        this.recursosEliminar = other.recursosEliminar;

        this.institucionesEducativas = other.institucionesEducativas;
        this.institucionesEducativasCrear = other.institucionesEducativasCrear;
        this.institucionesEducativasEditar = other.institucionesEducativasEditar;
        this.institucionesEducativasEliminar = other.institucionesEducativasEliminar;

        this.historiaClinica = other.historiaClinica;
        this.historiaClinicaCrear = other.historiaClinicaCrear;
        this.historiaClinicaEditar = other.historiaClinicaEditar;
        this.historiaClinicaEliminar = other.historiaClinicaEliminar;

        this.fonoAudiologia = other.fonoAudiologia;
        this.fonoAudiologiaCrear = other.fonoAudiologiaCrear;
        this.fonoAudiologiaEditar = other.fonoAudiologiaEditar;
        this.fonoAudiologiaEliminar = other.fonoAudiologiaEliminar;

        this.psicologiaClinica = other.psicologiaClinica;
        this.psicologiaClinicaCrear = other.psicologiaClinicaCrear;
        this.psicologiaClinicaEditar = other.psicologiaClinicaEditar;
        this.psicologiaClinicaEliminar = other.psicologiaClinicaEliminar;

        this.psicologiaEducativa = other.psicologiaEducativa;
        this.psicologiaEducativaCrear = other.psicologiaEducativaCrear;
        this.psicologiaEducativaEditar = other.psicologiaEducativaEditar;
        this.psicologiaEducativaEliminar = other.psicologiaEducativaEliminar;
        this.psicologiaEducativaEliminar = other.psicologiaEducativaEliminar;

        this.citas = other.citas;
        this.citasCrear = other.citasCrear;
        this.citasEditar = other.citasEditar;
        this.citasEliminar = other.citasEliminar;
    }
}
