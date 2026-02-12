package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class DesarrolloMotor {

    @Column(name = "control_cefalico")
    private String controlCefalico;

    @Column(name = "sedestacion")
    private String sedestacion;

    @Column(name = "hipedestacion")
    private String hipedestacion;

    @Column(name = "camina_con_apoyo")
    private String caminaConApoyo;

    @Column(name = "camina_solo")
    private String caminaSolo;

    @Column(name = "sube_escaleras")
    private String subeEscaleras;

    @Column(name = "control_esfinteres")
    private String controlEsfinteres;

    @Column(name = "salta")
    private String salta;

    @Column(name = "corre")
    private String corre;

    @Column(name = "gateo")
    private String gateo;

    @Column(name = "prefiere_mano")
    private String prefiereManoIzquierdaDerecha;

    @Column(name = "cae_equilibrio")
    private String caeOPerdeEquilibrioFacilmente;
}
