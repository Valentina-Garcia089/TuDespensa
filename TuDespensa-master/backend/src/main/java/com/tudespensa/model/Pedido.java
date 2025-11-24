package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_lista")
    private ListaCompras listaCompras;

    @ManyToOne
    @JoinColumn(name = "id_supermercado", nullable = false)
    private Supermercado supermercado;

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago")
    private MetodoPago metodoPago;

    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido = LocalDateTime.now();

    @Column(name = "fecha_recogida_programada")
    private LocalDateTime fechaRecogidaProgramada;

    @Column(name = "subtotal")
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "impuestos")
    private BigDecimal impuestos = BigDecimal.ZERO;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Column(name = "estado_pedido", length = 50)
    private String estadoPedido = "Pendiente";

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetallePedido> detalles = new ArrayList<>();

    // Patrón Creator: Pedido crea instancias de DetallePedido
    public void agregarDetalle(ProductoSupermercado producto, Integer cantidad) {
        DetallePedido detalle = new DetallePedido();
        detalle.setPedido(this);
        detalle.setProductoSupermercado(producto);
        detalle.setCantidad(cantidad);
        detalle.setPrecioUnitario(producto.getPrecio());
        detalle.setSubtotal(producto.getPrecio().multiply(new BigDecimal(cantidad)));
        
        this.detalles.add(detalle);
        
        // Actualizar total del pedido
        this.subtotal = this.subtotal.add(detalle.getSubtotal());
        this.total = this.subtotal.add(this.impuestos); // Simplificado
    }
}