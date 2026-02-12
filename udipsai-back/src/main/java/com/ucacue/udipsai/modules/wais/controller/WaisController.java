package com.ucacue.udipsai.modules.wais.controller;

import com.ucacue.udipsai.modules.wais.dto.CalculationRequest;
import com.ucacue.udipsai.modules.wais.dto.CalculationResponse;
import com.ucacue.udipsai.modules.wais.service.CalculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wais")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend requests
public class WaisController {

    private final CalculoService calculoService;

    @PostMapping("/calcular-crudo")
    public ResponseEntity<CalculationResponse> calcularCrudo(@RequestBody CalculationRequest request) {
        CalculationResponse response = calculoService.calcular(request);
        return ResponseEntity.ok(response);
    }
}
