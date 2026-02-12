package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Fonacion {

    @Column(name = "cree_tono_voz_estudiante_apropiado")
    private Boolean creeTonoVozEstudianteApropiado;

    @Column(name = "respiracion_normal")
    private Boolean respiracionNormal;

    @Column(name = "situaciones_altera_tono_voz")
    private String situacionesAlteraTonoVoz;

    @Column(name = "desde_cuando_alteraciones_voz")
    private String desdeCuandoAlteracionesVoz;

    @Column(name = "tono_de_voz")
    private String tonoDeVoz;

    @Column(name = "respiracion")
    private String respiracion;

    @Column(name = "ronca")
    private Boolean ronca;

    @Column(name = "ronca_desde_cuando")
    private String roncaDesdeCuando;

    @Column(name = "juego_vocal")
    private Boolean juegoVocal;

    @Column(name = "juego_vocal_desde_cuando")
    private String juegoVocalDesdeCuando;

    @Column(name = "vocalizacion")
    private Boolean vocalizacion;

    @Column(name = "vocalizacion_desde_cuando")
    private String vocalizacionDesdeCuando;

    @Column(name = "balbuceo")
    private Boolean balbuceo;

    @Column(name = "balbuceo_desde_cuando")
    private String balbuceoDesdeCuando;

    @Column(name = "silabeo")
    private Boolean silabeo;

    @Column(name = "silabeo_desde_cuando")
    private String silabeoDesdeCuando;

    @Column(name = "primeras_palabras")
    private Boolean primerasPalabras;

    @Column(name = "primeras_palabras_desde_cuando")
    private String primerasPalabrasDesdeCuando;

    @Column(name = "oraciones_dos_palabras")
    private Boolean oracionesDosPalabras;

    @Column(name = "oraciones_dos_palabras_desde_cuando")
    private String oracionesDosPalabrasDesdeCuando;

    @Column(name = "oraciones_tres_palabras")
    private Boolean oracionesTresPalabras;

    @Column(name = "oraciones_tres_palabras_desde_cuando")
    private String oracionesTresPalabrasDesdeCuando;

    @Column(name = "formacion_linguistica_completa")
    private Boolean formacionLinguisticaCompleta;

    @Column(name = "formacion_linguistica_completa_desde_cuando")
    private String formacionLinguisticaCompletaDesdeCuando;

    @Column(name = "numero_total_palabras")
    private Integer numeroTotalPalabras;
}
