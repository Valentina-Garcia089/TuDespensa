package com.tudespensa.service;

import com.tudespensa.model.Pedido;
import com.tudespensa.patrones.Observador;
import org.springframework.stereotype.Service;

@Service
public class EmailServicio implements Observador {

    @Override
    public void actualizar(Pedido pedido) {
        System.out.println("📧 Enviando correo de confirmación para el pedido ID: " + pedido.getIdPedido());
        System.out.println("   Destinatario: " + pedido.getUsuario().getCorreo());
        System.out.println("   Total: " + pedido.getTotal());
        // Aquí iría la lógica real de envío de correos (JavaMailSender, etc.)
    }
}
