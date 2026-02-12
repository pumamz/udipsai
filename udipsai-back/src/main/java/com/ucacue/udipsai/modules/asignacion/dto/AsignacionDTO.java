package com.ucacue.udipsai.modules.asignacion.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteAsignacionDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteAsignacionDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AsignacionDTO {
    private Long id;
    private PacienteAsignacionDTO paciente;
    private PasanteAsignacionDTO pasante;
    private Boolean activo;
}
