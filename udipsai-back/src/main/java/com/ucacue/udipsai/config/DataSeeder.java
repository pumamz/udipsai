package com.ucacue.udipsai.config;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.permisos.Permisos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (especialistaRepository.count() == 0) {
            Permisos adminPermisos = new Permisos();
            adminPermisos.setPacientes(true);
            adminPermisos.setPacientesCrear(true);
            adminPermisos.setPacientesEditar(true);
            adminPermisos.setPacientesEliminar(true);
            adminPermisos.setPasantes(true);
            adminPermisos.setPasantesCrear(true);
            adminPermisos.setPasantesEditar(true);
            adminPermisos.setPasantesEliminar(true);
            adminPermisos.setSedes(true);
            adminPermisos.setSedesCrear(true);
            adminPermisos.setSedesEditar(true);
            adminPermisos.setSedesEliminar(true);
            adminPermisos.setEspecialistas(true);
            adminPermisos.setEspecialistasCrear(true);
            adminPermisos.setEspecialistasEditar(true);
            adminPermisos.setEspecialistasEliminar(true);
            adminPermisos.setEspecialidades(true);
            adminPermisos.setEspecialidadesCrear(true);
            adminPermisos.setEspecialidadesEditar(true);
            adminPermisos.setEspecialidadesEliminar(true);
            adminPermisos.setAsignaciones(true);
            adminPermisos.setAsignacionesCrear(true);
            adminPermisos.setAsignacionesEditar(true);
            adminPermisos.setAsignacionesEliminar(true);
            adminPermisos.setRecursos(true);
            adminPermisos.setRecursosCrear(true);
            adminPermisos.setRecursosEditar(true);
            adminPermisos.setRecursosEliminar(true);
            adminPermisos.setInstitucionesEducativas(true);
            adminPermisos.setInstitucionesEducativasCrear(true);
            adminPermisos.setInstitucionesEducativasEditar(true);
            adminPermisos.setInstitucionesEducativasEliminar(true);
            adminPermisos.setHistoriaClinica(true);
            adminPermisos.setHistoriaClinicaCrear(true);
            adminPermisos.setHistoriaClinicaEditar(true);
            adminPermisos.setHistoriaClinicaEliminar(true);
            adminPermisos.setFonoAudiologia(true);
            adminPermisos.setFonoAudiologiaCrear(true);
            adminPermisos.setFonoAudiologiaEditar(true);
            adminPermisos.setFonoAudiologiaEliminar(true);
            adminPermisos.setPsicologiaClinica(true);
            adminPermisos.setPsicologiaClinicaCrear(true);
            adminPermisos.setPsicologiaClinicaEditar(true);
            adminPermisos.setPsicologiaClinicaEliminar(true);
            adminPermisos.setPsicologiaEducativa(true);
            adminPermisos.setPsicologiaEducativaCrear(true);
            adminPermisos.setPsicologiaEducativaEditar(true);
            adminPermisos.setPsicologiaEducativaEliminar(true);
            adminPermisos.setCitas(true);
            adminPermisos.setCitasCrear(true);
            adminPermisos.setCitasEditar(true);
            adminPermisos.setCitasEliminar(true);

            Especialista admin = new Especialista();
            admin.setCedula("0101010101");
            admin.setNombresApellidos("Admin");
            admin.setContrasenia(passwordEncoder.encode("admin123"));
            admin.setActivo(true);
            admin.setPermisos(adminPermisos);

            especialistaRepository.save(admin);
            System.out.println("------------------------------------------------");
            System.out.println("ADMINISTRADOR INICIAL CREADO CON PERMISOS");
            System.out.println("Cédula: 0101010101");
            System.out.println("Contraseña: admin123");
            System.out.println("------------------------------------------------");
        }
    }
}
