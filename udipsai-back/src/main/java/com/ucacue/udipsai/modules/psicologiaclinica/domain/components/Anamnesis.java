package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Anamnesis {

    @Column(name = "anamnesis_familiar", columnDefinition = "TEXT")
    private String anamnesisFamiliar;

    @Column(name = "personal", columnDefinition = "TEXT")
    private String personal;

    @Column(name = "momentos_evolutivos_en_el_desarrollo", columnDefinition = "TEXT")
    private String momentosEvolutivosEnElDesarrollo;

    @Column(name = "habitos_en_la_oralidad", columnDefinition = "TEXT")
    private String habitosEnLaOralidad;
}
