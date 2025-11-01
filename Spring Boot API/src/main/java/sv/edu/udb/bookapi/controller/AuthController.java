package sv.edu.udb.bookapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.bookapi.dto.LoginRequestDto;
import sv.edu.udb.bookapi.dto.LoginResponseDto;
import sv.edu.udb.bookapi.dto.RegisterRequestDto;
import sv.edu.udb.bookapi.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Endpoints públicos de autenticación")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Login de usuario", description = "Endpoint público para autenticar usuarios y obtener JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso, devuelve token JWT"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginDto) {
        LoginResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Registro de usuario", description = "Endpoint público para crear una nueva cuenta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existe")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequestDto registerDto) {
        String message = authService.register(registerDto);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}