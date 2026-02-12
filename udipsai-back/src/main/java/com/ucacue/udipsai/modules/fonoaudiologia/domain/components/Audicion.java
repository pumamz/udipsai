package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.util.Date;

@Embeddable
@Data
public class Audicion {

    @Column(name = "se_a_realizado_examen_audiologico")
    private Boolean seARealizadoExamenAudiologico;

    @Column(name = "perdida_auditiva_conductiva_neurosensorial")
    private Boolean perdidaAuditivaConductivaNeurosensorial;

    @Column(name = "audicion_normal")
    private Boolean audicionNormal;

    @Column(name = "hipoacusia_conductiva_bilateral")
    private Boolean hipoacusiaConductivaBilateral;

    @Column(name = "hipoacusia_conductiva_unilateral")
    private Boolean hipoacusiaConductivaUnilateral;

    @Column(name = "hipoacusia_neurosensorial_bilateral")
    private Boolean hipoacusiaNeurosensorialBilateral;

    @Column(name = "hipoacusia_neurosensorial_unilateral")
    private Boolean hipoacusiaNeurosensorialUnilateral;

    @Column(name = "detalles_audicion")
    private String detallesAudicion;

    @Column(name = "infecciones_oido_fuertes")
    private Boolean infeccionesOidoFuertes;

    @Column(name = "cual_infecciones_oido_fuertes")
    private String cualInfeccionesOidoFuertes;

    @Column(name = "edad_infecciones_oido_fuertes")
    private Integer edadInfeccionesOidoFuertes;

    @Column(name = "perdida_auditiva")
    private Boolean perdidaAuditiva;

    @Column(name = "oido_derecho")
    private Boolean oidoDerecho;

    @Column(name = "oido_izquierdo")
    private Boolean oidoIzquierdo;

    @Column(name = "bilateral")
    private Boolean bilateral;

    @Column(name = "grado_perdida")
    private String gradoPerdida;

    @Column(name = "permanecia")
    private String permanecia;

    @Column(name = "otitis")
    private Boolean otitis;

    @Column(name = "tipo_otitis")
    private String tipoOtitis;

    @Column(name = "duracion_otitis_inicio")
    private Date duracionOtitisInicio;

    @Column(name = "duracion_otitis_fin")
    private Date duracionOtitisFin;

    @Column(name = "antecedentes_familiares")
    private Boolean antecedentesFamiliares;

    @Column(name = "exposision_ruidos")
    private Boolean exposisionRuidos;

    @Column(name = "ototoxicos")
    private Boolean ototoxicos;

    @Column(name = "infecciones")
    private Boolean infecciones;

    @Column(name = "uso_audifonos")
    private Boolean usoAudifonos;

    @Column(name = "implante_coclear")
    private Boolean implanteCoclear;

    @Column(name = "vibrador_oseo")
    private Boolean vibradorOseo;

    @Column(name = "inicio_ayudas_auditivas")
    private Date inicioAyudasAuditivas;

    @Column(name = "fin_ayudas_auditivas")
    private Date finAyudasAuditivas;

}
