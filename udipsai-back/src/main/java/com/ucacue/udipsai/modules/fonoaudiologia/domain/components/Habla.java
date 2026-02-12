package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Habla {

    @Column(name = "dificultad_pronunciar_palabras")
    private Boolean dificultadPronunciarPalabras;

    @Column(name = "se_traba_cuando_habla")
    private Boolean seTrabaCuandoHabla;

    @Column(name = "se_entiende_lo_que_dice")
    private Boolean seEntiendeLoQueDice;

    @Column(name = "sabe_como_llaman_objetos_entorno")
    private Boolean sabeComoLlamanObjetosEntorno;

    @Column(name = "comprende_lo_que_se_le_dice")
    private Boolean comprendeLoQueSeLeDice;

    @Column(name = "reconoce_fuente_sonora")
    private Boolean reconoceFuenteSonora;

    @Column(name = "comunicacion_preferentemente_forma")
    private String comunicacionPreferentementeForma;

    @Column(name = "trastorno_especifico_pronunciacion")
    private Boolean trastornoEspecificoPronunciacion;

    @Column(name = "trastorno_lenguaje_expresivo")
    private Boolean trastornoLenguajeExpresivo;

    @Column(name = "afasia_adquirida_epilepsia")
    private Boolean afasiaAdquiridaEpilepsia;

    @Column(name = "otros_trastornos_desarrollo_habla")
    private Boolean otrosTrastornosDesarrolloHabla;

    @Column(name = "trastorno_desarrollo_habla_lenguaje")
    private Boolean trastornoDesarrolloHablaLenguaje;

    @Column(name = "trastorno_recepcion_lenguaje")
    private Boolean trastornoRecepcionLenguaje;

    @Column(name = "alteraciones_habla")
    private Boolean alteracionesHabla;

    @Column(name = "disfasia_afasia")
    private Boolean disfasiaAfasia;

    @Column(name = "disartria_anartria")
    private Boolean disartriaAnartria;

    @Column(name = "otras_alteraciones_habla")
    private Boolean otrasAlteracionesHabla;
}
