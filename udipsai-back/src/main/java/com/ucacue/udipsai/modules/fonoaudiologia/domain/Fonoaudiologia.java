package com.ucacue.udipsai.modules.fonoaudiologia.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.fonoaudiologia.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fonoaudiologia_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fonoaudiologia {

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
    private Habla habla;

    @Embedded
    private Audicion audicion;

    @Embedded
    private Fonacion fonacion;

    @Embedded
    private HistoriaAuditiva historiaAuditiva;

    @Embedded
    private Vestibular vestibular;

    @Embedded
    private Otoscopia otoscopia;

}
