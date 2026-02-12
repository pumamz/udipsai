package com.ucacue.udipsai.modules.wais;

import com.ucacue.udipsai.modules.wais.domain.WaisIndexNorm;
import com.ucacue.udipsai.modules.wais.dto.CalculationRequest;
import com.ucacue.udipsai.modules.wais.dto.CalculationResponse;
import com.ucacue.udipsai.modules.wais.repository.WaisIndexNormRepository;
import com.ucacue.udipsai.modules.wais.service.CalculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

import java.util.HashMap;
import java.util.Map;

// @Component
@RequiredArgsConstructor
@org.springframework.core.annotation.Order(2)
public class VerifyCalculationRunner implements CommandLineRunner {

    private final CalculoService calculoService;

    private final WaisIndexNormRepository indexRepo;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DEBUG: WaisIndexNorm count: " + indexRepo.count());
        indexRepo.findAll().stream()
                .map(WaisIndexNorm::getType)
                .collect(java.util.stream.Collectors.groupingBy(java.util.function.Function.identity(),
                        java.util.stream.Collectors.counting()))
                .forEach((k, v) -> System.out.println("DEBUG Type " + k + ": " + v));

        System.out.println("DEBUG Runner Repo Hash: " + System.identityHashCode(indexRepo));
        System.out.println("DEBUG CHECK CIT 83: "
                + indexRepo.findFirstByTypeAndSumScaled("CIT", 83).map(Object::toString).orElse("Missing"));
        indexRepo.findAll().stream()
                .filter(n -> n.getType().equals("CIT") && n.getSumScaled() >= 80 && n.getSumScaled() <= 85)
                .forEach(n -> System.out.println("DEBUG CIT NEAR: " + n.getSumScaled()));

        System.out.println("=== VERIFYING CALCULATIONS FOR ALL AGE GROUPS (16-90) ===");

        // Define age groups to test (Min and Max)
        int[][] ageRanges = {
                { 16, 17 }, { 18, 19 }, { 20, 24 }, { 25, 34 }, { 35, 44 },
                { 45, 54 }, { 55, 69 }, { 70, 79 }, { 80, 84 }, { 85, 89 }
        };

        boolean allPassed = true;

        for (int[] range : ageRanges) {
            int startAge = range[0];
            int endAge = range[1];

            // Test Min Age (months)
            if (!testAge((startAge * 12),
                    "Edad " + startAge + "-" + endAge + " (Min Age: " + (startAge * 12) + " months)")) {
                allPassed = false;
            }
            // Test Max Age (months)
            if (!testAge((endAge * 12),
                    "Edad " + startAge + "-" + endAge + " (Max Age: " + (endAge * 12) + " months)")) {
                allPassed = false;
            }

            // Test a middle age if range is large
            if (range[1] > range[0]) {
                int mid = (startAge + endAge) / 2;
                if (!testAge((mid * 12), "Edad " + startAge + "-" + endAge + " (Mid Age: " + (mid * 12) + " months)")) {
                    allPassed = false;
                }
            }
        }

        // Specific Test for Age 33 (400 months)
        if (!testAge(400, "Specific Age 33 (400 months)")) {
            allPassed = false;
        }

        if (allPassed) {
            System.out.println("✅ VERIFICATION SUCCESSFUL: All Age Groups produced valid CITs.");
        } else {
            System.out.println("❌ VERIFICATION FAILED: Some Age Groups failed calculation.");
        }
        System.out.println("=== VERIFICATION END ===");
    }

    private boolean testAge(int ageMonths, String label) {
        System.out.print("Testing " + label + "... ");
        try {
            CalculationRequest req = new CalculationRequest();
            req.setEdadCronologica(ageMonths);
            Map<String, Integer> scores = new HashMap<>();
            // Standard raw scores that should always work if norms exist
            // Using middle-ish values
            scores.put("C", 20);
            scores.put("S", 25); // High range check
            scores.put("D", 20);
            scores.put("M", 15);
            scores.put("V", 30);
            scores.put("A", 18); // Check A=18 specifically
            scores.put("BS", 30);
            scores.put("PV", 15);
            scores.put("I", 15);
            scores.put("CN", 20); // Clave de Números
            req.setSubtestsCrudos(scores);

            CalculationResponse res = calculoService.calcular(req);

            boolean failed = false;
            StringBuilder errors = new StringBuilder();

            System.out.println("DEBUG Sums: " + res.getSumasEscalas());
            System.out.println("DEBUG Subtests: " + res.getSubtests());

            // Check Subtests
            for (Map.Entry<String, CalculationResponse.SubtestData> entry : res.getSubtests().entrySet()) {
                if (entry.getValue().getScaled() == null || entry.getValue().getError() != null) {
                    failed = true;
                    errors.append("[" + entry.getKey() + " Error: "
                            + (entry.getValue().getError() != null ? entry.getValue().getError() : "Null") + "] ");
                }
            }

            // Check Indices
            if (res.getResultados().get("cit") == null) {
                failed = true;
                errors.append("[CIT Null] ");
            }

            if (failed) {
                System.out.println("FAILED " + errors.toString());
                return false;
            } else {
                System.out.println("✅ OK (CIT: " + res.getResultados().get("cit").getIndice() + ")");
                return true;
            }

        } catch (Exception e) {
            System.out.println("CRASH " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
