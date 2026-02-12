package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Otoscopia {

    // Oído Derecho
    @Column(name = "palpacion_pabellon_oido_derecho")
    private String palpacionPabellonOidoDerecho;

    @Column(name = "palpacion_mastoides_oido_derecho")
    private String palpacionMastoidesOidoDerecho;

    @Column(name = "cae_oido_derecho")
    private String caeOidoDerecho;

    @Column(name = "obstruccion_oido_derecho")
    private String obstruccionOidoDerecho;

    @Column(name = "apariencia_menbrana_timpanica_oido_derecho")
    private String aparienciaMenbranaTimpanicaOidoDerecho;

    @Column(name = "perforacion_oido_derecho")
    private Boolean perforacionOidoDerecho;

    @Column(name = "burbuja_oido_derecho")
    private Boolean burbujaOidoDerecho;

    @Column(name = "coloracion_oido_derecho")
    private String coloracionOidoDerecho;

    // Oído Izquierdo
    @Column(name = "palpacion_pabellon_oido_izquierdo")
    private String palpacionPabellonOidoIzquierdo;

    @Column(name = "palpacion_mastoides_oido_izquierdo")
    private String palpacionMastoidesOidoIzquierdo;

    @Column(name = "cae_oido_izquierdo")
    private String caeOidoIzquierdo;

    @Column(name = "obstruccion_oido_izquierdo")
    private String obstruccionOidoIzquierdo;

    @Column(name = "apariencia_menbrana_timpanica_oido_izquierdo")
    private String aparienciaMenbranaTimpanicaOidoIzquierdo;

    @Column(name = "perforacion_oido_izquierdo")
    private Boolean perforacionOidoIzquierdo;

    @Column(name = "burbuja_oido_izquierdo")
    private Boolean burbujaOidoIzquierdo;

    @Column(name = "coloracion_oido_izquierdo")
    private String coloracionOidoIzquierdo;
}
