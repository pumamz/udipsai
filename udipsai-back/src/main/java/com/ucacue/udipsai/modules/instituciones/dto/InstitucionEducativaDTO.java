package com.ucacue.udipsai.modules.instituciones.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitucionEducativaDTO {
    private Integer id;
    private String nombre;
}
