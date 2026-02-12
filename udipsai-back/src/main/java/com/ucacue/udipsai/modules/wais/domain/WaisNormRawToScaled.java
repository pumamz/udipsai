package com.ucacue.udipsai.modules.wais.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wais_norm_raw_to_scaled", schema = "modulo_wais")
public class WaisNormRawToScaled {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "age_group_id", nullable = false)
    private WaisAgeGroup ageGroup;

    @ManyToOne
    @JoinColumn(name = "subtest_id", nullable = false)
    private WaisSubtest subtest;

    @Column(name = "raw_score", nullable = false)
    private Integer rawScore;

    @Column(name = "scaled_score", nullable = false)
    private Integer scaledScore;
}
