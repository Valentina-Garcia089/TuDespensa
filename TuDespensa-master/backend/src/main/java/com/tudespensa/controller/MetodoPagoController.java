package com.tudespensa.controller;

import com.tudespensa.model.MetodoPago;
import com.tudespensa.service.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/metodos-pago")
@CrossOrigin(origins = "*")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoService service;

    @GetMapping
    public List<MetodoPago> listar(@RequestParam Integer usuario_id) {
        return service.listarPorUsuario(usuario_id);
    }

    @PostMapping
    public MetodoPago crear(@RequestBody MetodoPago metodo) {
        return service.guardar(metodo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
