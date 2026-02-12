package com.ucacue.udipsai.modules.especialistas.domain;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.permisos.Permisos;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.List;

@Entity
@Table(name = "especialistas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Especialista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cedula", unique = true, nullable = false, length = 15)
    private String cedula;

    @Column(name = "nombres_apellidos", nullable = false)
    private String nombresApellidos;

    @Column(name = "contrasenia")
    private String contrasenia;

    @Column(name = "foto_url")
    private String fotoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id")
    private Sede sede;
    
    @OneToMany(mappedBy = "especialista", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Pasante> pasantesAsignados;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "permisos_id")
    private Permisos permisos;
}
