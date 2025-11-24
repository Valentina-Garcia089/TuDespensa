package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedido_programado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoProgramado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido_programado")
    private Integer idPedidoProgramado;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_lista", nullable = false)
    private ListaCompras listaCompras;

    @Column(name = "frecuencia_dias", nullable = false)
    private Integer frecuenciaDias; // Ej: 30 para mensual, 7 para semanal

    @Column(name = "proxima_ejecucion", nullable = false)
    private LocalDateTime proximaEjecucion;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
