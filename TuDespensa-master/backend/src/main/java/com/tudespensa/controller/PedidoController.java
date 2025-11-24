package com.tudespensa.controller;

import com.tudespensa.model.*;
import com.tudespensa.service.GestorPedidos;
import com.tudespensa.service.PedidoService;
import com.tudespensa.repository.UsuarioRepository;
import com.tudespensa.repository.SupermercadoRepository;
import com.tudespensa.repository.MetodoPagoRepository;
import com.tudespensa.repository.ProductoSupermercadoRepository;
import com.tudespensa.repository.ProductoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @Autowired
    private GestorPedidos gestorPedidos;

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private SupermercadoRepository supermercadoRepository;
    @Autowired
    private MetodoPagoRepository metodoPagoRepository;
    @Autowired
    private ProductoSupermercadoRepository productoSupermercadoRepository;
    @Autowired
    private ProductoUsuarioRepository productoUsuarioRepository;

    @PostMapping
    public Pedido crear(@RequestBody PedidoRequest request) {
        System.out.println("=== CREANDO PEDIDO ===");
        System.out.println("Request: " + request);
        
        try {
            // Recuperar entidades
            Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + request.getIdUsuario()));
            System.out.println("Usuario encontrado: " + usuario.getNombre());
            
            Supermercado supermercado = supermercadoRepository.findById(request.getIdSupermercado())
                    .orElseThrow(() -> new RuntimeException("Supermercado no encontrado: " + request.getIdSupermercado()));
            System.out.println("Supermercado encontrado: " + supermercado.getNombreSupermercado());
            
            MetodoPago metodoPago = metodoPagoRepository.findById(request.getIdMetodoPago())
                    .orElseThrow(() -> new RuntimeException("Método de pago no encontrado: " + request.getIdMetodoPago()));
            System.out.println("Método de pago encontrado: " + metodoPago.getTipoPago());

            List<ProductoSupermercado> productos = new ArrayList<>();
            List<Integer> cantidades = new ArrayList<>();

            if (request.getDetalles() != null) {
                System.out.println("Procesando " + request.getDetalles().size() + " detalles");
                
                for (DetalleRequest det : request.getDetalles()) {
                    System.out.println("Procesando detalle - ID Producto: " + det.getIdProducto() + ", Cantidad: " + det.getCantidad());
                    ProductoSupermercado prod = null;

                    // 1. Intentar buscar como ProductoUsuario (desde la despensa)
                    if (productoUsuarioRepository.existsById(det.getIdProducto())) {
                        ProductoUsuario prodUsuario = productoUsuarioRepository.findById(det.getIdProducto()).get();
                        System.out.println("ProductoUsuario encontrado: " + prodUsuario.getNombreProducto() + " - " + prodUsuario.getMarca());
                        
                        // Buscar equivalentes en el supermercado seleccionado
                        List<ProductoSupermercado> equivalentes = productoSupermercadoRepository
                                .findBySupermercadoIdSupermercadoAndNombreProductoContainingIgnoreCaseAndMarcaContainingIgnoreCase(
                                        supermercado.getIdSupermercado(), 
                                        prodUsuario.getNombreProducto(), 
                                        prodUsuario.getMarca() != null ? prodUsuario.getMarca() : ""
                                );
                        
                        System.out.println("Equivalentes encontrados: " + equivalentes.size());
                        if (!equivalentes.isEmpty()) {
                            prod = equivalentes.get(0); // Tomamos el primero que coincida
                            System.out.println("Producto equivalente seleccionado: " + prod.getNombreProducto());
                        } else {
                            System.out.println("WARNING: No se encontró producto equivalente en supermercado para: " + prodUsuario.getNombreProducto());
                        }
                    }

                    // 2. Si no se encontró como ProductoUsuario o no hubo match, buscar como ID directo de ProductoSupermercado
                    if (prod == null) {
                        System.out.println("Intentando buscar como ProductoSupermercado directo...");
                        prod = productoSupermercadoRepository.findById(det.getIdProducto()).orElse(null);
                        if (prod != null) {
                            System.out.println("ProductoSupermercado encontrado directamente: " + prod.getNombreProducto());
                        }
                    }
                    
                    if (prod != null) {
                        productos.add(prod);
                        cantidades.add(det.getCantidad());
                        System.out.println("Producto agregado al pedido: " + prod.getNombreProducto());
                    } else {
                        System.out.println("ERROR: No se pudo encontrar producto con ID: " + det.getIdProducto());
                    }
                }
            }
            
            if (productos.isEmpty()) {
                throw new RuntimeException("No se encontraron productos válidos para el pedido. Asegúrese de que los productos existan en el supermercado seleccionado.");
            }
            
            System.out.println("Total de productos a agregar al pedido: " + productos.size());
            Pedido pedido = gestorPedidos.crearPedido(usuario, supermercado, metodoPago, productos, cantidades);
            System.out.println("Pedido creado exitosamente con ID: " + pedido.getIdPedido());
            return pedido;
            
        } catch (Exception e) {
            System.err.println("ERROR al crear pedido: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    public List<Pedido> listar(
            @RequestParam Integer usuario_id,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate
    ) {
        List<Pedido> pedidos = service.listarPorUsuario(usuario_id);
        
        if (startDate != null && endDate != null) {
            return pedidos.stream()
                    .filter(p -> !p.getFechaPedido().toLocalDate().isBefore(startDate) && !p.getFechaPedido().toLocalDate().isAfter(endDate))
                    .collect(java.util.stream.Collectors.toList());
        }
        return pedidos;
    }

    @GetMapping("/{id}")
    public Pedido obtener(@PathVariable Integer id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Pedido actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Pedido pedido = service.buscarPorId(id).orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstadoPedido(estado);
        return service.guardarPedido(pedido);
    }

    // DTOs internos
    @lombok.Data
    public static class PedidoRequest {
        private Integer idUsuario;
        private Integer idSupermercado;
        private Integer idMetodoPago;
        private List<DetalleRequest> detalles;
    }

    @lombok.Data
    public static class DetalleRequest {
        private Integer idProducto; // ID ProductoSupermercado o ProductoUsuario
        private Integer cantidad;
    }
}