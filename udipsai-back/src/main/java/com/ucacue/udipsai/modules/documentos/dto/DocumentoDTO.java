package com.ucacue.udipsai.modules.documentos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoDTO {
    private Integer id;
    private String url;
    private String nombre;

}
