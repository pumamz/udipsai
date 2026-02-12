package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Suenio {

    @Column(name = "inicio_horario_de_suenio")
    private Integer inicioHorarioDeSuenio;

    @Column(name = "fin_horario_de_suenio")
    private Integer finHorarioDeSuenio;

    @Column(name = "tipo_horario_de_suenio")
    private String tipoHorarioDeSuenio;

    @Column(name = "compania_suenio")
    private String companiaSuenio;

    @Column(name = "especificar_compania_suenio")
    private String especificarCompaniaSuenio;

    @Column(name = "edad")
    private String edad;

    @Column(name = "hipersomnia")
    private Boolean hipersomnia;

    @Column(name = "dificultad_de_conciliar_el_suenio")
    private Boolean dificultadDeConciliarElSuenio;

    @Column(name = "despertar_frecuente")
    private Boolean despertarFrecuente;

    @Column(name = "despertar_prematuro")
    private Boolean despertarPrematuro;

    @Column(name = "sonambulismo")
    private Boolean sonambulismo;

    @Column(name = "observaciones_habitos_de_suenio", columnDefinition = "TEXT")
    private String observacionesHabitosDeSuenio;
}
