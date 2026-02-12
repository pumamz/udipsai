package com.ucacue.udipsai.modules.especialistas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspecialistaCriteriaDTO {
    private String search;
    private Integer especialidadId;
    private Integer sedeId;
    private Boolean activo;
}
