package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Diagnostico {

    @Column(name = "impresion_diagnostica", columnDefinition = "TEXT")
    private String impresionDiagnostica;

    @Column(name = "derivacion_interconsulta", columnDefinition = "TEXT")
    private String derivacionInterconsulta;

    @Column(name = "objetivo_plan_tratamiento_individual", columnDefinition = "TEXT")
    private String objetivoPlanTratamientoIndividual;

    @Column(name = "estrategia_de_intervencion", columnDefinition = "TEXT")
    private String estrategiaDeIntervencion;

    @Column(name = "indicador_de_logro", columnDefinition = "TEXT")
    private String indicadorDeLogro;

    @Column(name = "tiempo_estimado")
    private String tiempoEstimado;

    @Column(name = "evaluacion", columnDefinition = "TEXT")
    private String evaluacion;
}
