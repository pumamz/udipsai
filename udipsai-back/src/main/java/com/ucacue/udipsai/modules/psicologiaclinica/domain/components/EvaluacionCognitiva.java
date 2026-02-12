package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class EvaluacionCognitiva {

    @Column(name = "observaciones_guia_de_observacion", columnDefinition = "TEXT")
    private String observacionesGuiaDeObservacion;

    // Conciencia
    @Column(name = "lucidez")
    private Boolean lucidez;

    @Column(name = "obnubilacion")
    private Boolean obnubilacion;

    @Column(name = "estupor")
    private Boolean estupor;

    @Column(name = "coma")
    private Boolean coma;

    @Column(name = "hipervigilancia")
    private Boolean hipervigilancia;

    @Column(name = "confusion")
    private Boolean confusion;

    @Column(name = "estado_crepuscular")
    private Boolean estadoCrepuscular;

    @Column(name = "onirismo")
    private Boolean onirismo;

    @Column(name = "sonambulismo_estado_de_conciencia")
    private Boolean sonambulismoEstadoDeConciencia;

    // Atencion
    @Column(name = "hipercepcion")
    private Boolean hipercepcion;

    @Column(name = "hipoprosexia")
    private Boolean hipoprosexia;

    @Column(name = "disprosexia")
    private Boolean disprosexia;

    @Column(name = "distraibilidad")
    private Boolean distraibilidad;

    @Column(name = "sin_alteracion")
    private Boolean sinAlteracion;

    // Sensopercepcion
    @Column(name = "hipercepcion_sensopercepcion")
    private Boolean hipercepcionSensopercepcion;

    @Column(name = "ilusiones")
    private Boolean ilusiones;

    @Column(name = "seudoalucionciones")
    private Boolean seudoalucionciones;

    @Column(name = "alusinosis")
    private Boolean alusinosis;

    @Column(name = "macropsias")
    private Boolean macropsias;

    @Column(name = "micropsias")
    private Boolean micropsias;

    @Column(name = "no_presenta")
    private Boolean noPresenta;

    @Column(name = "alucinaiones")
    private Boolean alucinaiones;

    // Memoria
    @Column(name = "hipermnecia")
    private Boolean hipermnecia;

    @Column(name = "amnesia_de_fijacion")
    private Boolean amnesiaDeFijacion;

    @Column(name = "amnesia_de_evocacion")
    private Boolean amnesiaDeEvocacion;

    @Column(name = "mixta")
    private Boolean mixta;

    @Column(name = "lacunar")
    private Boolean lacunar;

    @Column(name = "dismensia")
    private Boolean dismensia;

    @Column(name = "paramnesias")
    private Boolean paramnesias;

    @Column(name = "sin_alteracion_memoria")
    private Boolean sinAlteracionMemoria;

    // Orientacion
    @Column(name = "desorientacion_en_tiempo")
    private String desorientacionEnTiempo;

    @Column(name = "espacio")
    private String espacio;

    @Column(name = "respecto_a_si_mismo")
    private String respectoASiMismo;

    @Column(name = "respecto_a_otras_personas")
    private String respectoAOtrasPersonas;
}
