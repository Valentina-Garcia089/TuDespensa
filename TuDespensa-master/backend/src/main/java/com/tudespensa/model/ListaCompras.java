package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "lista_compras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaCompras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lista")
    private Integer idLista;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_programada")
    private LocalDate fechaProgramada;

    @Column(name = "estado", length = 50)
    private String estado = "Pendiente";

    @Column(name = "tipo_lista", length = 50)
    private String tipoLista;

    @Column(name = "total_productos")
    private Integer totalProductos = 0;

    @Column(name = "enviada_correo")
    private Boolean enviadaCorreo = false;

    @Column(name = "fecha_envio_correo")
    private LocalDateTime fechaEnvioCorreo;
}
