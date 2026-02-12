package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data; 

@Embeddable
@Data
public class EstadoGeneral {

    @Column(name = "aprovechamiento_general")
    private String aprovechamientoGeneral;

    @Column(name = "actividad_escolar", columnDefinition = "TEXT")
    private String actividadEscolar;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
}
