package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HistoriaNatal {

    @Column(name = "donde_nacio")
    private String dondeNacio;

    @Column(name = "ciudad_nacimiento")
    private String ciudadNacimiento;

    @Column(name = "duracion_embarazo")
    private String duracionEmbarazo;

    @Column(name = "tipo_parto")
    private String tipoParto;

    @Column(name = "parto_segun_comienzo")
    private String partoSegunElComienzo;

    @Column(name = "parto_segun_finalizacion")
    private String partoSegunFinalizacion;

    @Column(name = "lloro_al_nacer")
    private Boolean lloroAlNacer;

    @Column(name = "peso_al_nacer")
    private String pesoAlNacer;

    @Column(name = "talla_al_nacer")
    private String tallaAlNacer;

    @Column(name = "anoxia_al_nacer")
    private Boolean anoxiaAlNacer;

    @Column(name = "hipoxia_al_nacer")
    private Boolean hipoxiaAlNacer;

    @Column(name = "ictericia_al_nacer")
    private Boolean ictericiaAlNacer;

    @Column(name = "cianosis_al_nacer")
    private Boolean cianosisAlNacer;

    @Column(name = "malformacion_congenita")
    private String malformacionCongenita;

    @Column(name = "problemas_alimentacion")
    private String problemasDeAlimentacion;

    @Column(name = "complicaciones_parto")
    private Boolean complicacionesEnElParto;

    @Column(name = "cual_complicacion_parto")
    private String cualComplicacionParto;

    @Column(name = "estuvo_en_incubadora")
    private Boolean estuvoEnIncubadora;

    @Column(name = "tiempo_en_incubadora")
    private String tiempoEnIncubadora;

    @Column(name = "causa_de_incubadora")
    private String causaDeIncubadora;
}
