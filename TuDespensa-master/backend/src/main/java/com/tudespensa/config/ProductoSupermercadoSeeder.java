package com.tudespensa.config;

import com.tudespensa.model.*;
import com.tudespensa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@Order(2) // Ejecutar después del DataSeeder original
public class ProductoSupermercadoSeeder implements CommandLineRunner {

    @Autowired
    private ProductoSupermercadoRepository productoSupermercadoRepository;
    
    @Autowired
    private SupermercadoRepository supermercadoRepository;
    
    @Autowired
    private CategoriaProductoRepository categoriaProductoRepository;

    @Override
    public void run(String... args) {
        if (productoSupermercadoRepository.count() > 0) {
            System.out.println("Productos de supermercado ya existen. Skipping seed.");
            return;
        }

        System.out.println("Seeding productos de supermercado...");

        // Obtener supermercados y categorías
        Supermercado makro = supermercadoRepository.findById(1).orElse(null);
        Supermercado exito = supermercadoRepository.findById(2).orElse(null);
        CategoriaProducto alimentos = categoriaProductoRepository.findById(1).orElse(null);
        CategoriaProducto bebidas = categoriaProductoRepository.findById(2).orElse(null);

        if (makro == null || exito == null || alimentos == null || bebidas == null) {
            System.out.println("WARNING: Supermercados o categorías no encontrados. Skipping producto seed.");
            return;
        }

        // Productos de Makro
        crearProducto(makro, alimentos, "Leche", "Algería", 2500.0, "Litros", 100);
        crearProducto(makro, alimentos, "Pan", "Bimbo", 3500.0, "Unidades", 50);
        crearProducto(makro, bebidas, "Agua", "Cristal", 1500.0, "Unidades", 200);
        crearProducto(makro, alimentos, "Arroz", "Diana", 4500.0, "kg", 80);
        crearProducto(makro, bebidas, "Jugo", "Hit", 2800.0, "Litros", 60);

        // Productos de Éxito  
        crearProducto(exito, alimentos, "Leche", "Algería", 2600.0, "Litros", 100);
        crearProducto(exito, alimentos, "Pan", "Bimbo", 3700.0, "Unidades", 50);
        crearProducto(exito, bebidas, "Agua", "Cristal", 1600.0, "Unidades", 200);
        crearProducto(exito, alimentos, "Huevos", "Santa Reyes", 8500.0, "Unidades", 40);
        crearProducto(exito, bebidas, "Gaseosa", "Coca Cola", 3200.0, "Litros", 70);

        System.out.println("Productos de supermercado seeded exitosamente!");
    }

    private void crearProducto(Supermercado supermercado, CategoriaProducto categoria, 
                                String nombre, String marca, Double precio, 
                                String unidad, Integer cantidadDisponible) {
        ProductoSupermercado producto = new ProductoSupermercado();
        producto.setSupermercado(supermercado);
        producto.setCategoria(categoria);
        producto.setNombreProducto(nombre);
        producto.setMarca(marca);
        producto.setPrecio(new BigDecimal(precio.toString()));
        producto.setUnidadMedida(unidad);
        producto.setCantidadDisponible(cantidadDisponible);
        producto.setActivo(true);
        
        productoSupermercadoRepository.save(producto);
        System.out.println("  - Creado: " + marca + " " + nombre + " ($" + precio + ") en " + supermercado.getNombreSupermercado());
    }
}
