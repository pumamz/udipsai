package com.ucacue.udipsai.modules.recurso.service;

import com.ucacue.udipsai.modules.recurso.domain.Recurso;
import com.ucacue.udipsai.modules.recurso.repository.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class RecursoService {
    @Autowired
    private RecursoRepository recursoRepository;

    private final Path rootLocation;

    public RecursoService(@Value("${app.storage.location:uploads}") String storageLocation) {
        this.rootLocation = Paths.get(storageLocation);
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public Path cargarArchivo(String nombreArchivo) {
        return rootLocation.resolve(nombreArchivo);
    }

    public List<Recurso> listarTodos() {
        return recursoRepository.findAll();
    }

    public Recurso guardarConArchivo(Recurso recurso, MultipartFile archivo) throws IOException {
        String nombreUnico = UUID.randomUUID().toString() + "-" + archivo.getOriginalFilename();
        Files.copy(archivo.getInputStream(), this.rootLocation.resolve(nombreUnico));

        recurso.setArchivoNombre(archivo.getOriginalFilename());
        recurso.setArchivoUrl(nombreUnico);

        return recursoRepository.save(recurso);
    }

    public Recurso reemplazarArchivo(Long id, MultipartFile nuevoArchivo) throws IOException {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado"));

        if (recurso.getArchivoUrl() != null) {
            try {
                Files.deleteIfExists(this.rootLocation.resolve(recurso.getArchivoUrl()));
            } catch (IOException e) {
                System.err.println("No se pudo borrar el archivo viejo");
            }
        }

        String nombreUnico = UUID.randomUUID().toString() + "-" + nuevoArchivo.getOriginalFilename();
        Files.copy(nuevoArchivo.getInputStream(),
                this.rootLocation.resolve(nombreUnico),
                StandardCopyOption.REPLACE_EXISTING);

        recurso.setArchivoNombre(nuevoArchivo.getOriginalFilename());
        recurso.setArchivoUrl(nombreUnico);

        return recursoRepository.save(recurso);
    }

    public void eliminar(Long id) {
        Recurso r = recursoRepository.findById(id).orElse(null);
        if (r != null && r.getArchivoUrl() != null) {
            try {
                Files.deleteIfExists(this.rootLocation.resolve(r.getArchivoUrl()));
            } catch (IOException e) {
            }
        }
        recursoRepository.deleteById(id);
    }
}