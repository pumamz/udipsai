package com.ucacue.udipsai.modules.wais.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wais_subtest", schema = "modulo_wais")
public class WaisSubtest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;
}
