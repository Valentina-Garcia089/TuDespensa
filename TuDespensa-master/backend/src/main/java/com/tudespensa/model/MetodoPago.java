package com.tudespensa.model;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "metodo_pago")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo_pago")
    private Integer idMetodoPago;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_pago", nullable = false, length = 50)
    private String tipoPago;

    @Column(name = "nombre_titular", length = 150)
    private String nombreTitular;

    @Column(name = "numero_tarjeta_encriptado", nullable = true)
    private String numeroTarjetaEncriptado;

    @Pattern(regexp = "\\d{4}", message = "Debe tener exactamente 4 dígitos numéricos")
    @Column(name = "ultimos_digitos", length = 4)
    private String ultimosDigitos;

    @Column(name = "fecha_expiracion", length = 7)
    private String fechaExpiracion;

    @Column(name = "es_preferido")
    private Boolean esPreferido = false;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "activo")
    private Boolean activo = true;
}
