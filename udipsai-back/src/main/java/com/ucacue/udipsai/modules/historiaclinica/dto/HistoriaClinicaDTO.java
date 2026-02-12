package com.ucacue.udipsai.modules.historiaclinica.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;

import java.util.Date;

import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import lombok.Data;

@Data
public class HistoriaClinicaDTO {
    private Integer id;
    private PacienteFichaDTO paciente;
    private Boolean activo;
    private Date fecha;
    private InformacionGeneral informacionGeneral;
    private DatosFamiliares datosFamiliares;
    private HistoriaPrenatal historiaPrenatal;
    private HistoriaNatal historiaNatal;
    private HistoriaPostnatal historiaPostnatal;
    private DesarrolloMotor desarrolloMotor;
    private Alimentacion alimentacion;
    private AntecedentesMedicos antecedentesMedicos;
}
