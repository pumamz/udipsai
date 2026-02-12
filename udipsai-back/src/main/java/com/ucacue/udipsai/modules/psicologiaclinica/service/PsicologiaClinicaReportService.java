package com.ucacue.udipsai.modules.psicologiaclinica.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.psicologiaclinica.dto.PsicologiaClinicaDTO;
import com.ucacue.udipsai.modules.psicologiaclinica.domain.components.*;

@Service
public class PsicologiaClinicaReportService {

    @Autowired
    private PsicologiaClinicaService psicologiaClinicaService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    public ByteArrayInputStream exportarExcel(Integer pacienteId) throws IOException {
        List<PsicologiaClinicaDTO> fichas;
        if (pacienteId != null) {
            PsicologiaClinicaDTO ficha = psicologiaClinicaService.obtenerFichaPsicologiaClinicaPorPacienteId(pacienteId);
            fichas = ficha != null ? List.of(ficha) : List.of();
        } else {
            fichas = psicologiaClinicaService.listarFichasPsicologiaClinica();
        }

        String[] headers = {
                // DATOS BÁSICOS
                "ID", "Paciente", "Cédula", "Estado",
                // ANAMNESIS
                "ANAMNESIS: Familiar", "ANAMNESIS: Personal", "ANAMNESIS: Momentos evolutivos", "ANAMNESIS: Hábitos oralidad",
                // SUEÑO
                "SUEÑO: Inicio horario", "SUEÑO: Fin horario", "SUEÑO: Tipo horario", "SUEÑO: Compañía",
                "SUEÑO: Especificar compañía", "SUEÑO: Edad", "SUEÑO: Hipersomnia", "SUEÑO: Dificultad conciliar",
                "SUEÑO: Despertar frecuente", "SUEÑO: Despertar prematuro", "SUEÑO: Sonambulismo", "SUEÑO: Observaciones",
                // CONDUCTA
                "CONDUCTA: Temores", "CONDUCTA: Destructividad", "CONDUCTA: Nerviosismo", "CONDUCTA: Irritabilidad",
                "CONDUCTA: Egocentrismo", "CONDUCTA: Regresiones", "CONDUCTA: Tics", "CONDUCTA: Hurto",
                "CONDUCTA: Mentira", "CONDUCTA: Cuidado personal", "CONDUCTA: Otros", "CONDUCTA: Observaciones",
                // SEXUALIDAD
                "SEXUALIDAD: Sexo nacimiento", "SEXUALIDAD: Género", "SEXUALIDAD: Orientación", "SEXUALIDAD: Curiosidad",
                "SEXUALIDAD: Información", "SEXUALIDAD: Actividad", "SEXUALIDAD: Masturbación", "SEXUALIDAD: Promiscuidad",
                "SEXUALIDAD: Disfunciones", "SEXUALIDAD: Erotismo", "SEXUALIDAD: Parafilias", "SEXUALIDAD: Observaciones",
                // EVALUACIÓN AFECTIVA (Resumen)
                "AFECTIVA: Alta sensibilidad", "AFECTIVA: Agresividad", "AFECTIVA: Sumisión", "AFECTIVA: Rabietas",
                "AFECTIVA: Solidaridad", "AFECTIVA: Generosidad", "AFECTIVA: Afectuoso", "AFECTIVA: Angustia",
                "AFECTIVA: Ansiedad situacional", "AFECTIVA: Timidez", "AFECTIVA: Depresión", "AFECTIVA: Irritabilidad",
                // EVALUACIÓN COGNITIVA (Resumen)
                "COGNITIVA: Lucidez", "COGNITIVA: Obnubilación", "COGNITIVA: Estupor", "COGNITIVA: Confusión",
                "COGNITIVA: Hiperprosexia", "COGNITIVA: Hipoprosexia", "COGNITIVA: Ilusiones", "COGNITIVA: Alucinaciones",
                "COGNITIVA: Amnesia fijación", "COGNITIVA: Amnesia evocación", "COGNITIVA: Desorientación tiempo",
                // PENSAMIENTO
                "PENSAMIENTO: Incoherencia", "PENSAMIENTO: Bloqueos", "PENSAMIENTO: Curso Acelerado", "PENSAMIENTO: Fuga ideas",
                "PENSAMIENTO: Grandeza", "PENSAMIENTO: Suicidio", "PENSAMIENTO: Daño", "PENSAMIENTO: Obsesivas",
                "PENSAMIENTO: Autocrítica", "PENSAMIENTO: Conciencia enfermedad",
                // DIAGNÓSTICO
                "DIAGNÓSTICO: Impresión", "DIAGNÓSTICO: Derivación", "DIAGNÓSTICO: Plan tratamiento", "DIAGNÓSTICO: Estrategia",
                "DIAGNÓSTICO: Logro", "DIAGNÓSTICO: Tiempo", "DIAGNÓSTICO: Evaluación"
        };

        return ExcelGenerator.generateExcel("Fichas Psicología Clínica", headers, fichas, (row, f) -> {
            int col = 0;
            // DATOS BÁSICOS
            row.createCell(col++).setCellValue(fmt(f.getId()));
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getNombresApellidos() : "N/A");
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getCedula() : "N/A");
            row.createCell(col++).setCellValue(f.getActivo() != null && f.getActivo() ? "Activa" : "Inactiva");

            // ANAMNESIS
            Anamnesis an = f.getAnamnesis();
            if (an != null) {
                row.createCell(col++).setCellValue(fmt(an.getAnamnesisFamiliar()));
                row.createCell(col++).setCellValue(fmt(an.getPersonal()));
                row.createCell(col++).setCellValue(fmt(an.getMomentosEvolutivosEnElDesarrollo()));
                row.createCell(col++).setCellValue(fmt(an.getHabitosEnLaOralidad()));
            } else {
                col += 4;
            }

            // SUEÑO
            Suenio s = f.getSuenio();
            if (s != null) {
                row.createCell(col++).setCellValue(fmt(s.getInicioHorarioDeSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getFinHorarioDeSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getTipoHorarioDeSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getCompaniaSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getEspecificarCompaniaSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getEdad()));
                row.createCell(col++).setCellValue(fmt(s.getHipersomnia()));
                row.createCell(col++).setCellValue(fmt(s.getDificultadDeConciliarElSuenio()));
                row.createCell(col++).setCellValue(fmt(s.getDespertarFrecuente()));
                row.createCell(col++).setCellValue(fmt(s.getDespertarPrematuro()));
                row.createCell(col++).setCellValue(fmt(s.getSonambulismo()));
                row.createCell(col++).setCellValue(fmt(s.getObservacionesHabitosDeSuenio()));
            } else {
                col += 12;
            }

            // CONDUCTA
            Conducta c = f.getConducta();
            if (c != null) {
                row.createCell(col++).setCellValue(fmt(c.getTemores()));
                row.createCell(col++).setCellValue(fmt(c.getDestructividad()));
                row.createCell(col++).setCellValue(fmt(c.getNerviosismo()));
                row.createCell(col++).setCellValue(fmt(c.getIrritabilidad()));
                row.createCell(col++).setCellValue(fmt(c.getEgocentrismo()));
                row.createCell(col++).setCellValue(fmt(c.getRegresiones()));
                row.createCell(col++).setCellValue(fmt(c.getTics()));
                row.createCell(col++).setCellValue(fmt(c.getHurto()));
                row.createCell(col++).setCellValue(fmt(c.getMentira()));
                row.createCell(col++).setCellValue(fmt(c.getCuidadoPersonal()));
                row.createCell(col++).setCellValue(fmt(c.getOtrosConductasPreocupantes()));
                row.createCell(col++).setCellValue(fmt(c.getObservacionesConductasPreocupantes()));
            } else {
                col += 12;
            }

            // SEXUALIDAD
            Sexualidad sex = f.getSexualidad();
            if (sex != null) {
                row.createCell(col++).setCellValue(fmt(sex.getSexoDeNacimiento()));
                row.createCell(col++).setCellValue(fmt(sex.getGenero()));
                row.createCell(col++).setCellValue(fmt(sex.getOrientacionSexual()));
                row.createCell(col++).setCellValue(fmt(sex.getCuriosidadSexual()));
                row.createCell(col++).setCellValue(fmt(sex.getGradoDeInformacion()));
                row.createCell(col++).setCellValue(fmt(sex.getActividadSexual()));
                row.createCell(col++).setCellValue(fmt(sex.getMasturbacion()));
                row.createCell(col++).setCellValue(fmt(sex.getPromiscuidad()));
                row.createCell(col++).setCellValue(fmt(sex.getDisfunciones()));
                row.createCell(col++).setCellValue(fmt(sex.getErotismo()));
                row.createCell(col++).setCellValue(fmt(sex.getParafilias()));
                row.createCell(col++).setCellValue(fmt(sex.getObservacionesAspectoPsicosexual()));
            } else {
                col += 12;
            }

            // AFECTIVA (Resumen)
            EvaluacionAfectiva ea = f.getEvaluacionAfectiva();
            if (ea != null) {
                row.createCell(col++).setCellValue(fmt(ea.getAltaSensibilidad()));
                row.createCell(col++).setCellValue(fmt(ea.getAgresividadAfectividad()));
                row.createCell(col++).setCellValue(fmt(ea.getSumision()));
                row.createCell(col++).setCellValue(fmt(ea.getRabietas()));
                row.createCell(col++).setCellValue(fmt(ea.getSolidaridad()));
                row.createCell(col++).setCellValue(fmt(ea.getGenerosidad()));
                row.createCell(col++).setCellValue(fmt(ea.getAfectuoso()));
                row.createCell(col++).setCellValue(fmt(ea.getAngustia()));
                row.createCell(col++).setCellValue(fmt(ea.getAnsiedadSituacional()));
                row.createCell(col++).setCellValue(fmt(ea.getTimidez()));
                row.createCell(col++).setCellValue(fmt(ea.getDepresion()));
                row.createCell(col++).setCellValue(fmt(ea.getIrritabilidadAfectividad()));
            } else {
                col += 12;
            }

            // COGNITIVA (Resumen)
            EvaluacionCognitiva ec = f.getEvaluacionCognitiva();
            if (ec != null) {
                row.createCell(col++).setCellValue(fmt(ec.getLucidez()));
                row.createCell(col++).setCellValue(fmt(ec.getObnubilacion()));
                row.createCell(col++).setCellValue(fmt(ec.getEstupor()));
                row.createCell(col++).setCellValue(fmt(ec.getConfusion()));
                row.createCell(col++).setCellValue(fmt(ec.getHipercepcion()));
                row.createCell(col++).setCellValue(fmt(ec.getHipoprosexia()));
                row.createCell(col++).setCellValue(fmt(ec.getIlusiones()));
                row.createCell(col++).setCellValue(fmt(ec.getAlucinaiones()));
                row.createCell(col++).setCellValue(fmt(ec.getAmnesiaDeFijacion()));
                row.createCell(col++).setCellValue(fmt(ec.getAmnesiaDeEvocacion()));
                row.createCell(col++).setCellValue(fmt(ec.getDesorientacionEnTiempo()));
            } else {
                col += 11;
            }

            // PENSAMIENTO
            EvaluacionPensamiento ep = f.getEvaluacionPensamiento();
            if (ep != null) {
                row.createCell(col++).setCellValue(fmt(ep.getIncoherencia()));
                row.createCell(col++).setCellValue(fmt(ep.getBloqueos()));
                row.createCell(col++).setCellValue(fmt(ep.getAceleracion()));
                row.createCell(col++).setCellValue(fmt(ep.getFugaDeIdeas()));
                row.createCell(col++).setCellValue(fmt(ep.getGrandeza()));
                row.createCell(col++).setCellValue(fmt(ep.getSuicidio()));
                row.createCell(col++).setCellValue(fmt(ep.getDanio()));
                row.createCell(col++).setCellValue(fmt(ep.getObsesivas()));
                row.createCell(col++).setCellValue(fmt(ep.getCapacidadDeAutocritica()));
                row.createCell(col++).setCellValue(fmt(ep.getConcienciaDeLaEnfermedad()));
            } else {
                col += 10;
            }

            // DIAGNÓSTICO
            Diagnostico d = f.getDiagnostico();
            if (d != null) {
                row.createCell(col++).setCellValue(fmt(d.getImpresionDiagnostica()));
                row.createCell(col++).setCellValue(fmt(d.getDerivacionInterconsulta()));
                row.createCell(col++).setCellValue(fmt(d.getObjetivoPlanTratamientoIndividual()));
                row.createCell(col++).setCellValue(fmt(d.getEstrategiaDeIntervencion()));
                row.createCell(col++).setCellValue(fmt(d.getIndicadorDeLogro()));
                row.createCell(col++).setCellValue(fmt(d.getTiempoEstimado()));
                row.createCell(col++).setCellValue(fmt(d.getEvaluacion()));
            } else {
                col += 7;
            }
        });
    }

    private String fmt(Object value) {
        if (value == null) return "N/A";
        if (value instanceof Boolean) return (Boolean) value ? "SÍ" : "NO";
        if (value instanceof java.util.Date) return dateFormat.format((java.util.Date) value);
        return value.toString();
    }
}
