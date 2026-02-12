package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class EvaluacionAfectiva {

    @Column(name = "alta_sensibilidad")
    private Boolean altaSensibilidad;

    @Column(name = "agresividad_afectividad")
    private Boolean agresividadAfectividad;

    @Column(name = "sumision")
    private Boolean sumision;

    @Column(name = "rabietas")
    private Boolean rabietas;

    @Column(name = "solidaridad")
    private Boolean solidaridad;

    @Column(name = "generosidad")
    private Boolean generosidad;

    @Column(name = "afectuoso")
    private Boolean afectuoso;

    @Column(name = "angustia")
    private Boolean angustia;

    @Column(name = "ansiedad_situacional")
    private Boolean ansiedadSituacional;

    @Column(name = "timidez")
    private Boolean timidez;

    @Column(name = "ansiedad_expectante")
    private Boolean ansiedadExpectante;

    @Column(name = "depresion")
    private Boolean depresion;

    @Column(name = "perdida_reciente_de_interes")
    private Boolean perdidaRecienteDeInteres;

    @Column(name = "desesperacion")
    private Boolean desesperacion;

    @Column(name = "euforia")
    private Boolean euforia;

    @Column(name = "indiferencia")
    private Boolean indiferencia;

    @Column(name = "aplanamiento")
    private Boolean aplanamiento;

    @Column(name = "ambivalencia")
    private Boolean ambivalencia;

    @Column(name = "irritabilidad_afectividad")
    private Boolean irritabilidadAfectividad;

    @Column(name = "labilidad")
    private Boolean labilidad;

    @Column(name = "tenacidad")
    private Boolean tenacidad;

    @Column(name = "incontinencia")
    private Boolean incontinencia;

    @Column(name = "sentimientos_inadecuados")
    private Boolean sentimientosInadecuados;

    @Column(name = "neotimia")
    private Boolean neotimia;

    @Column(name = "disociacion_ideo_afectiva")
    private Boolean disociacionIdeoAfectiva;

    @Column(name = "anhedonia")
    private Boolean anhedonia;
}
