package com.tudespensa.config;

import com.tudespensa.model.Supermercado;
import com.tudespensa.repository.SupermercadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Ejecutar PRIMERO, antes de ProductoSupermercadoSeeder
public class SupermercadoSeeder implements CommandLineRunner {

    @Autowired
    private SupermercadoRepository supermercadoRepository;

    @Override
    public void run(String... args) {
        if (supermercadoRepository.count() > 0) {
            System.out.println("Supermercados ya existen. Skipping seed.");
            return;
        }

        System.out.println("Seeding supermercados...");

        // Crear Makro
        Supermercado makro = new Supermercado();
        makro.setNombreSupermercado("Makro");
        makro.setDireccion("Calle 80 # 69B-15, Bogotá");
        makro.setTelefono("601-7437000");
        makro.setCorreo("contacto@makro.com.co");
        makro.setActivo(true);
        supermercadoRepository.save(makro);
        System.out.println("  - Creado: Makro");

        // Crear Éxito
        Supermercado exito = new Supermercado();
        exito.setNombreSupermercado("Éxito");
        exito.setDireccion("Carrera 7 # 32-16, Bogotá");
        exito.setTelefono("601-3779000");
        exito.setCorreo("servicioalcliente@exito.com.co");
        exito.setActivo(true);
        supermercadoRepository.save(exito);
        System.out.println("  - Creado: Éxito");

        // Crear Carulla
        Supermercado carulla = new Supermercado();
        carulla.setNombreSupermercado("Carulla");
        carulla.setDireccion("Avenida 19 # 104A-55, Bogotá");
        carulla.setTelefono("601-3779000");
        carulla.setCorreo("atencion@carulla.com");
        carulla.setActivo(true);
        supermercadoRepository.save(carulla);
        System.out.println("  - Creado: Carulla");

        System.out.println("Supermercados seeded exitosamente!");
    }
}
