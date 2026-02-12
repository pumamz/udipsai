package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Conducta {

    @Column(name = "temores")
    private Boolean temores;

    @Column(name = "destructividad")
    private Boolean destructividad;

    @Column(name = "nerviosismo")
    private Boolean nerviosismo;

    @Column(name = "irritabilidad")
    private Boolean irritabilidad;

    @Column(name = "egocentrismo")
    private Boolean egocentrismo;

    @Column(name = "regresiones")
    private Boolean regresiones;

    @Column(name = "tics")
    private Boolean tics;

    @Column(name = "hurto")
    private Boolean hurto;

    @Column(name = "mentira")
    private Boolean mentira;

    @Column(name = "cuidado_personal")
    private Boolean cuidadoPersonal;

    @Column(name = "otros_conductas_preocupantes")
    private String otrosConductasPreocupantes;

    @Column(name = "observaciones_conductas_preocupantes", columnDefinition = "TEXT")
    private String observacionesConductasPreocupantes;
}
