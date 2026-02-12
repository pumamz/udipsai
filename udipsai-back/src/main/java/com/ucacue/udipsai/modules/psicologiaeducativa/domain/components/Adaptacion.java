package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Adaptacion {

    @Column(name = "inclusion_educativa")
    private Boolean inclusionEducativa;

    @Column(name = "causa_inclusion_educativa")
    private String causaInclusionEducativa;

    @Column(name = "adaptaciones_curriculares")
    private Boolean adaptacionesCurriculares;

    @Column(name = "grado_adaptacion")
    private String gradoAdaptacion;

    @Column(name = "especifique_asignaturas")
    private String especifiqueAsignaturas;

    @Column(name = "evaluacion_psicologica_u_otros_anterior")
    private Boolean evaluacionPsicologicaUOtrosAnterior;

    @Column(name = "causa_evaluacion_psicologica_u_otros_anterior", columnDefinition = "TEXT")
    private String causaEvaluacionPsicologicaUOtrosAnterior;

    @Column(name = "recibe_apoyo")
    private Boolean recibeApoyo;

    @Column(name = "causa_lugar_tiempo_recibe_apoyo")
    private String causaLugarTiempoRecibeApoyo;
}
