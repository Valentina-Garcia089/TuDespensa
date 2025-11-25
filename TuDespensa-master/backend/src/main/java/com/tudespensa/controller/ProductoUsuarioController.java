package com.tudespensa.controller;

import com.tudespensa.model.ProductoUsuario;
import com.tudespensa.service.ProductoUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoUsuarioController {

    @Autowired
    private ProductoUsuarioService service;

    @GetMapping
    public List<ProductoUsuario> listar(@RequestParam(required = false) Integer usuario_id) {
        if (usuario_id != null) {
            return service.listarPorUsuario(usuario_id);
        }
        return List.of(); // No listar todos por seguridad/diseño
    }

    @PostMapping
    public ProductoUsuario guardar(@RequestBody ProductoUsuario producto) {
        return service.guardarProducto(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminarProducto(id);
    }

    @GetMapping("/debug/categorias")
    public org.springframework.http.ResponseEntity<?> debugCategorias() {
        return org.springframework.http.ResponseEntity.ok(service.listarCategorias());
    }
}