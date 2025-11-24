package com.tudespensa.controller;

import com.tudespensa.model.Supermercado;
import com.tudespensa.service.SupermercadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supermercados")
@CrossOrigin(origins = "*")
public class SupermercadoController {

    @Autowired
    private SupermercadoService supermercadoService;

    @GetMapping
    public List<Supermercado> getAllSupermercados() {
        return supermercadoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supermercado> getSupermercadoById(@PathVariable Integer id) {
        return supermercadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Supermercado createSupermercado(@RequestBody Supermercado supermercado) {
        return supermercadoService.save(supermercado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupermercado(@PathVariable Integer id) {
        supermercadoService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
