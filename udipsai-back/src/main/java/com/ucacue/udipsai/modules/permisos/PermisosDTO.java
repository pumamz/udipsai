package com.ucacue.udipsai.modules.permisos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisosDTO {
    private Long id;
    
    private Boolean pacientes;
    private Boolean pacientesCrear;
    private Boolean pacientesEditar;
    private Boolean pacientesEliminar;

    private Boolean pasantes;
    private Boolean pasantesCrear;
    private Boolean pasantesEditar;
    private Boolean pasantesEliminar;

    private Boolean sedes;
    private Boolean sedesCrear;
    private Boolean sedesEditar;
    private Boolean sedesEliminar;

    private Boolean especialistas;
    private Boolean especialistasCrear;
    private Boolean especialistasEditar;
    private Boolean especialistasEliminar;

    private Boolean especialidades;
    private Boolean especialidadesCrear;
    private Boolean especialidadesEditar;
    private Boolean especialidadesEliminar;

    private Boolean asignaciones;
    private Boolean asignacionesCrear;
    private Boolean asignacionesEditar;
    private Boolean asignacionesEliminar;

    private Boolean recursos;
    private Boolean recursosCrear;
    private Boolean recursosEditar;
    private Boolean recursosEliminar;

    private Boolean institucionesEducativas;
    private Boolean institucionesEducativasCrear;
    private Boolean institucionesEducativasEditar;
    private Boolean institucionesEducativasEliminar;

    private Boolean historiaClinica;
    private Boolean historiaClinicaCrear;
    private Boolean historiaClinicaEditar;
    private Boolean historiaClinicaEliminar;

    private Boolean fonoAudiologia;
    private Boolean fonoAudiologiaCrear;
    private Boolean fonoAudiologiaEditar;
    private Boolean fonoAudiologiaEliminar;

    private Boolean psicologiaClinica;
    private Boolean psicologiaClinicaCrear;
    private Boolean psicologiaClinicaEditar;
    private Boolean psicologiaClinicaEliminar;

    private Boolean psicologiaEducativa;
    private Boolean psicologiaEducativaCrear;
    private Boolean psicologiaEducativaEditar;
    private Boolean psicologiaEducativaEliminar;
}
