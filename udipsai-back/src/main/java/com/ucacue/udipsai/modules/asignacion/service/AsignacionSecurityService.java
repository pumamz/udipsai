package com.ucacue.udipsai.modules.asignacion.service;

import com.ucacue.udipsai.modules.asignacion.repository.AsignacionRepository;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("asignacionSecurity")
@Slf4j
public class AsignacionSecurityService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    public boolean checkPasanteAcceso(Integer pacienteId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        boolean isPasante = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PASANTE"));

        if (!isPasante) {
            return true;
        }

        String cedula = authentication.getName();
        Optional<Pasante> pasante = pasanteRepository.findByCedula(cedula);

        if (pasante.isEmpty()) {
            log.warn("Access denied: Pasante not found for cedula {}", cedula);
            return false;
        }

        boolean hasAssignment = asignacionRepository.existsByPasanteIdAndPacienteIdAndActivoTrue(pasante.get().getId(),
                pacienteId);

        if (!hasAssignment) {
            log.warn("Access denied: Pasante {} does not have assignment for Paciente {}", cedula, pacienteId);
        }

        return hasAssignment;
    }
}
