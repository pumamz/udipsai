package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Sexualidad {

    @Column(name = "sexo_de_nacimiento")
    private String sexoDeNacimiento;

    @Column(name = "genero")
    private String genero;

    @Column(name = "orientacion_sexual")
    private String orientacionSexual;

    @Column(name = "curiosidad_sexual")
    private String curiosidadSexual;

    @Column(name = "grado_de_informacion")
    private String gradoDeInformacion;

    @Column(name = "actividad_sexual")
    private String actividadSexual;

    @Column(name = "masturbacion")
    private String masturbacion;

    @Column(name = "promiscuidad")
    private String promiscuidad;

    @Column(name = "disfunciones")
    private String disfunciones;

    @Column(name = "erotismo")
    private String erotismo;

    @Column(name = "parafilias")
    private String parafilias;

    @Column(name = "observaciones_aspecto_psicosexual", columnDefinition = "TEXT")
    private String observacionesAspectoPsicosexual;
}
