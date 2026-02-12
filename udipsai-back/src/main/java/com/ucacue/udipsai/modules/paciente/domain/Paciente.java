package com.ucacue.udipsai.modules.paciente.domain;

import com.ucacue.udipsai.modules.documentos.domain.Documento;
import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import com.ucacue.udipsai.modules.sedes.domain.Sede;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 15)
    private String cedula;

    @Builder.Default
    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura = LocalDateTime.now();

    @Builder.Default
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "nombres_apellidos", nullable = false)
    private String nombresApellidos;

    @Column(length = 100)
    private String ciudad;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(columnDefinition = "TEXT")
    private String domicilio;

    @Column(name = "barrio")
    private String barrio;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    @Column(name = "numero_celular", length = 20)
    private String numeroCelular;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = true)
    private Sede sede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institucion_educativa_id", nullable = true)
    private InstitucionEducativa institucionEducativa;

    @Builder.Default
    @Column(name = "pertenece_inclusion")
    private Boolean perteneceInclusion = false;

    @Builder.Default
    @Column(name = "tiene_discapacidad")
    private Boolean tieneDiscapacidad = false;

    @Builder.Default
    @Column(name = "portador_carnet")
    private Boolean portadorCarnet = false;

    @Builder.Default
    @Column(name = "pertenece_a_proyecto")
    private Boolean perteneceAProyecto = false;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT", name = "motivo_consulta")
    private String motivoConsulta;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "tipo_discapacidad")
    private String tipoDiscapacidad;

    @Column(name = "detalle_discapacidad")
    private String detalleDiscapacidad;

    @Column(name = "porcentaje_discapacidad")
    private Integer porcentajeDiscapacidad;

    @Column(name = "proyecto")
    private String proyecto;

    @Column(name = "nivel_educativo")
    private String nivelEducativo;

    @Column(name = "anio_educacion")
    private String anioEducacion;

    @Column(name = "jornada", length = 20)
    private String jornada;

    @Builder.Default
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Documento> documentos = new ArrayList<>();


    @Transient
    public int getEdad() {
        if (fechaNacimiento == null)
            return 0;
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }
}
