package com.ucacue.udipsai.modules.documentos.service;

import com.ucacue.udipsai.modules.documentos.domain.Documento;
import com.ucacue.udipsai.modules.documentos.repository.DocumentoRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Service
@Slf4j
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private StorageService storageService;

    public Optional<Documento> obtenerDocumentoPorId(Integer id) {
        log.debug("Buscando documento por ID: {}", id);
        return documentoRepository.findById(id);
    }

    public Documento crearDocumento(MultipartFile file, Integer pacienteId, String nombre) {
        log.info("Iniciando creación de documento para Paciente ID: {}, Nombre: {}", pacienteId, nombre);
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> {
                    log.error("Error al crear documento: Paciente ID {} no encontrado", pacienteId);
                    return new RuntimeException("Paciente no encontrado con ID: " + pacienteId);
                });

        String filename = storageService.store(file);
        log.info("Archivo almacenado con nombre: {}", filename);

        Documento documento = new Documento();
        documento.setUrl(filename);
        documento.setNombre(nombre != null ? nombre : file.getOriginalFilename());
        documento.setPaciente(paciente);
        documento.setActivo(true);
        Documento savedDoc = documentoRepository.save(documento);
        log.info("Documento guardado en base de datos con ID: {}", savedDoc.getId());

        return savedDoc;
    }


    public Resource cargarDocumentoComoRecurso(Integer id) {
        log.info("Cargando recurso de documento ID: {}", id);
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error al cargar recurso: Documento ID {} no encontrado", id);
                    return new RuntimeException("Documento no encontrado con ID: " + id);
                });
        return storageService.loadAsResource(documento.getUrl());
    }

    @Transactional
    public void eliminarDocumento(Integer id) {
        log.info("Solicitud para eliminar documento ID: {}", id);
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error al eliminar: Documento ID {} no encontrado", id);
                    return new RuntimeException("Documento no encontrado con ID: " + id);
                });

        documento.setActivo(false);
        documentoRepository.save(documento);
        log.info("Documento ID {} marcado como inactivo (eliminado)", id);
    }
}
