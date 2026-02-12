package com.ucacue.udipsai.modules.pasante.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasanteAsignacionDTO {
    private Integer id;
    private String nombresApellidos;
    private String cedula;
}
