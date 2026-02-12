package com.ucacue.udipsai.modules.wais.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class CalculationResponse {

    private Metadata metadata;
    private Map<String, SubtestData> subtests;

    @JsonProperty("sumas_escalas")
    private Map<String, Integer> sumasEscalas;

    private Map<String, IndexData> resultados;

    @Data
    @Builder
    public static class Metadata {
        private String timestamp;
        @JsonProperty("edad_cronologica")
        private Integer edadCronologica;
        private String normalizacion;
    }

    @Data
    @Builder
    public static class SubtestData {
        private Integer raw;
        private Integer scaled;
        private String error;
    }

    @Data
    @Builder
    public static class IndexData {
        private Integer indice;
        private Integer percentile;
        private String ic90;
        private String ic95;
    }
}
