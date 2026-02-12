package com.ucacue.udipsai.modules.especialidad.dto;

import com.ucacue.udipsai.modules.permisos.PermisosDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadDTO {
    private Integer id;
    private String area;
    private PermisosDTO permisos;
}
