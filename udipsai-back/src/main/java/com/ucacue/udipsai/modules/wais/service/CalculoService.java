package com.ucacue.udipsai.modules.wais.service;

import com.ucacue.udipsai.modules.wais.dto.CalculationRequest;
import com.ucacue.udipsai.modules.wais.dto.CalculationResponse;
import com.ucacue.udipsai.modules.wais.domain.*;
import com.ucacue.udipsai.modules.wais.repository.*;
import com.ucacue.udipsai.modules.wais.repository.WaisIndexNormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalculoService {

    private final NormasService normasService;
    private final WaisIndexCompositionRepository compositionRepository;

    // Unified Index Repository
    private final WaisIndexNormRepository indexNormRepository;

    public CalculationResponse calcular(CalculationRequest request) {
        Integer ageMonths = request.getEdadCronologica();
        Map<String, Integer> rawScores = request.getSubtestsCrudos();

        // 1. Calculate Scaled Scores
        Map<String, CalculationResponse.SubtestData> subtestResults = new HashMap<>();
        Map<String, Integer> scaledScoresMap = new HashMap<>(); // Code -> Scaled

        for (Map.Entry<String, Integer> entry : rawScores.entrySet()) {
            String code = entry.getKey();
            Integer raw = entry.getValue();

            Integer scaled = normasService.getScaledScore(ageMonths, code, raw);

            CalculationResponse.SubtestData.SubtestDataBuilder builder = CalculationResponse.SubtestData.builder()
                    .raw(raw)
                    .scaled(scaled);

            if (scaled == null) {
                builder.error("ajuste pendiente (not norm found)");
            } else {
                scaledScoresMap.put(code, scaled);
            }
            subtestResults.put(code, builder.build());
        }

        // 2. Calculate Sums
        Map<String, Integer> sumasEscalas = new HashMap<>();
        // Define indices to calculate
        String[] indices = { "CIT", "ICV", "IMT", "IRP", "IVP" };

        for (String indexCode : indices) {
            List<WaisIndexComposition> composition = compositionRepository.findByIndexCode(indexCode);
            int sum = 0;
            // boolean missingSubtest = false;

            for (WaisIndexComposition comp : composition) {
                String subtestCode = comp.getSubtest().getCode();
                if (scaledScoresMap.containsKey(subtestCode)) {
                    sum += scaledScoresMap.get(subtestCode);
                } else {
                    // missingSubtest = true;
                    // In a real logic we might handle optional subtests or prorating here
                }
            }
            sumasEscalas.put(indexCode, sum);
        }

        // 3. Lookup Index Results
        Map<String, CalculationResponse.IndexData> resultadosIndices = new HashMap<>();

        resultadosIndices.put("cit", lookupIndex("CIT", sumasEscalas.get("CIT")));
        resultadosIndices.put("icv", lookupIndex("ICV", sumasEscalas.get("ICV")));
        resultadosIndices.put("imt", lookupIndex("IMT", sumasEscalas.get("IMT")));
        resultadosIndices.put("irp", lookupIndex("IRP", sumasEscalas.get("IRP")));
        resultadosIndices.put("ivp", lookupIndex("IVP", sumasEscalas.get("IVP")));

        // 4. Build Response
        return CalculationResponse.builder()
                .metadata(CalculationResponse.Metadata.builder()
                        .timestamp(Instant.now().toString())
                        .edadCronologica(ageMonths)
                        .normalizacion("WAIS-IV")
                        .build())
                .subtests(subtestResults)
                .sumasEscalas(sumasEscalas)
                .resultados(resultadosIndices)
                .build();
    }

    private CalculationResponse.IndexData lookupIndex(String type, Integer sum) {
        if (sum == null)
            return null;

        java.util.Optional<WaisIndexNorm> opt = indexNormRepository.findFirstByTypeAndSumScaled(type, sum);
        // System.out.println("DEBUG Service Repo Hash: " +
        // System.identityHashCode(indexNormRepository));
        // System.out.println("DEBUG Service Lookup " + type + " Sum " + sum + " Found:
        // " + opt.isPresent());

        return opt.map(r -> CalculationResponse.IndexData.builder()
                .indice(r.getValue()) // Assuming 'value' stores the CIT/ICV score
                .percentile(r.getPercentile())
                .ic90(r.getIc90())
                .ic95(r.getIc95())
                .build())
                .orElse(null);
    }
}
