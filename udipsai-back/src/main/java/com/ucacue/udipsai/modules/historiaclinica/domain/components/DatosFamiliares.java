package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class DatosFamiliares {

    @Column(name = "nombre_padre")
    private String nombrePadre;

    @Column(name = "edad_padre")
    private Integer edadPadre;

    @Column(name = "ocupacion_padre")
    private String ocupacionPadre;

    @Column(name = "instruccion_padre")
    private String instruccionPadre;

    @Column(name = "estado_civil_padre")
    private String estadoCivilPadre;

    @Column(name = "lugar_residencia_padre")
    private String lugarResidenciaPadre;

    @Column(name = "nombre_madre")
    private String nombreMadre;

    @Column(name = "edad_madre")
    private Integer edadMadre;

    @Column(name = "ocupacion_madre")
    private String ocupacionMadre;

    @Column(name = "instruccion_madre")
    private String instruccionMadre;

    @Column(name = "estado_civil_madre")
    private String estadoCivilMadre;

    @Column(name = "lugar_residencia_madre")
    private String lugarResidenciaMadre;

    @Column(name = "numero_hermanos")
    private Integer numeroHermanos;

    @Column(name = "lugar_que_ocupa")
    private String lugarQueOcupa;

    @Column(name = "direccion_domiciliaria")
    private String direccionDomiciliaria;
}
