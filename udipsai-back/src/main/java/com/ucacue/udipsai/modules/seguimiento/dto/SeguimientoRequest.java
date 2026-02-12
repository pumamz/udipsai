package com.ucacue.udipsai.modules.seguimiento.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SeguimientoRequest {
    private Integer especialistaId;
    private Integer pacienteId;
    private LocalDate fecha;
    private String observacion;
    private Boolean activo;
    private Integer documentoId;
}
