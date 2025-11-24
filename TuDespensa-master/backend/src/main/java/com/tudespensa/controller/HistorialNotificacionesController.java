package com.tudespensa.controller;

import com.tudespensa.model.HistorialNotificaciones;
import com.tudespensa.service.HistorialNotificacionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificaciones")
@CrossOrigin(origins = "*")
public class HistorialNotificacionesController {

    @Autowired
    private HistorialNotificacionesService service;

    @GetMapping
    public List<HistorialNotificaciones> listar(@RequestParam Integer usuario_id) {
        return service.listarPorUsuario(usuario_id);
    }

    @PostMapping
    public HistorialNotificaciones crear(@RequestBody HistorialNotificaciones notificacion) {
        return service.guardar(notificacion);
    }
}