package com.ucacue.udipsai.modules.wais.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wais_index_norm", schema = "modulo_wais", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "type", "sum_scaled" })
})
public class WaisIndexNorm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // e.g. CIT, ICV, IRP, IMT, IVP

    @Column(name = "sum_scaled", nullable = false)
    private Integer sumScaled;

    @Column(nullable = false)
    private Integer value; // The actual index score (CIT, ICV...)

    @Column(nullable = false)
    private Integer percentile;

    private String ic90;
    private String ic95;
}
