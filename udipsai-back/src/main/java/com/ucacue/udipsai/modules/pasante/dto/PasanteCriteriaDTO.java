package com.ucacue.udipsai.modules.pasante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasanteCriteriaDTO {
    private String search;
    private String ciudad;
    private Boolean activo;
    private Integer especialidadId;
    private Integer especialistaId;
    private Integer sedeId;
}
