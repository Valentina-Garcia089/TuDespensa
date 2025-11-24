package com.tudespensa.controller;

import com.tudespensa.model.PedidoProgramado;
import com.tudespensa.service.PedidoProgramadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos-programados")
@CrossOrigin(origins = "*")
public class PedidoProgramadoController {

    @Autowired
    private PedidoProgramadoService service;

    @GetMapping
    public List<PedidoProgramado> listar(@RequestParam Integer usuario_id) {
        return service.listarPorUsuario(usuario_id);
    }

    @PostMapping
    public PedidoProgramado crear(@RequestBody PedidoProgramado pedido) {
        return service.guardar(pedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
