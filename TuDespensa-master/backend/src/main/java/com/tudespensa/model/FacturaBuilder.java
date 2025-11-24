package com.tudespensa.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class FacturaBuilder {

    private Factura factura;

    public FacturaBuilder() {
        this.factura = new Factura();
    }

    public FacturaBuilder buildEncabezado(Pedido pedido) {
        factura.setPedido(pedido);
        factura.setFechaEmision(LocalDateTime.now());
        factura.setNumeroFactura("FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return this;
    }

    public FacturaBuilder buildCuerpo() {
        // En un builder más complejo, aquí procesaríamos los detalles para generar líneas de factura específicas
        // Por ahora, tomamos los totales del pedido
        Pedido pedido = factura.getPedido();
        factura.setSubtotal(pedido.getSubtotal());
        return this;
    }

    public FacturaBuilder buildPie() {
        Pedido pedido = factura.getPedido();
        factura.setImpuestos(pedido.getImpuestos());
        factura.setTotal(pedido.getTotal());
        factura.setEstadoFactura("Generada");
        return this;
    }

    public Factura getResult() {
        return factura;
    }
}
