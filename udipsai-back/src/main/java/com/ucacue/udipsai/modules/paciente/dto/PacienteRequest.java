package com.ucacue.udipsai.modules.paciente.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteRequest {

    private String cedula;
    private String nombresApellidos;
    private LocalDate fechaNacimiento;
    private String ciudad;
    private String domicilio;
    private String numeroTelefono; 
    private String numeroCelular; 
    private Integer institucionEducativaId; 
    private Integer sedeId; 
    private String jornada;
    private String nivelEducativo;
    private String anioEducacion;
    private Boolean perteneceInclusion;
    private Boolean tieneDiscapacidad;
    private Boolean portadorCarnet;
    private Boolean perteneceAProyecto;
    private String proyecto;
    private String diagnostico;
    private String motivoConsulta;
    private String observaciones;
    private String tipoDiscapacidad;
    private String detalleDiscapacidad;
    private Integer porcentajeDiscapacidad;
    private Boolean activo; 
}

