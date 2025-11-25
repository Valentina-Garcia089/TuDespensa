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
        System.out.println("Recibiendo método de pago: " + metodo); // DEBUG
        
        if (metodo.getUsuario() == null || metodo.getUsuario().getIdUsuario() == null) {
            throw new RuntimeException("Error: El usuario es obligatorio para crear un método de pago.");
        }

        // Verificar si el usuario existe realmente
        // Esto previene el error de integridad de datos si el ID no existe en la BD
        // Nota: Idealmente inyectar UsuarioRepository, pero por ahora confiamos en el Service o Repository de MetodoPago
        // Si falla, será con un mensaje más claro.
        
        try {
            return service.guardar(metodo);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("Error de integridad de datos. Posiblemente el usuario con ID " + 
                metodo.getUsuario().getIdUsuario() + " no existe o hay datos duplicados.");
        }
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        try {
            service.eliminar(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error al eliminar método de pago: " + e.getMessage());
        }
    }
}
