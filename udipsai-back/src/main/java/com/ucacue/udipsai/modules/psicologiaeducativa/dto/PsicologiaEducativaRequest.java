package com.ucacue.udipsai.modules.psicologiaeducativa.dto;

import com.ucacue.udipsai.modules.psicologiaeducativa.domain.components.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PsicologiaEducativaRequest {
    private Integer pacienteId;
    private Boolean activo;
    private HistoriaEscolar historiaEscolar;
    private Desarrollo desarrollo;
    private Adaptacion adaptacion;
    private EstadoGeneral estadoGeneral;
}
