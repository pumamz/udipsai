package com.ucacue.udipsai.modules.wais.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wais_index_composition", schema = "modulo_wais")
public class WaisIndexComposition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "index_code", nullable = false)
    private String indexCode; // e.g., "CIT", "ICV"

    @ManyToOne
    @JoinColumn(name = "subtest_id", nullable = false)
    private WaisSubtest subtest;
}
