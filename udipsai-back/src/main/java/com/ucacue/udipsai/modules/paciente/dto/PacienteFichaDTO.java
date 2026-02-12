package com.ucacue.udipsai.modules.paciente.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteFichaDTO {
    private Integer id;
    private String nombresApellidos;
    private String cedula;
}
