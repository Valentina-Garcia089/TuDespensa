package com.tudespensa.controller;

import com.tudespensa.model.ProductoSupermercado;
import com.tudespensa.repository.ProductoSupermercadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos-supermercado")
@CrossOrigin(origins = "*")
public class ProductoSupermercadoController {

    @Autowired
    private ProductoSupermercadoRepository repository;

    @GetMapping("/buscar")
    public List<ProductoSupermercado> buscar(
            @RequestParam Integer supermercado_id,
            @RequestParam String nombre,
            @RequestParam(required = false,defaultValue = "") String marca) {
        
        return repository.findBySupermercadoIdSupermercadoAndNombreProductoContainingIgnoreCaseAndMarcaContainingIgnoreCase(
                supermercado_id, nombre, marca);
    }
}
