package com.ucacue.udipsai.modules.psicologiaeducativa.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.psicologiaeducativa.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "psicologia_educativa_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PsicologiaEducativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // --- Componentes @Embeddable ---

    @Embedded
    private HistoriaEscolar historiaEscolar;

    @Embedded
    private Desarrollo desarrollo;

    @Embedded
    private Adaptacion adaptacion;

    @Embedded
    private EstadoGeneral estadoGeneral;

}
