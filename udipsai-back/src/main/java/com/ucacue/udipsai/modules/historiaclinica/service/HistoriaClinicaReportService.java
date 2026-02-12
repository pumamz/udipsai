package com.ucacue.udipsai.modules.historiaclinica.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaDTO;
import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;

@Service
public class HistoriaClinicaReportService {

    @Autowired
    private HistoriaClinicaService historiaClinicaService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    public ByteArrayInputStream exportarExcel(Integer pacienteId) throws IOException {
        List<HistoriaClinicaDTO> fichas;
        if (pacienteId != null) {
            HistoriaClinicaDTO ficha = historiaClinicaService.obtenerHistoriaClinicaPorPacienteId(pacienteId);
            fichas = ficha != null ? List.of(ficha) : List.of();
        } else {
            fichas = historiaClinicaService.listarHistoriasClinicas();
        }

        String[] headers = {
                // DATOS BÁSICOS
                "ID", "Paciente", "Cédula", "Estado", "Fecha",
                // INFORMACIÓN GENERAL
                "GENERAL: Viven juntos", "GENERAL: Tipo familia", "GENERAL: Otros familiares en casa",
                // DATOS FAMILIARES
                "FAMILIAR: Nombre Padre", "FAMILIAR: Edad Padre", "FAMILIAR: Nombre Madre", "FAMILIAR: Edad Madre",
                "FAMILIAR: Hermanos", "FAMILIAR: Dirección",
                // PRENATAL
                "PRENATAL: Embarazo deseado", "PRENATAL: Control médico", "PRENATAL: Enfermedades madre",
                "PRENATAL: Emo",
                // NATAL
                "NATAL: Lugar nacimiento", "NATAL: Tipo parto", "NATAL: Lloró al nacer", "NATAL: Peso", "NATAL: Talla",
                // POSTNATAL
                "POSTNATAL: Esquema vacunación", "POSTNATAL: Convulsiones", "POSTNATAL: Medicación",
                // DESARROLLO MOTOR
                "MOTOR: Control cefálico", "MOTOR: Sedestación", "MOTOR: Gateo", "MOTOR: Caminó solo",
                // ALIMENTACIÓN
                "ALIMENTACIÓN: Pecho materno", "ALIMENTACIÓN: Biberón", "ALIMENTACIÓN: Solo cuchara",
                "ALIMENTACIÓN: Dieta fam",
                // ANTECEDENTES MÉDICOS
                "MÉDICOS: Tratamientos", "MÉDICOS: Alergias", "MÉDICOS: Quirúrgicas", "MÉDICOS: Familiares"
        };

        return ExcelGenerator.generateExcel("Historias Clínicas", headers, fichas, (row, f) -> {
            int col = 0;
            // DATOS BÁSICOS
            row.createCell(col++).setCellValue(fmt(f.getId()));
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getNombresApellidos() : "N/A");
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getCedula() : "N/A");
            row.createCell(col++).setCellValue(f.getActivo() != null && f.getActivo() ? "Activa" : "Inactiva");
            row.createCell(col++).setCellValue(fmt(f.getFecha()));

            // INFORMACIÓN GENERAL
            InformacionGeneral ig = f.getInformacionGeneral();
            if (ig != null) {
                row.createCell(col++).setCellValue(fmt(ig.getVivenJuntos()));
                row.createCell(col++).setCellValue(fmt(ig.getTipoFamilia()));
                row.createCell(col++).setCellValue(fmt(ig.getHijosOtrosFamiliaresVivenCasa()));
            } else {
                col += 3;
            }

            // DATOS FAMILIARES
            DatosFamiliares df = f.getDatosFamiliares();
            if (df != null) {
                row.createCell(col++).setCellValue(fmt(df.getNombrePadre()));
                row.createCell(col++).setCellValue(fmt(df.getEdadPadre()));
                row.createCell(col++).setCellValue(fmt(df.getNombreMadre()));
                row.createCell(col++).setCellValue(fmt(df.getEdadMadre()));
                row.createCell(col++).setCellValue(fmt(df.getNumeroHermanos()));
                row.createCell(col++).setCellValue(fmt(df.getDireccionDomiciliaria()));
            } else {
                col += 6;
            }

            // PRENATAL
            HistoriaPrenatal pre = f.getHistoriaPrenatal();
            if (pre != null) {
                row.createCell(col++).setCellValue(fmt(pre.getEmbarazoDeseado()));
                row.createCell(col++).setCellValue(fmt(pre.getControlEmbarazo()));
                row.createCell(col++).setCellValue(fmt(pre.getEnfermedadesMadre()));
                row.createCell(col++).setCellValue(fmt(pre.getEstadoEmocional()));
            } else {
                col += 4;
            }

            // NATAL
            HistoriaNatal nat = f.getHistoriaNatal();
            if (nat != null) {
                row.createCell(col++).setCellValue(fmt(nat.getDondeNacio()));
                row.createCell(col++).setCellValue(fmt(nat.getTipoParto()));
                row.createCell(col++).setCellValue(fmt(nat.getLloroAlNacer()));
                row.createCell(col++).setCellValue(fmt(nat.getPesoAlNacer()));
                row.createCell(col++).setCellValue(fmt(nat.getTallaAlNacer()));
            } else {
                col += 5;
            }

            // POSTNATAL
            HistoriaPostnatal post = f.getHistoriaPostnatal();
            if (post != null) {
                row.createCell(col++).setCellValue(fmt(post.getEsquemaVacunacionCompleto()));
                row.createCell(col++).setCellValue(fmt(post.getConvulsiones()));
                row.createCell(col++).setCellValue(fmt(post.getMedicacion()));
            } else {
                col += 3;
            }

            // MOTOR
            DesarrolloMotor mot = f.getDesarrolloMotor();
            if (mot != null) {
                row.createCell(col++).setCellValue(fmt(mot.getControlCefalico()));
                row.createCell(col++).setCellValue(fmt(mot.getSedestacion()));
                row.createCell(col++).setCellValue(fmt(mot.getGateo()));
                row.createCell(col++).setCellValue(fmt(mot.getCaminaSolo()));
            } else {
                col += 4;
            }

            // ALIMENTACIÓN
            Alimentacion ali = f.getAlimentacion();
            if (ali != null) {
                row.createCell(col++).setCellValue(fmt(ali.getDejoPechoMaterno()));
                row.createCell(col++).setCellValue(fmt(ali.getBiberon()));
                row.createCell(col++).setCellValue(fmt(ali.getAlimentoPorSiSoloCuchara()));
                row.createCell(col++).setCellValue(fmt(ali.getEdadIntegroDietaFamiliar()));
            } else {
                col += 4;
            }

            // MÉDICOS
            AntecedentesMedicos med = f.getAntecedentesMedicos();
            if (med != null) {
                row.createCell(col++).setCellValue(fmt(med.getEnfermedadesConTratamiento()));
                row.createCell(col++).setCellValue(fmt(med.getAlergias()));
                row.createCell(col++).setCellValue(fmt(med.getIntervencionesQuirurgicas()));
                row.createCell(col++).setCellValue(fmt(med.getEnfermedadesDiscapacidadesFamiliares()));
            } else {
                col += 4;
            }
        });
    }

    private String fmt(Object value) {
        if (value == null)
            return "N/A";
        if (value instanceof Boolean)
            return (Boolean) value ? "SÍ" : "NO";
        if (value instanceof java.util.Date)
            return dateFormat.format((java.util.Date) value);
        return value.toString();
    }
}
