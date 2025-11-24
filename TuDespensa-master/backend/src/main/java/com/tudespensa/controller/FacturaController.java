package com.tudespensa.controller;

import com.tudespensa.model.Factura;
import com.tudespensa.model.Pedido;
import com.tudespensa.service.FacturaService;
import com.tudespensa.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/facturas")
@CrossOrigin(origins = "*")
public class FacturaController {

    @Autowired
    private FacturaService service;
    
    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public Factura crear(@RequestBody Factura factura) {
        return service.guardarFactura(factura);
    }

    @GetMapping("/{id}")
    public Factura obtener(@PathVariable Integer id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Factura actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        Factura factura = service.buscarPorId(id).orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        factura.setEstadoFactura(estado);
        return service.guardarFactura(factura);
    }

    @GetMapping("/{pedidoId}/descargar")
    public org.springframework.http.ResponseEntity<String> descargarFactura(@PathVariable Integer pedidoId) {
        // Buscar el pedido
        Pedido pedido = pedidoService.buscarPorId(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + pedidoId));
        
        // Generar factura HTML simple
        StringBuilder sb = new StringBuilder();
        sb.append("<html><head><style>");
        sb.append("body { font-family: Arial; margin: 20px; }");
        sb.append("h1 { color: #3498db; }");
        sb.append("table { border-collapse: collapse; width: 100%; margin: 20px 0; }");
        sb.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
        sb.append("th { background-color: #3498db; color: white; }");
        sb.append("</style></head><body>");
        
        sb.append("<h1>FACTURA - Ped ido #").append(pedido.getIdPedido()).append("</h1>");
        sb.append("<p><strong>Fecha:</strong> ").append(pedido.getFechaPedido()).append("</p>");
        sb.append("<p><strong>Supermercado:</strong> ").append(pedido.getSupermercado().getNombreSupermercado()).append("</p>");
        sb.append("<p><strong>Cliente:</strong> ").append(pedido.getUsuario().getNombre()).append(" ").append(pedido.getUsuario().getApellido()).append("</p>");
        
        sb.append("<h2>Detalles del Pedido</h2>");
        sb.append("<table>");
        sb.append("<tr><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr>");
        
        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            pedido.getDetalles().forEach(detalle -> {
                sb.append("<tr>");
                sb.append("<td>").append(detalle.getProductoSupermercado().getNombreProducto()).append("</td>");
                sb.append("<td>").append(detalle.getCantidad()).append("</td>");
                sb.append("<td>$").append(detalle.getPrecioUnitario()).append("</td>");
                sb.append("<td>$").append(detalle.getSubtotal()).append("</td>");
                sb.append("</tr>");
            });
        }
        
        sb.append("</table>");
        sb.append("<h2>Total: $").append(pedido.getTotal()).append("</h2>");
        sb.append("<p><strong>Estado:</strong> ").append(pedido.getEstadoPedido()).append("</p>");
        sb.append("</body></html>");

        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"factura_pedido_" + pedidoId + ".html\"")
                .body(sb.toString());
    }
}
