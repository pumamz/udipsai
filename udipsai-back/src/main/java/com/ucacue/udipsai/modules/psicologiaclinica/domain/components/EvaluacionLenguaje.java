package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class EvaluacionLenguaje {

    @Column(name = "palabras_raras")
    private Boolean palabrasRaras;

    @Column(name = "logico_y_claro")
    private Boolean logicoYClaro;

    @Column(name = "voz_monotona")
    private Boolean vozMonotona;

    @Column(name = "mal_hablado")
    private Boolean malHablado;

    @Column(name = "lento_y_teatral")
    private Boolean lentoYTeatral;

    @Column(name = "pesimista")
    private Boolean pesimista;

    @Column(name = "hiriente")
    private Boolean hiriente;

    @Column(name = "charlatan")
    private Boolean charlatan;

    @Column(name = "incoherente")
    private Boolean incoherente;

    @Column(name = "verborrea")
    private Boolean verborrea;

    @Column(name = "abatimiento")
    private Boolean abatimiento;

    @Column(name = "tension")
    private Boolean tension;

    @Column(name = "perplejidad")
    private Boolean perplejidad;

    @Column(name = "suspicacia")
    private Boolean suspicacia;

    @Column(name = "enfado")
    private Boolean enfado;

    @Column(name = "preocupacion")
    private Boolean preocupacion;

    @Column(name = "obscenidad")
    private Boolean obscenidad;

    @Column(name = "disartria")
    private Boolean disartria;

    @Column(name = "afasia_expresiva")
    private Boolean afasiaExpresiva;

    @Column(name = "afasia_receptiva")
    private Boolean afasiaReceptiva;

    @Column(name = "afasia_anomica")
    private Boolean afasiaAnomica;

    @Column(name = "afasia_global")
    private Boolean afasiaGlobal;

    @Column(name = "ecolalia")
    private Boolean ecolalia;

    @Column(name = "palilalia")
    private Boolean palilalia;

    @Column(name = "ensimismamiento")
    private Boolean ensimismamiento;

    @Column(name = "hay_que_guiarlo")
    private Boolean hayQueGuiarlo;

    @Column(name = "molestoso")
    private Boolean molestoso;

    @Column(name = "lento")
    private Boolean lento;

    @Column(name = "no_desea_hacer_nada")
    private Boolean noDeseaHacerNada;

    @Column(name = "hace_cosas_extranas")
    private Boolean haceCosasExtranas;

    @Column(name = "aislado")
    private Boolean aislado;

    @Column(name = "participa_en_grupos")
    private Boolean participaEnGrupos;

    @Column(name = "es_violento")
    private Boolean esViolento;

    @Column(name = "callado")
    private Boolean callado;

    @Column(name = "amigable_y_cooperador")
    private Boolean amigableYCooperador;

    @Column(name = "adaptable")
    private Boolean adaptable;

    @Column(name = "inquieto")
    private Boolean inquieto;

    @Column(name = "nervioso")
    private Boolean nervioso;

    @Column(name = "tiene_amigos_intimos")
    private Boolean tieneAmigosIntimos;

    @Column(name = "confuso")
    private Boolean confuso;

    @Column(name = "centrado_en_si_mismo")
    private Boolean centradoEnSiMismo;

    @Column(name = "olvidadizo")
    private Boolean olvidadizo;

    @Column(name = "piensa_y_responde_bien")
    private Boolean piensaYRespondeBien;

    @Column(name = "pocos_pensamientos")
    private Boolean pocosPensamientos;

    @Column(name = "no_ve_los_errores")
    private Boolean noVeLosErrores;

    @Column(name = "actua_infaltilmente")
    private Boolean actuaInfaltilmente;

    @Column(name = "desconfia")
    private Boolean desconfia;

    @Column(name = "hosco")
    private Boolean hosco;

    @Column(name = "fastidiado")
    private Boolean fastidiado;

    @Column(name = "cansado")
    private Boolean cansado;

    @Column(name = "viste_raramente")
    private Boolean visteRaramente;

    @Column(name = "desordenado")
    private Boolean desordenado;

    @Column(name = "mugroso_y_fachoso")
    private Boolean mugrosoYFachoso;

    @Column(name = "exceso_de_ropas")
    private Boolean excesoDeRopas;

    @Column(name = "dramatico_y_teatral")
    private Boolean dramaticoYTeatral;

    @Column(name = "viste_normalmente")
    private Boolean visteNormalmente;

    @Column(name = "impecable")
    private Boolean impecable;

    @Column(name = "duda_de_todos")
    private Boolean dudaDeTodos;

    @Column(name = "pasa_aislado")
    private Boolean pasaAislado;

    @Column(name = "dice_estar_bien")
    private Boolean diceEstarBien;

    @Column(name = "gusta_de_hacer_dano_a_los_demas")
    private Boolean gustaDeHacerDanoALosDemas;

    @Column(name = "tiene_iniciativas")
    private Boolean tieneIniciativas;

    @Column(name = "colabora")
    private Boolean colabora;

    @Column(name = "reticencia")
    private Boolean reticencia;

    @Column(name = "rechazo")
    private Boolean rechazo;

    @Column(name = "mutismo")
    private Boolean mutismo;

    @Column(name = "negativismo")
    private Boolean negativismo;

    @Column(name = "agresividad")
    private Boolean agresividad;

    @Column(name = "sarcasmo")
    private Boolean sarcasmo;

    @Column(name = "pegajosidad")
    private Boolean pegajosidad;

    @Column(name = "colaboracion_excesiva")
    private Boolean colaboracionExcesiva;

    @Column(name = "atento")
    private Boolean atento;

    @Column(name = "seductor")
    private Boolean seductor;

    @Column(name = "evita_conversar")
    private Boolean evitaConversar;

    @Column(name = "impulsivo")
    private Boolean impulsivo;

    @Column(name = "bromista")
    private Boolean bromista;

    @Column(name = "tosco_y_descortes")
    private Boolean toscoYDescortes;

    @Column(name = "triste")
    private Boolean triste;

    @Column(name = "irritable")
    private Boolean irritable;

    @Column(name = "popenso_a_rinias")
    private Boolean popensoARinias;

    @Column(name = "suave_y_afable")
    private Boolean suaveYAfable;

    @Column(name = "indiferente")
    private Boolean indiferente;

    @Column(name = "preocupado_y_pensativo")
    private Boolean preocupadoYPensativo;

    @Column(name = "tendencia_al_llanto")
    private Boolean tendenciaAlLlanto;

    @Column(name = "alegre")
    private Boolean alegre;

    @Column(name = "euforico")
    private Boolean euforico;

    @Column(name = "labil_de_humor")
    private Boolean labilDeHumor;

    @Column(name = "inactivo")
    private Boolean inactivo;

    @Column(name = "perezoso")
    private Boolean perezoso;

    @Column(name = "solo_hace_cosas_indispensables")
    private Boolean soloHaceCosasIndispensables;

    @Column(name = "realiza_solo_un_tipo_de_trabajo")
    private Boolean realizaSoloUnTipoDeTrabajo;

    @Column(name = "dedicado_a_varias_actividades")
    private Boolean dedicadoAVariasActividades;

    @Column(name = "apraxia")
    private Boolean apraxia;

    @Column(name = "catatonia")
    private Boolean catatonia;

    @Column(name = "agitacion")
    private Boolean agitacion;

    @Column(name = "amaneramiento")
    private Boolean amaneramiento;

    @Column(name = "estereotipias")
    private Boolean estereotipias;

    @Column(name = "ecopraxia")
    private Boolean ecopraxia;

    @Column(name = "obediencia_automatica")
    private Boolean obedienciaAutomatica;

    @Column(name = "negativismo_actividades")
    private Boolean negativismoActividades;

    @Column(name = "interceptacion_motriz")
    private Boolean interceptacionMotriz;

    @Column(name = "dispraxias")
    private Boolean dispraxias;

    @Column(name = "actos_impulsivos")
    private Boolean actosImpulsivos;

    @Column(name = "actos_obsesivos")
    private Boolean actosObsesivos;

    @Column(name = "tics_actividades")
    private Boolean ticsActividades;

    @Column(name = "liderazgo")
    private Boolean liderazgo;

    @Column(name = "sociabilidad")
    private Boolean sociabilidad;

    @Column(name = "responsabilidad")
    private Boolean responsabilidad;

    @Column(name = "tolerancia_normal")
    private Boolean toleranciaNormal;

    @Column(name = "baja")
    private Boolean baja;

    @Column(name = "colaboracion")
    private Boolean colaboracion;

    @Column(name = "inquietud")
    private Boolean inquietud;

    @Column(name = "acata_ordenes_verbales")
    private Boolean acataOrdenesVerbales;

    @Column(name = "agresivo")
    private Boolean agresivo;

    @Column(name = "extravagante")
    private Boolean extravagante;

    @Column(name = "antisocial")
    private Boolean antisocial;

    @Column(name = "impulsivo_comportamiento")
    private Boolean impulsivoComportamiento;

    @Column(name = "reflexivo")
    private Boolean reflexivo;

    @Column(name = "pasivo")
    private Boolean pasivo;

    @Column(name = "apatico")
    private Boolean apatico;

    @Column(name = "dependiente")
    private Boolean dependiente;

    @Column(name = "dominante")
    private Boolean dominante;

    @Column(name = "cauteloso")
    private Boolean cauteloso;

    @Column(name = "quejoso")
    private Boolean quejoso;

    @Column(name = "temeroso")
    private Boolean temeroso;

    @Column(name = "teatral")
    private Boolean teatral;

    @Column(name = "ritualista")
    private Boolean ritualista;

    @Column(name = "aislamiento")
    private Boolean aislamiento;

    @Column(name = "ataques_de_panico")
    private Boolean ataquesDePanico;

    @Column(name = "incapacidad_de_realizacion_de_actividades_productivas")
    private Boolean incapacidadDeRealizacionDeActividadesProductivas;

    @Column(name = "riesgo_potencial_o_potencial_suicida")
    private Boolean riesgoPotencialOPotencialSuicida;

    @Column(name = "inhibicion")
    private Boolean inhibicion;

    @Column(name = "apatia")
    private Boolean apatia;

    @Column(name = "humor_variable")
    private Boolean humorVariable;
}
