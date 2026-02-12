package com.ucacue.udipsai.modules.sedes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SedeDTO {
    private Integer id;
    private String nombre;
}
