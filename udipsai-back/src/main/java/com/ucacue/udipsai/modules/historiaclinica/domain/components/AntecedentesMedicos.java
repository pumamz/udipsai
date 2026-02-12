package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class AntecedentesMedicos {

    @Column(name = "enfermedades_con_tratamiento", columnDefinition = "TEXT")
    private String enfermedadesConTratamiento;

    @Column(name = "alergias", columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "intervenciones_quirurgicas", columnDefinition = "TEXT")
    private String intervencionesQuirurgicas;

    @Column(name = "medicamentos_consumo", columnDefinition = "TEXT")
    private String medicamentosRequeridosOConsumo;

    @Column(name = "enfermedades_familiares", columnDefinition = "TEXT")
    private String enfermedadesDiscapacidadesFamiliares;

    @Column(name = "trastornos_psicologicos_familiares", columnDefinition = "TEXT")
    private String trastornosPsicologicosFamiliares;

    @Column(name = "problemas_aprendizaje_familiares", columnDefinition = "TEXT")
    private String problemasAprendizajeFamiliares;
}
