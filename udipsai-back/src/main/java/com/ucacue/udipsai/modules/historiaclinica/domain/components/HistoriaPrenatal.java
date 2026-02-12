package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HistoriaPrenatal {

    @Column(name = "embarazo_deseado")
    private Boolean embarazoDeseado;

    @Column(name = "control_embarazo")
    private Boolean controlEmbarazo;

    @Column(name = "causa_control_embarazo")
    private String causaControlEmbarazo;

    @Column(name = "enfermedades_madre")
    private String enfermedadesMadre;

    @Column(name = "consumo_medicamentos_toxicos")
    private String consumoMedicamentosToxicos;

    @Column(name = "presento_amenaza_aborto")
    private Boolean presentoAmenazaAborto;

    @Column(name = "mes_amenaza_aborto")
    private String mesAmenazaAborto;

    @Column(name = "causa_amenaza_aborto")
    private String causaAmenazaAborto;

    @Column(name = "estado_emocional")
    private String estadoEmocional;
}
