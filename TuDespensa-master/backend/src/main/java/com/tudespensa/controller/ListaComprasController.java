package com.tudespensa.controller;

import com.tudespensa.model.ListaCompras;
import com.tudespensa.service.ListaComprasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/listas")
@CrossOrigin(origins = "*")
public class ListaComprasController {

    @Autowired
    private ListaComprasService listaComprasService;

    @GetMapping
    public List<ListaCompras> getAllListas() {
        return listaComprasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListaCompras> getListaById(@PathVariable Integer id) {
        return listaComprasService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ListaCompras createLista(@RequestBody ListaCompras lista) {
        return listaComprasService.save(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLista(@PathVariable Integer id) {
        listaComprasService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Endpoints para productos en lista
    @PostMapping("/{id}/productos")
    public ResponseEntity<Void> agregarProducto(@PathVariable Integer id, @RequestBody ProductoListaRequest request) {
        listaComprasService.agregarProducto(id, request.getIdProductoUsuario(), request.getCantidad());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/productos")
    public List<com.tudespensa.model.DetalleLista> obtenerProductos(@PathVariable Integer id) {
        return listaComprasService.obtenerDetalles(id);
    }

    @DeleteMapping("/productos/{idDetalle}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer idDetalle) {
        listaComprasService.eliminarProducto(idDetalle);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comprar")
    public ResponseEntity<com.tudespensa.model.Pedido> comprarLista(
            @PathVariable Integer id, 
            @RequestParam Integer supermercadoId, 
            @RequestParam Integer metodoPagoId) {
        return ResponseEntity.ok(listaComprasService.comprarLista(id, supermercadoId, metodoPagoId));
    }

    @lombok.Data
    public static class ProductoListaRequest {
        private Integer idProductoUsuario;
        private Integer cantidad;
    }
}
