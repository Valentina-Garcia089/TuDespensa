package com.tudespensa.config;

import com.tudespensa.model.CategoriaProducto;
import com.tudespensa.repository.CategoriaProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(CategoriaProductoRepository categoriaRepository) {
        return args -> {
            if (categoriaRepository.count() == 0) {
                List<CategoriaProducto> categorias = List.of(
                    new CategoriaProducto(null, "Frutas y Verduras", "Productos frescos del campo"),
                    new CategoriaProducto(null, "Lácteos", "Leche, quesos, yogures y derivados"),
                    new CategoriaProducto(null, "Carnes y Pescados", "Proteínas animales frescas y congeladas"),
                    new CategoriaProducto(null, "Panadería", "Pan, pasteles y productos horneados"),
                    new CategoriaProducto(null, "Abarrotes", "Productos no perecederos de despensa"),
                    new CategoriaProducto(null, "Bebidas", "Jugos, gaseosas, agua y bebidas"),
                    new CategoriaProducto(null, "Aseo Personal", "Productos de higiene y cuidado personal"),
                    new CategoriaProducto(null, "Aseo Hogar", "Productos de limpieza para el hogar"),
                    new CategoriaProducto(null, "Snacks", "Dulces, galletas y aperitivos"),
                    new CategoriaProducto(null, "Congelados", "Productos conservados en frío")
                );
                categoriaRepository.saveAll(categorias);
                System.out.println("Categorías iniciales cargadas correctamente.");
            }
        };
    }
}
