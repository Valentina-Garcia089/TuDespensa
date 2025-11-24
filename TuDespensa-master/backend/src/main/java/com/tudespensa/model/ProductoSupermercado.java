package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "producto_supermercado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoSupermercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_supermercado")
    private Integer idProductoSupermercado;

    @ManyToOne
    @JoinColumn(name = "id_supermercado", nullable = false)
    private Supermercado supermercado;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaProducto categoria;

    @Column(name = "nombre_producto", nullable = false, length = 200)
    private String nombreProducto;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio", nullable = false)
    private BigDecimal precio;

    @Column(name = "unidad_medida", length = 20)
    private String unidadMedida;

    @Column(name = "cantidad_disponible")
    private Integer cantidadDisponible;

    @Column(name = "activo")
    private Boolean activo = true;
}
