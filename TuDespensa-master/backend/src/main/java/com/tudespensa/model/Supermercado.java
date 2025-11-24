package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "supermercado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supermercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_supermercado")
    private Integer idSupermercado;

    @Column(name = "nombre_supermercado", nullable = false, length = 150)
    private String nombreSupermercado;

    @Column(name = "direccion", columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "correo", length = 150)
    private String correo;

    @Column(name = "activo")
    private Boolean activo = true;
}
