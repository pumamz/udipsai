package com.ucacue.udipsai.infrastructure.security;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Especialista> especialista = especialistaRepository.findByCedula(username);
        if (especialista.isPresent()) {
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_ESPECIALISTA"));
            if (especialista.get().getPermisos() != null) {
                authorities.addAll(especialista.get().getPermisos().getAuthorities());
            }
            return UserPrincipal.create(
                    especialista.get().getCedula(),
                    especialista.get().getNombresApellidos(),
                    especialista.get().getContrasenia(),
                    authorities
            );
        }

        Optional<Pasante> pasante = pasanteRepository.findByCedula(username);
        if (pasante.isPresent()) {
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_PASANTE"));
             if (pasante.get().getPermisos() != null) {
                authorities.addAll(pasante.get().getPermisos().getAuthorities());
            }
            return UserPrincipal.create(
                    pasante.get().getCedula(),
                    pasante.get().getNombresApellidos(),
                    pasante.get().getContrasenia(),
                    authorities
            );
        }

        throw new UsernameNotFoundException("Usuario no encontrado con cédula: " + username);
    }
}
