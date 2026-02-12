package com.ucacue.udipsai.modules.citas.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReporteCitaRespuestaDTO {
    private String pacienteNombreCompleto;
    private List<ReporteCitaDTO> citas;
}
