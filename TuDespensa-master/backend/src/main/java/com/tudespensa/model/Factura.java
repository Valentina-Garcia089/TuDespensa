package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "factura")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = lombok.AccessLevel.PROTECTED) // Obliga a usar Builder
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Integer idFactura;

    @OneToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @Column(name = "numero_factura", nullable = false, unique = true, length = 50)
    private String numeroFactura;

    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision = LocalDateTime.now();

    @Column(name = "subtotal", nullable = false)
    private BigDecimal subtotal;

    @Column(name = "impuestos")
    private BigDecimal impuestos = BigDecimal.ZERO;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Column(name = "estado_factura", length = 50)
    private String estadoFactura = "Generada";

    @Column(name = "ruta_pdf", length = 500)
    private String rutaPdf;

    @Column(name = "enviada_correo")
    private Boolean enviadaCorreo = false;

    @Column(name = "fecha_envio_correo")
    private LocalDateTime fechaEnvioCorreo;
}
