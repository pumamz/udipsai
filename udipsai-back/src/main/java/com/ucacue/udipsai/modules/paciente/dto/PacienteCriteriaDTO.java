package com.ucacue.udipsai.modules.paciente.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteCriteriaDTO {
    private String search;
    private String ciudad;
    private Boolean activo;
    private Integer sedeId;
    private Integer institucionEducativaId;
}
