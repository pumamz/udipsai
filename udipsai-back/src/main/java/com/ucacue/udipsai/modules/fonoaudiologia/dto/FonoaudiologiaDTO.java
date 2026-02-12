package com.ucacue.udipsai.modules.fonoaudiologia.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.domain.components.*;
import lombok.Data;

@Data
public class FonoaudiologiaDTO {
    private Integer id;
    private PacienteFichaDTO paciente;
    private Boolean activo;
    
    private Habla habla;
    private Audicion audicion;
    private Fonacion fonacion;
    private HistoriaAuditiva historiaAuditiva;
    private Vestibular vestibular;
    private Otoscopia otoscopia;
}
