package com.ucacue.udipsai.modules.especialidad.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadCriteriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class EspecialidadReportService {

    @Autowired
    private EspecialidadService especialidadService;

    public ByteArrayInputStream exportarExcel(EspecialidadCriteriaDTO criteria) throws IOException {
        List<Especialidad> especialidades = especialidadService.listarEspecialidadesSinPaginacion(criteria);

        String[] headers = {"ID", "Área", "Activo"};

        return ExcelGenerator.generateExcel("Especialidades", headers, especialidades, (row, e) -> {
            row.createCell(0).setCellValue(e.getId());
            row.createCell(1).setCellValue(e.getArea());
            row.createCell(2).setCellValue(e.getActivo() ? "Sí" : "No");
        });
    }
}
