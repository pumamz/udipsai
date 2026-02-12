package com.ucacue.udipsai.modules.psicologiaclinica.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class EvaluacionPensamiento {

    // Estructura
    @Column(name = "incoherencia_estructura_del_pensamiento")
    private String incoherencia;

    @Column(name = "bloqueos")
    private String bloqueos;

    @Column(name = "preservacion")
    private String preservacion;

    @Column(name = "prolijidad")
    private String prolijidad;

    @Column(name = "desgragacion")
    private String desgragacion;

    @Column(name = "estereotipias_estructura_del_pensamiento")
    private String estereotipiasEstructuraDelPensamiento;

    @Column(name = "neologismos")
    private String neologismos;

    @Column(name = "musitacion")
    private String musitacion;

    // Curso
    @Column(name = "retardo")
    private Boolean retardo;

    @Column(name = "aceleracion")
    private Boolean aceleracion;

    @Column(name = "fuga_de_ideas")
    private Boolean fugaDeIdeas;

    @Column(name = "mutismo_curso_del_pensamiento")
    private Boolean mutismoCursoDelPensamiento;

    // Contenido
    @Column(name = "grandeza")
    private Boolean grandeza;

    @Column(name = "suicidio")
    private Boolean suicidio;

    @Column(name = "autocompasion")
    private Boolean autocompasion;

    @Column(name = "inferioridad")
    private Boolean inferioridad;

    @Column(name = "perdida_de_interes")
    private Boolean perdidaDeInteres;

    @Column(name = "indecision")
    private Boolean indecision;

    @Column(name = "necesidad_de_ayuda")
    private Boolean necesidadDeAyuda;

    @Column(name = "fracaso")
    private Boolean fracaso;

    @Column(name = "ruina")
    private Boolean ruina;

    @Column(name = "autoacusacion")
    private Boolean autoacusacion;

    @Column(name = "resentimiento")
    private Boolean resentimiento;

    @Column(name = "muerte")
    private Boolean muerte;

    @Column(name = "danio")
    private Boolean danio;

    @Column(name = "enfermedad")
    private Boolean enfermedad;

    @Column(name = "grave")
    private Boolean grave;

    @Column(name = "hipocondrias")
    private Boolean hipocondrias;

    @Column(name = "nihilistas")
    private Boolean nihilistas;

    @Column(name = "no_tener_sentimientos")
    private Boolean noTenerSentimientos;

    @Column(name = "el_mundo_ha_dejado_de_existir")
    private Boolean elMundoHaDejadoDeExistir;

    @Column(name = "referencia")
    private Boolean referencia;

    @Column(name = "extravagantes")
    private Boolean extravagantes;

    @Column(name = "fobicas")
    private Boolean fobicas;

    @Column(name = "compulsivas")
    private Boolean compulsivas;

    @Column(name = "obsesivas")
    private Boolean obsesivas;

    @Column(name = "desconfianzas")
    private Boolean desconfianzas;

    @Column(name = "des_relacion")
    private Boolean desRelacion;

    @Column(name = "perdida_de_control")
    private Boolean perdidaDeControl;

    @Column(name = "ser_calumniado")
    private Boolean serCalumniado;

    @Column(name = "delirios_paranoides")
    private Boolean deliriosParanoides;

    @Column(name = "depresivos")
    private Boolean depresivos;

    @Column(name = "mistico_religioso")
    private Boolean misticoReligioso;

    @Column(name = "sexuales")
    private Boolean sexuales;

    @Column(name = "difusos")
    private Boolean difusos;

    @Column(name = "otros_contenido_del_pensamiento")
    private String otrosContenidoDelPensamiento;
    
    // Juicio
    @Column(name = "capacidad_de_autocritica")
    private Boolean capacidadDeAutocritica;

    @Column(name = "heterocritica")
    private Boolean heterocritica;

    @Column(name = "proyectos_futuros")
    private Boolean proyectosFuturos;

    @Column(name = "conciencia_de_la_enfermedad")
    private Boolean concienciaDeLaEnfermedad;
}
