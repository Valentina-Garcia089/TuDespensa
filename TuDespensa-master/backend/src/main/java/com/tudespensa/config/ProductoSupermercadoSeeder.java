package com.tudespensa.config;

import com.tudespensa.model.*;
import com.tudespensa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

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
        // Limpiar productos existentes para re-seed cada vez que se reinicia la app
        long existing = productoSupermercadoRepository.count();

        if (existing > 0) {
            System.out.println("⚠️ Ya existen " + existing + " productos de supermercado. Saltando seed para preservar integridad de datos.");
            return;
        }

        System.out.println("\n🌟 Seeding productos de supermercado...");

        // Obtener TODOS los supermercados
        List<Supermercado> supermercados = supermercadoRepository.findAll();
        
        if (supermercados.isEmpty()) {
            System.out.println("WARNING: No se encontraron supermercados. Skipping producto seed.");
            return;
        }

        // Obtener categorías
        CategoriaProducto frutasVerduras = categoriaProductoRepository.findById(1).orElse(null);
        CategoriaProducto lacteos = categoriaProductoRepository.findById(2).orElse(null);
        CategoriaProducto carnes = categoriaProductoRepository.findById(3).orElse(null);
        CategoriaProducto panaderia = categoriaProductoRepository.findById(4).orElse(null);
        CategoriaProducto abarrotes = categoriaProductoRepository.findById(5).orElse(null);
        CategoriaProducto bebidas = categoriaProductoRepository.findById(6).orElse(null);
        CategoriaProducto aseoPersonal = categoriaProductoRepository.findById(7).orElse(null);
        CategoriaProducto aseoHogar = categoriaProductoRepository.findById(8).orElse(null);
        CategoriaProducto snacks = categoriaProductoRepository.findById(9).orElse(null);

        // Crear productos en TODOS los supermercados
        for (Supermercado supermercado : supermercados) {
            System.out.println("\n=== Agregando productos a: " + supermercado.getNombreSupermercado() + " ===");
            
            // Ajustar precios levemente según supermercado (Makro más barato, Carulla más caro)
            double factor = 1.0;
            if (supermercado.getNombreSupermercado().equals("Makro")) {
                factor = 0.95; // 5% más barato
            } else if (supermercado.getNombreSupermercado().equals("Carulla")) {
                factor = 1.10; // 10% más caro
            }
            
            // LÁCTEOS
            if (lacteos != null) {
                crearProducto(supermercado, lacteos, "Leche", "Algería", 4200.0 * factor, "Litros", 100);
                crearProducto(supermercado, lacteos, "Leche", "Colanta", 4000.0 * factor, "Litros", 80);
                crearProducto(supermercado, lacteos, "Queso", "Alpina", 12000.0 * factor, "kg", 40);
                crearProducto(supermercado, lacteos, "Yogurt", "Alpina", 3500.0 * factor, "Unidades", 60);
                crearProducto(supermercado, lacteos, "Mantequilla", "Alpina", 6500.0 * factor, "Unidades", 50);
            }
            
            // PANADERÍA
            if (panaderia != null) {
                crearProducto(supermercado, panaderia, "Pan", "Bimbo", 3500.0 * factor, "Unidades", 100);
                crearProducto(supermercado, panaderia, "Pan integral", "Bimbo", 4200.0 * factor, "Unidades", 60);
                crearProducto(supermercado, panaderia, "Tostadas", "Bimbo", 5500.0 * factor, "Unidades", 40);
            }
            
            // ABARROTES
            if (abarrotes != null) {
                crearProducto(supermercado, abarrotes, "Arroz", "Roa", 5500.0 * factor, "kg", 150);
                crearProducto(supermercado, abarrotes, "Arroz", "Diana", 5200.0 * factor, "kg", 120);
                crearProducto(supermercado, abarrotes, "Pasta", "La Muñeca", 3200.0 * factor, "kg", 100);
                crearProducto(supermercado, abarrotes, "Frijol", "Del Campo", 4800.0 * factor, "kg", 80);
                crearProducto(supermercado, abarrotes, "Lenteja", "Del Campo", 4500.0 * factor, "kg", 70);
                crearProducto(supermercado, abarrotes, "Aceite", "Gourmet", 8500.0 * factor, "Litros", 60);
                crearProducto(supermercado, abarrotes, "Sal", "Refisal", 1500.0 * factor, "kg", 100);
                crearProducto(supermercado, abarrotes, "Azúcar", "Manuelita", 3800.0 * factor, "kg", 120);
                crearProducto(supermercado, abarrotes, "Café", "Águila Roja", 9500.0 * factor, "Unidades", 50);
                crearProducto(supermercado, abarrotes, "Atún", "Van Camps", 4200.0 * factor, "Unidades", 90);
                crearProducto(supermercado, abarrotes, "Sardinas", "Isabel", 3500.0 * factor, "Unidades", 70);
            }
            
            // BEBIDAS
            if (bebidas != null) {
                crearProducto(supermercado, bebidas, "Agua", "Cristal", 1800.0 * factor, "Unidades", 250);
                crearProducto(supermercado, bebidas, "Agua", "Brisa", 1600.0 * factor, "Unidades", 200);
                crearProducto(supermercado, bebidas, "Gaseosa", "Coca Cola", 3200.0 * factor, "Litros", 150);
                crearProducto(supermercado, bebidas, "Gaseosa", "Postobón", 2800.0 * factor, "Litros", 140);
                crearProducto(supermercado, bebidas, "Jugo", "Hit", 3500.0 * factor, "Litros", 100);
                crearProducto(supermercado, bebidas, "Jugo", "Del Valle", 4200.0 * factor, "Litros", 80);
            }
            
            // FRUTAS Y VERDURAS
            if (frutasVerduras != null) {
                crearProducto(supermercado, frutasVerduras, "Tomate", "Fresco", 3500.0 * factor, "kg", 80);
                crearProducto(supermercado, frutasVerduras, "Cebolla", "Fresco", 2800.0 * factor, "kg", 100);
                crearProducto(supermercado, frutasVerduras, "Papa", "Fresco", 2500.0 * factor, "kg", 150);
                crearProducto(supermercado, frutasVerduras, "Zanahoria", "Fresco", 2200.0 * factor, "kg", 90);
                crearProducto(supermercado, frutasVerduras, "Plátano", "Fresco", 2000.0 * factor, "kg", 120);
            }
            
            // CARNES
            if (carnes != null) {
                crearProducto(supermercado, carnes, "Pollo", "Fresco", 9500.0 * factor, "kg", 60);
                crearProducto(supermercado, carnes, "Carne res", "Fresco", 18000.0 * factor, "kg", 40);
                crearProducto(supermercado, carnes, "Salchicha", "Zenú", 7500.0 * factor, "Unidades", 70);
                crearProducto(supermercado, carnes, "Jamón", "Zenú", 8500.0 * factor, "Unidades", 60);
                crearProducto(supermercado, carnes, "Huevos", "Santa Reyes", 9500.0 * factor, "Unidades", 100);
            }
            
            // ASEO HOGAR
            if (aseoHogar != null) {
                crearProducto(supermercado, aseoHogar, "Detergente", "Ariel", 12000.0 * factor, "Unidades", 50);
                crearProducto(supermercado, aseoHogar, "Jabón lavar", "Fab", 8500.0 * factor, "Unidades", 60);
                crearProducto(supermercado, aseoHogar, "Limpiador", "Fabuloso", 6500.0 * factor, "Litros", 70);
            }
            
            // ASEO PERSONAL
            if (aseoPersonal != null) {
                crearProducto(supermercado, aseoPersonal, "Jabón", "Dove", 4500.0 * factor, "Unidades", 80);
                crearProducto(supermercado, aseoPersonal, "Shampoo", "Sedal", 9500.0 * factor, "Unidades", 60);
                crearProducto(supermercado, aseoPersonal, "Pasta dental", "Colgate", 5500.0 * factor, "Unidades", 90);
                crearProducto(supermercado, aseoPersonal, "Papel higiénico", "Familia", 12000.0 * factor, "Unidades", 100);
            }
            
            // SNACKS
            if (snacks != null) {
                crearProducto(supermercado, snacks, "Galletas", "Festival", 2500.0 * factor, "Unidades", 120);
                crearProducto(supermercado, snacks, "Papas fritas", "Margarita", 3200.0 * factor, "Unidades", 100);
                crearProducto(supermercado, snacks, "Chocolate", "Jet", 1800.0 * factor, "Unidades", 150);
            }
        }

        System.out.println("\n=== Productos de supermercado seeded exitosamente! ===");
        System.out.println("Total de productos creados: " + productoSupermercadoRepository.count());
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
        System.out.println("  ✓ " + nombre + " " + marca + " ($" + String.format("%.0f", precio) + ")");
    }
}
