package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HistoriaAuditiva {

    @Column(name = "otalgia")
    private Boolean otalgia;

    @Column(name = "otalgia_unilateral")
    private Boolean otalgiaUnilateral;

    @Column(name = "otalgia_oido_derecho")
    private Boolean otalgiaOidoDerecho;

    @Column(name = "otalgia_oido_izquierdo")
    private Boolean otalgiaOidoIzquierdo;

    @Column(name = "otalgia_bilateral")
    private Boolean otalgiaBilateral;

    @Column(name = "permanencia_otalgia_continua")
    private Boolean permanenciaOtalgiaContinua;

    @Column(name = "permanencia_otalgia_intermitente")
    private Boolean permanenciaOtalgiaIntermitente;

    @Column(name = "grado_permanencia_otalgia")
    private String gradoPermanenciaOtalgia;

    @Column(name = "asociada_otalgia_infeccion_respiratoria_alta")
    private Boolean asociadaOtalgiaInfeccionRespiratoriaAlta;

    @Column(name = "infeccion_respiratoria_punzante")
    private Boolean infeccionRespiratoriaPunzante;

    @Column(name = "infeccion_respiratoria_pulsatil")
    private Boolean infeccionRespiratoriaPulsatil;

    @Column(name = "infeccion_respiratoria_progresivo")
    private Boolean infeccionRespiratoriaProgresivo;

    @Column(name = "infeccion_respiratoria_opresivo")
    private Boolean infeccionRespiratoriaOpresivo;

    @Column(name = "pruriginoso")
    private Boolean pruriginoso;

    @Column(name = "aumenta_masticar")
    private Boolean aumentaMasticar;

    @Column(name = "disminuye_con_calor_local")
    private Boolean disminuyeConCalorLocal;

    @Column(name = "aumenta_con_calor_local")
    private Boolean aumentaConCalorLocal;

    @Column(name = "otorrea")
    private Boolean otorrea;

    @Column(name = "otorrea_unilateral")
    private Boolean otorreaUnilateral;

    @Column(name = "otorrea_oido_derecho")
    private Boolean otorreaOidoDerecho;

    @Column(name = "otorrea_oido_izquierdo")
    private Boolean otorreaOidoIzquierdo;

    @Column(name = "otorrea_bilateral")
    private Boolean otorreaBilateral;

    @Column(name = "permanencia_otorrea_continua")
    private Boolean permanenciaOtorreaContinua;

    @Column(name = "permanencia_otorrea_intermitente")
    private Boolean permanenciaOtorreaIntermitente;

    @Column(name = "grado_permanencia_otorrea")
    private String gradoPermanenciaOtorrea;

    @Column(name = "aspecto_claro_otorrea")
    private Boolean aspectoClaroOtorrea;

    @Column(name = "aspecto_seroso_otorrea")
    private Boolean aspectoSerosoOtorrea;

    @Column(name = "aspecto_mucoso_otorrea")
    private Boolean aspectoMucosoOtorrea;

    @Column(name = "aspecto_mucopurulento_otorrea")
    private Boolean aspectoMucopurulentoOtorrea;

    @Column(name = "aspecto_purulento_otorrea")
    private Boolean aspectoPurulentoOtorrea;

    @Column(name = "aspecto_sanguinolento_otorrea")
    private Boolean aspectoSanguinolentoOtorrea;

    @Column(name = "asosiada_otorrea_infeccion_respiratoria_alta")
    private Boolean asosiadaOtorreaInfeccionRespiratoriaAlta;

    @Column(name = "asosiada_otorrea_infeccion_aguda_oido")
    private Boolean asosiadaotorreaInfeccionAgudaOido;

    @Column(name = "presento_otalgia")
    private Boolean presentoOtalgia;

    @Column(name = "presento_otalgia_bilateral")
    private Boolean presentoOtalgiaBilateral;

    @Column(name = "presento_otalgia_oido_derecho")
    private Boolean presentoOtalgiaOidoDerecho;

    @Column(name = "presento_otalgia_oido_izquierdo")
    private Boolean presentoOtalgiaOidoIzquierdo;

    @Column(name = "presento_sensacion_oido_tapado")
    private Boolean presentoSensacionOidoTapado;

    @Column(name = "presento_sensacion_oido_tapado_bilateral")
    private Boolean presentoSensacionOidoTapadoBilateral;

    @Column(name = "presento_sensacion_oido_tapado_oido_derecho")
    private Boolean presentoSensacionOidoTapadoOidoDerecho;

    @Column(name = "presento_sensacion_oido_tapado_oido_izquierdo")
    private Boolean presentoSensacionOidoTapadoOidoIzquierdo;

    @Column(name = "presento_autofonia")
    private Boolean presentoAutofonia;

    @Column(name = "presento_autofonia_bilateral")
    private Boolean presentoAutofoniaBilateral;

    @Column(name = "presento_autofonia_oido_derecho")
    private Boolean presentoAutofoniaOidoDerecho;

    @Column(name = "presento_autofonia_oido_izquierdo")
    private Boolean presentoAutofoniaOidoIzquierdo;

    @Column(name = "presento_otorrea")
    private Boolean presentoOtorrea;

    @Column(name = "presento_otorrea_bilateral")
    private Boolean presentoOtorreaBilateral;

    @Column(name = "presento_otorrea_oido_derecho")
    private Boolean presentoOtorreaOidoDerecho;

    @Column(name = "presento_otorrea_oido_izquierdo")
    private Boolean presentoOtorreaOidoIzquierdo;

    @Column(name = "aumenta_volumen_tv")
    private Boolean aumentaVolumenTV;

    @Column(name = "sensacion_percibir_tinnitus")
    private Boolean sensacionPercibirTinnitus;

    @Column(name = "expuesto_ruidos_fuertes")
    private Boolean expuestoRuidosFuertes;

    @Column(name = "dificultad_oid_voz_baja")
    private Boolean dificultadOidVozBaja;

    @Column(name = "habla_mas_fuerte_o_mas_despacio")
    private Boolean hablaMasFuerteOMasDespacio;

    @Column(name = "utiliza_ayuda_auditiva")
    private Boolean utilizaAyudaAuditiva;

    @Column(name = "especificar_ayuda_auditiva")
    private String especficarAyudaAuditiva;

    @Column(name = "percibe_sonido_igual_ambos_oidos")
    private Boolean percibeSonidoIgualAmbosOidos;

    @Column(name = "con_que_oido_escucha_mejor")
    private String conQueOidoEscuchaMejor;

    @Column(name = "hace_cuanto_tiempo_presenta_sintomas_auditivos")
    private String haceCuantoTiempoPresentaSintomasAuditivos;
}
