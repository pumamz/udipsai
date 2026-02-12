package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Desarrollo {

    @Column(name = "cdi")
    private Boolean cdi;

    @Column(name = "cdi_edad")
    private Integer cdiEdad;

    @Column(name = "inicial1")
    private Boolean inicial1;

    @Column(name = "inicial1_edad")
    private Integer inicial1Edad;

    @Column(name = "inicial2")
    private Boolean inicial2;

    @Column(name = "inicial2_edad")
    private Integer inicial2Edad;

    @Column(name = "primer_egb")
    private Boolean primerEGB;

    @Column(name = "edad_1ro_egb")
    private Integer edad1roEGB;

    @Column(name = "perdida_anio")
    private Boolean perdidaAnio;
    
    @Column(name = "grado_causa_perdida_anio")
    private String gradoCausaPerdidaAnio;

    @Column(name = "desercion_escolar")
    private Boolean desercionEscolar;

    @Column(name = "grado_causa_desercion_escolar")
    private String gradoCausaDesercionEscolar;

    @Column(name = "cambio_institucion")
    private Boolean cambioInstitucion;

    @Column(name = "grado_causa_cambio_institucion")
    private String gradoCausaCambioInstitucion;

    @Column(name = "problemas_aprendizaje")
    private Boolean problemasAprendizaje;

    @Column(name = "problemas_aprendizaje_especificar", columnDefinition = "TEXT")
    private String problemasAprendizajeEspecificar;
}
