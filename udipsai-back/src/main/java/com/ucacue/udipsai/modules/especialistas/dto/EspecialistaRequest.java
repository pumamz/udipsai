package com.ucacue.udipsai.modules.especialistas.dto;

import com.ucacue.udipsai.modules.permisos.Permisos;
import lombok.Data;

@Data
public class EspecialistaRequest {
    private String cedula;
    private String nombresApellidos;
    private String contrasenia;
    private Integer especialidadId;
    private Integer sedeId;
    private Boolean activo;
    private Permisos permisos;
}
