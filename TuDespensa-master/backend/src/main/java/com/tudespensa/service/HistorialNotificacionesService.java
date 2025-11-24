package com.tudespensa.service;

import com.tudespensa.model.HistorialNotificaciones;
import com.tudespensa.model.Pedido;
import com.tudespensa.patrones.Observador;
import com.tudespensa.repository.HistorialNotificacionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistorialNotificacionesService implements Observador {

    @Autowired
    private HistorialNotificacionesRepository repository;

    public List<HistorialNotificaciones> listarPorUsuario(Integer idUsuario) {
        return repository.findByProductoUsuarioUsuarioIdUsuario(idUsuario);
    }

    public HistorialNotificaciones guardar(HistorialNotificaciones notificacion) {
        return repository.save(notificacion);
    }

    @Override
    public void actualizar(Pedido pedido) {
        System.out.println("🔔 Registrando notificación para el pedido ID: " + pedido.getIdPedido());
        HistorialNotificaciones notificacion = new HistorialNotificaciones();
        notificacion.setUsuario(pedido.getUsuario());
        notificacion.setMensaje("Pedido #" + pedido.getIdPedido() + " creado exitosamente.");
        notificacion.setFechaEnvio(LocalDateTime.now());
        notificacion.setLeido(false);
        repository.save(notificacion);
    }
}
