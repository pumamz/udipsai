package com.ucacue.udipsai.modules.paciente.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteAsignacionDTO {
    private Integer id;
    private String nombresApellidos;
    private String cedula;
}
