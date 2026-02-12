package com.ucacue.udipsai.modules.asignacion.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class AsignacionRequest {

    @NotEmpty(message = "Debe proporcionar al menos un paciente")
    private List<Integer> pacienteIds;

    @NotNull(message = "El ID del pasante es requerido")
    private Integer pasanteId;

    private Boolean activo;
}
