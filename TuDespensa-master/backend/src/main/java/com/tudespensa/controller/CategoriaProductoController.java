package com.tudespensa.controller;

import com.tudespensa.model.CategoriaProducto;
import com.tudespensa.service.CategoriaProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaProductoController {

    @Autowired
    private CategoriaProductoService service;

    @GetMapping
    public List<CategoriaProducto> getAllCategorias() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaProducto> getCategoriaById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CategoriaProducto createCategoria(@RequestBody CategoriaProducto categoria) {
        return service.save(categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Integer id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
