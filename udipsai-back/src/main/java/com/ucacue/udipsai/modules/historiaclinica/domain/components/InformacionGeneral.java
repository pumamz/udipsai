package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class InformacionGeneral {

    @Column(name = "fuente_de_informacion")
    private String fuenteDeInformacion;

    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;

    @Column(name = "parentesco")
    private String parentesco;

    @Column(name = "persona_que_deriva")
    private String personaQueDeriva;

    @Column(name = "vive_con")
    private String viveCon;

    @Column(name = "vive_con_otro")
    private String viveConOtro;

    @Column(name = "viven_juntos")
    private Boolean vivenJuntos;

    @Column(name = "otros_compromisos", columnDefinition = "TEXT")
    private String otrosCompromisos;

    @Column(name = "tipo_familia")
    private String tipoFamilia;

    @Column(name = "hijos_otros_familiares_viven_casa")
    private String hijosOtrosFamiliaresVivenCasa;

    @Column(name = "genograma_url")
    private String genogramaUrl;
}
