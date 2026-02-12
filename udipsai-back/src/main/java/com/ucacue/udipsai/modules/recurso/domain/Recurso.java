package com.ucacue.udipsai.modules.recurso.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recursos")
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class Recurso {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "archivo_nombre")
    private String archivoNombre;

    @Column(name = "archivo_url")
    private String archivoUrl;

    @Column(name = "activo")
    private Boolean activo = true;
}