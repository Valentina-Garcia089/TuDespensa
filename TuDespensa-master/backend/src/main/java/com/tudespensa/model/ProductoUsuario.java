package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "producto_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_usuario")
    private Integer idProductoUsuario;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaProducto categoria;

    @Column(name = "nombre_producto", nullable = false, length = 200)
    private String nombreProducto;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "unidad_medida", length = 20)
    private String unidadMedida;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "frecuencia_reposicion", nullable = false)
    private Integer frecuenciaReposicion;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "activo")
    private Boolean activo = true;
}