package com.ucacue.udipsai.modules.psicologiaeducativa.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.domain.components.*;
import lombok.Data;

@Data
public class PsicologiaEducativaDTO {
    private Integer id;
    private PacienteFichaDTO paciente;
    private Boolean activo;
    
    private HistoriaEscolar historiaEscolar;
    private Desarrollo desarrollo;
    private Adaptacion adaptacion;
    private EstadoGeneral estadoGeneral;
}
