package com.ucacue.udipsai.common.util;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import java.io.*;
import java.util.Base64;
import java.util.zip.GZIPOutputStream;
import java.util.zip.GZIPInputStream;

@Service
@Slf4j
public class ImagenService {

    private static final String IMAGE_DIRECTORY = System.getProperty("user.home") + "/UdipsaiImagenesPacientes/";
    private static final String ESPECIALISTAS_DIRECTORY = System.getProperty("user.home")
            + "/UdipsaiEspecialistasImagenes/";

    public String saveCompressedImage(String base64Image, String fileName) throws IOException {
        return saveCompressedImageInDirectory(base64Image, fileName, IMAGE_DIRECTORY);
    }

    public String saveCompressedImageForEspecialistas(String base64Image, String fileName) throws IOException {
        return saveCompressedImageInDirectory(base64Image, fileName, ESPECIALISTAS_DIRECTORY);
    }

    private String saveCompressedImageInDirectory(String base64Image, String fileName, String directoryPath)
            throws IOException {
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            boolean created = directory.mkdirs(); 
            if (!created) {
                throw new IOException("No se pudo crear el directorio: " + directoryPath);
            }
        }

        byte[] decodedBytes = Base64.getDecoder().decode(base64Image);

        File compressedFile = new File(directoryPath + fileName + ".txt.gz");
        try (FileOutputStream fos = new FileOutputStream(compressedFile);
                GZIPOutputStream gzipOut = new GZIPOutputStream(fos)) {
            gzipOut.write(decodedBytes);
        }

        return compressedFile.getAbsolutePath(); 
    }

    public String getDecompressedImage(String compressedFilePath) throws IOException {
        File compressedFile = new File(compressedFilePath);
        if (!compressedFile.exists()) {
            throw new FileNotFoundException("El archivo comprimido no existe: " + compressedFilePath);
        }

        try (FileInputStream fis = new FileInputStream(compressedFile);
                GZIPInputStream gzipIn = new GZIPInputStream(fis);
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int len;
            while ((len = gzipIn.read(buffer)) > 0) {
                byteArrayOutputStream.write(buffer, 0, len);
            }

            byte[] decompressedBytes = byteArrayOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(decompressedBytes);

        } catch (IOException e) {
            log.error("Error al descomprimir la imagen", e);
            throw new IOException("Error al descomprimir la imagen", e);
        }
    }
}
