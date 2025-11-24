package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "detalle_lista")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleLista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_lista")
    private Integer idDetalleLista;

    @ManyToOne
    @JoinColumn(name = "id_lista", nullable = false)
    private ListaCompras listaCompras;

    @ManyToOne
    @JoinColumn(name = "id_producto_usuario", nullable = false)
    private ProductoUsuario productoUsuario;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "comprado")
    private Boolean comprado = false;
}
