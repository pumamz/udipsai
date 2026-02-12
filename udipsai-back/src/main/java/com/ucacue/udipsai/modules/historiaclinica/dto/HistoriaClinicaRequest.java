package com.ucacue.udipsai.modules.historiaclinica.dto;

import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoriaClinicaRequest {
    private Integer pacienteId;
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
