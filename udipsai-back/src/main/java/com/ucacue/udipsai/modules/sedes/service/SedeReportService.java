package com.ucacue.udipsai.modules.sedes.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import com.ucacue.udipsai.modules.sedes.dto.SedeCriteriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class SedeReportService {

    @Autowired
    private SedeService sedeService;

    public ByteArrayInputStream exportarExcel(SedeCriteriaDTO criteria) throws IOException {
        List<Sede> sedes = sedeService.listarSedesSinPaginacion(criteria);

        String[] headers = {"ID", "Nombre", "Activo"};

        return ExcelGenerator.generateExcel("Sedes", headers, sedes, (row, s) -> {
            row.createCell(0).setCellValue(s.getId());
            row.createCell(1).setCellValue(s.getNombre());
            row.createCell(2).setCellValue(s.getActivo() ? "Sí" : "No");
        });
    }
}
