package com.ucacue.udipsai.modules.instituciones.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "instituciones_educativas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstitucionEducativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}
