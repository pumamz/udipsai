package com.ucacue.udipsai.modules.citas.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarCitaDTO {
    private Integer idPaciente;
    private Integer idProfesional;
    private String tipoProfesional;
    private Integer idEspecialidad;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate fecha;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "HH:mm")
    private LocalTime hora;
    private Integer duracionMinutes;

}
