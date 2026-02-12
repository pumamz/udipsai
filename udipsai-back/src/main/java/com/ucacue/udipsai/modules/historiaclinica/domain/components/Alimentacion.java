package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Alimentacion {

    @Column(name = "dejo_pecho_materno")
    private String dejoPechoMaterno;

    @Column(name = "biberon")
    private String biberon;

    @Column(name = "alimento_solo_cuchara")
    private String alimentoPorSiSoloCuchara;

    @Column(name = "edad_integro_dieta")
    private String edadIntegroDietaFamiliar;
}
