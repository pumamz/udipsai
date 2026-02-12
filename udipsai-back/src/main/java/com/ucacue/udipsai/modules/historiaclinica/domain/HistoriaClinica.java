package com.ucacue.udipsai.modules.historiaclinica.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import java.util.Date;

import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historias_clinicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha")
    private Date fecha;

    // --- Componentes @Embeddable ---

    @Embedded
    private InformacionGeneral informacionGeneral;

    @Embedded
    private DatosFamiliares datosFamiliares;

    @Embedded
    private HistoriaPrenatal historiaPrenatal;

    @Embedded
    private HistoriaNatal historiaNatal;

    @Embedded
    private HistoriaPostnatal historiaPostnatal;

    @Embedded
    private DesarrolloMotor desarrolloMotor;

    @Embedded
    private Alimentacion alimentacion;

    @Embedded
    private AntecedentesMedicos antecedentesMedicos;

}
