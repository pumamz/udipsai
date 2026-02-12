package com.ucacue.udipsai.modules.wais.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Map;

@Data
public class CalculationRequest {

    @JsonProperty("edad_cronologica")
    private Integer edadCronologica;

    @JsonProperty("subtests_crudos")
    private Map<String, Integer> subtestsCrudos;
}
