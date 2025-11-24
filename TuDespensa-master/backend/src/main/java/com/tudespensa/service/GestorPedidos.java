package com.tudespensa.service;

import com.tudespensa.model.*;
import com.tudespensa.patrones.Observador;
import com.tudespensa.patrones.Sujeto;
import com.tudespensa.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GestorPedidos implements Sujeto {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private EmailServicio emailServicio;

    @Autowired
    private HistorialNotificacionesService historialNotificacionesService;

    private List<Observador> observadores = new ArrayList<>();

    public GestorPedidos() {
        // En un caso real, esto podría hacerse con @PostConstruct o inyección de dependencias más limpia
        // Pero para el patrón Observer manual:
        this.observadores = new ArrayList<>();
    }

    // Inicializar observadores (Spring lo hace difícil en constructor por dependencias circulares a veces, 
    // pero aquí lo simulamos o usamos @PostConstruct)
    @javax.annotation.PostConstruct
    public void init() {
        agregarObservador(emailServicio);
        agregarObservador(historialNotificacionesService);
    }

    // Patrón Creator: GestorPedidos tiene la info para crear Pedido
    public Pedido crearPedido(Usuario usuario, Supermercado supermercado, MetodoPago metodoPago, List<ProductoSupermercado> productos, List<Integer> cantidades) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setSupermercado(supermercado);
        pedido.setMetodoPago(metodoPago);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstadoPedido("Pendiente");
        pedido.setSubtotal(BigDecimal.ZERO);
        pedido.setImpuestos(BigDecimal.ZERO);
        pedido.setTotal(BigDecimal.ZERO);

        // Agregar detalles usando el método del patrón Creator en Pedido
        for (int i = 0; i < productos.size(); i++) {
            pedido.agregarDetalle(productos.get(i), cantidades.get(i));
        }

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Notificar a los observadores
        notificarObservadores(pedidoGuardado);

        return pedidoGuardado;
    }

    // Implementación del patrón Observer (Sujeto)
    @Override
    public void agregarObservador(Observador observador) {
        observadores.add(observador);
    }

    @Override
    public void eliminarObservador(Observador observador) {
        observadores.remove(observador);
    }

    @Override
    public void notificarObservadores() {
        // Método genérico, pero necesitamos pasar el pedido. 
        // Ajusté la interfaz Observador para recibir Pedido, así que aquí deberíamos pasar el contexto.
        // Como la interfaz Sujeto es genérica, haré una sobrecarga o ajuste.
        // Para cumplir estrictamente, el Sujeto suele tener el estado.
    }

    public void notificarObservadores(Pedido pedido) {
        for (Observador observador : observadores) {
            observador.actualizar(pedido);
        }
    }
}
