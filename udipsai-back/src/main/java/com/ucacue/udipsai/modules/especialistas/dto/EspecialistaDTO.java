package com.ucacue.udipsai.modules.especialistas.dto;

import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.ucacue.udipsai.modules.permisos.Permisos;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspecialistaDTO {
    private Integer id;
    private String cedula;
    private String nombresApellidos;
    private String fotoUrl;
    private EspecialidadDTO especialidad;
    private SedeDTO sede;
    private Boolean activo;
    private Permisos permisos;
}
