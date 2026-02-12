package com.ucacue.udipsai.modules.instituciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitucionEducativaCriteriaDTO {
    private String search;
    private Boolean activo;
}
