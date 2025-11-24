package com.tudespensa.config;

import com.tudespensa.model.MetodoPago;
import com.tudespensa.model.Usuario;
import com.tudespensa.repository.MetodoPagoRepository;
import com.tudespensa.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3) // Después de supermercados y productos
public class MetodoPagoSeeder implements CommandLineRunner {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) {
        if (metodoPagoRepository.count() > 0) {
            System.out.println("Métodos de pago ya existen. Skipping seed.");
            return;
        }

        System.out.println("Seeding métodos de pago...");

        // Buscar el primer usuario (Carlos)
        Usuario usuario = usuarioRepository.findById(1).orElse(null);
        if (usuario == null) {
            System.out.println("WARNING: No se encontró usuario con ID 1. Skipping método de pago seed.");
            return;
        }

        // Crear método de pago por defecto - Efectivo
        MetodoPago efectivo = new MetodoPago();
        efectivo.setUsuario(usuario);
        efectivo.setTipoPago("Efectivo");
        efectivo.setUltimosDigitos(null);
        efectivo.setActivo(true);
        metodoPagoRepository.save(efectivo);
        System.out.println("  - Creado: Efectivo para " + usuario.getNombre());

        System.out.println("Métodos de pago seeded exitosamente!");
    }
}
