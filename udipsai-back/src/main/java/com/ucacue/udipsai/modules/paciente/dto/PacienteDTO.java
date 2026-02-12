package com.ucacue.udipsai.modules.paciente.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ucacue.udipsai.modules.documentos.dto.DocumentoDTO;
import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaDTO;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Integer id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaApertura;

    private Boolean activo;
    private String nombresApellidos;
    private String ciudad;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaNacimiento;

    private int edad;
    private String cedula;
    private String domicilio;

    private String fotoUrl;

    private String numeroTelefono;
    private String numeroCelular;
    
    private InstitucionEducativaDTO institucionEducativa;
    private SedeDTO sede;
    
    private String proyecto;
    private String jornada;
    
    private String nivelEducativo;
    private String anioEducacion;
    
    private Boolean perteneceInclusion;
    private Boolean tieneDiscapacidad;
    private Boolean portadorCarnet;
    private Boolean perteneceAProyecto;
    
    private String diagnostico;
    private String motivoConsulta;
    private String observaciones;
    private String tipoDiscapacidad;
    private String detalleDiscapacidad;
    private Integer porcentajeDiscapacidad;
    
    private List<DocumentoDTO> documentos;
}
