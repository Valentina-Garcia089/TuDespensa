package com.tudespensa.service;

import com.tudespensa.model.Usuario;
import com.tudespensa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario registrarUsuario(Usuario usuario) {
        // Aquí podrías hashear la contraseña antes de guardar
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> login(String correo, String contrasena) {
        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            // Comparación simple (en prod usar BCrypt)
            if (user.getContrasenaHash() != null && user.getContrasenaHash().equals(contrasena)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }
    
    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }
}