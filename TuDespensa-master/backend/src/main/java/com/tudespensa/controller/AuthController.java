
package com.tudespensa.controller;

import com.tudespensa.model.Usuario;
import com.tudespensa.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/*
 Endpoints:
 POST /api/register  -> { nombre, correo, contrasena }
 POST /api/login     -> { correo, contrasena }
*/

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            // Validar que el correo no esté vacío
            if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El correo es obligatorio"));
            }
            
            // Validar que la contraseña no esté vacía
            if (usuario.getContrasenaHash() == null || usuario.getContrasenaHash().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "La contraseña es obligatoria"));
            }
            
            // Verificar si el correo ya existe
            if (usuarioService.existeCorreo(usuario.getCorreo())) {
                return ResponseEntity.badRequest().body(Map.of("message", "El correo ya está registrado"));
            }
            
            Usuario nuevo = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado", "id", nuevo.getIdUsuario()));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Capturar violaciones de constraint (ej: correo duplicado)
            return ResponseEntity.badRequest().body(Map.of("message", "El correo ya está registrado"));
        } catch (Exception e) {
            e.printStackTrace(); // Log para debugging
            return ResponseEntity.badRequest().body(Map.of("message", "Error al registrar. Por favor intenta con otro correo."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String contrasena = credenciales.get("contrasena");

        Optional<Usuario> usuario = usuarioService.login(correo, contrasena);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales inválidas"));
        }
    }
}
