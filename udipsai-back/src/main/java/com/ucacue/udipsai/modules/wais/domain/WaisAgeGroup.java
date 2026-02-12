package com.ucacue.udipsai.modules.wais.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wais_age_group", schema = "modulo_wais")
public class WaisAgeGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String label;

    @Column(name = "min_age_months")
    private Integer minAgeMonths;

    @Column(name = "max_age_months")
    private Integer maxAgeMonths;
}
