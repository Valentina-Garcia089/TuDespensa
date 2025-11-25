package com.tudespensa.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialNotificaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Integer idNotificacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_producto_usuario", nullable = true)
    private ProductoUsuario productoUsuario;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    @Column(name = "tipo_notificacion", length = 50)
    private String tipoNotificacion;

    @Column(name = "mensaje", columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "leido")
    private Boolean leido = false;

    @Column(name = "respuesta_usuario", length = 50)
    private String respuestaUsuario;

    @Column(name = "fecha_respuesta")
    private LocalDateTime fechaRespuesta;
}