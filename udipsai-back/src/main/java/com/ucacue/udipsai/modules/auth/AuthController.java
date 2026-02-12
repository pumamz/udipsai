package com.ucacue.udipsai.modules.auth;

import com.ucacue.udipsai.infrastructure.security.CustomUserDetailsService;
import com.ucacue.udipsai.infrastructure.security.JwtTokenProvider;
import com.ucacue.udipsai.infrastructure.security.RefreshToken;
import com.ucacue.udipsai.infrastructure.security.RefreshTokenService;
import com.ucacue.udipsai.infrastructure.security.dto.JwtResponse;
import com.ucacue.udipsai.infrastructure.security.dto.TokenRefreshRequest;
import com.ucacue.udipsai.infrastructure.security.dto.TokenRefreshResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        JwtTokenProvider tokenProvider;

        @Autowired
        RefreshTokenService refreshTokenService;

        @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
                String username = loginRequest.get("username");
                String password = loginRequest.get("password");

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(username, password));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = tokenProvider.generateToken(authentication);
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());

                RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

                return ResponseEntity.ok(new JwtResponse(jwt,
                                refreshToken.getToken(),
                                0L,
                                userDetails.getUsername(),
                                roles));
        }

        @Autowired
        CustomUserDetailsService userDetailsService;

        @PostMapping("/refresh")
        public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {
                String requestRefreshToken = request.getRefreshToken();

                return refreshTokenService.findByToken(requestRefreshToken)
                                .map(refreshTokenService::verifyExpiration)
                                .map(RefreshToken::getUsername)
                                .map(username -> {
                                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                                        userDetails,
                                                        null,
                                                        userDetails.getAuthorities());

                                        String token = tokenProvider.generateToken(auth);

                                        refreshTokenService.deleteByUsername(username);
                                        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(username);

                                        return ResponseEntity.ok(
                                                        new TokenRefreshResponse(token, newRefreshToken.getToken()));
                                })
                                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
        }
}
