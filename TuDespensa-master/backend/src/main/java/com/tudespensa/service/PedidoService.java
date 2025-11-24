package com.tudespensa.service;

import com.tudespensa.model.Pedido;
import com.tudespensa.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    public Pedido guardarPedido(Pedido pedido) {
        return repository.save(pedido);
    }

    public List<Pedido> listarPorUsuario(Integer idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public Optional<Pedido> buscarPorId(Integer id) {
        return repository.findById(id);
    }
}
