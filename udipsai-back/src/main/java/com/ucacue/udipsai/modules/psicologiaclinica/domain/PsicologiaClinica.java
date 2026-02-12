package com.ucacue.udipsai.modules.psicologiaclinica.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.psicologiaclinica.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "psicologia_clinica_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PsicologiaClinica {

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
    private Anamnesis anamnesis;

    @Embedded
    private Suenio suenio;

    @Embedded
    private Conducta conducta;

    @Embedded
    private Sexualidad sexualidad;

    @Embedded
    private EvaluacionLenguaje evaluacionLenguaje;

    @Embedded
    private EvaluacionAfectiva evaluacionAfectiva;

    @Embedded
    private EvaluacionCognitiva evaluacionCognitiva;

    @Embedded
    private EvaluacionPensamiento evaluacionPensamiento;

    @Embedded
    private Diagnostico diagnostico;
    
}
