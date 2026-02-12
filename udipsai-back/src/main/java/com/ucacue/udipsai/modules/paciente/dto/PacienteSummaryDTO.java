package com.ucacue.udipsai.modules.paciente.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteSummaryDTO {
    private Integer totalFichas;
    private Map<String, Integer> fichas;
}
