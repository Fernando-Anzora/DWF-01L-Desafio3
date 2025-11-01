package sv.edu.udb.bookapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.bookapi.dto.LoginRequestDto;
import sv.edu.udb.bookapi.dto.LoginResponseDto;
import sv.edu.udb.bookapi.dto.RegisterRequestDto;
import sv.edu.udb.bookapi.model.User;
import sv.edu.udb.bookapi.repository.UserRepository;
import sv.edu.udb.bookapi.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public LoginResponseDto login(LoginRequestDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new LoginResponseDto(token, user.getUsername(), user.getEmail(), user.getRole());
    }

    @Transactional
    public String register(RegisterRequestDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("El username ya está en uso");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("El email ya está en uso");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "Usuario registrado exitosamente";
    }
}