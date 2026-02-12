package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Vestibular {

    @Column(name = "falta_equilibrio_caminar")
    private Boolean faltaEquilibrioCaminar;

    @Column(name = "mareos")
    private Boolean mareos;

    @Column(name = "cuando_mareos")
    private String cuandoMareos;

    @Column(name = "vertigo")
    private Boolean vertigo;
}
