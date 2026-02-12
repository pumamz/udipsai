package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HistoriaEscolar {

    @Column(name = "asignaturas_gustan")
    private String asignaturasGustan;

    @Column(name = "asignaturas_disgustan")
    private String asignaturasDisgustan;

    @Column(name = "relacion_docentes")
    private String relacionDocentes;

    @Column(name = "causa_relacion_docentes")
    private String causaRelacionDocentes;

    @Column(name = "gusta_ir_institucion")
    private Boolean gustaIrInstitucion;

    @Column(name = "causa_gusta_ir_institucion")
    private String causaGustaIrInstitucion;

    @Column(name = "relacion_con_grupo")
    private String relacionConGrupo;

    @Column(name = "causa_relacion_con_grupo")
    private String causaRelacionConGrupo;
}
