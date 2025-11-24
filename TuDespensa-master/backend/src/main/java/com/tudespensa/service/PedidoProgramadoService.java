package com.tudespensa.service;

import com.tudespensa.model.PedidoProgramado;
import com.tudespensa.model.HistorialNotificaciones;
import com.tudespensa.repository.PedidoProgramadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoProgramadoService {

    @Autowired
    private PedidoProgramadoRepository repository;

    @Autowired
    private HistorialNotificacionesService notificacionesService;

    public List<PedidoProgramado> listarPorUsuario(Integer idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public PedidoProgramado guardar(PedidoProgramado pedido) {
        // Calcular próxima ejecución si es nuevo
        if (pedido.getIdPedidoProgramado() == null && pedido.getProximaEjecucion() == null) {
            pedido.setProximaEjecucion(LocalDateTime.now().plusDays(pedido.getFrecuenciaDias()));
        }
        return repository.save(pedido);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    // Tarea programada: Se ejecuta cada hora (o según configuración)
    // Para demo: cada 60 segundos
    @Scheduled(fixedRate = 60000)
    public void verificarPedidosProgramados() {
        try {
            List<PedidoProgramado> pendientes = repository.findByActivoTrueAndProximaEjecucionBefore(LocalDateTime.now());

            for (PedidoProgramado pp : pendientes) {
                // Crear notificación
                HistorialNotificaciones notif = new HistorialNotificaciones();
                notif.setUsuario(pp.getUsuario());
                notif.setMensaje("Recordatorio: Tu pedido programado de la lista #" + pp.getListaCompras().getIdLista() + " está listo para ser confirmado.");
                notif.setFechaEnvio(LocalDateTime.now());
                notif.setLeido(false);
                notificacionesService.guardar(notif);

                // Actualizar próxima ejecución
                pp.setProximaEjecucion(LocalDateTime.now().plusDays(pp.getFrecuenciaDias()));
                repository.save(pp);
                
                System.out.println("🔔 Notificación enviada para pedido programado ID: " + pp.getIdPedidoProgramado());
            }
        } catch (Exception e) {
            // Manejar el error silenciosamente durante el inicio de la aplicación
            // Esto puede ocurrir si la tabla aún no existe (primera ejecución con ddl-auto=update)
            System.out.println("⚠️  Tarea programada: No se pudo verificar pedidos programados. Esto es normal durante el primer inicio. Detalle: " + e.getMessage());
        }
    }
}
