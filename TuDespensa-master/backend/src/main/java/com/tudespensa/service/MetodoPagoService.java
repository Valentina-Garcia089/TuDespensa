package com.tudespensa.service;

import com.tudespensa.model.MetodoPago;
import com.tudespensa.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository repository;

    public List<MetodoPago> listarPorUsuario(Integer idUsuario) {
        // Solo retornar métodos de pago activos
        return repository.findByUsuarioIdUsuarioAndActivoTrue(idUsuario);
    }

    public MetodoPago guardar(MetodoPago metodo) {
        return repository.save(metodo);
    }

    public void eliminar(Integer id) {
        // Soft delete: marcar como inactivo en lugar de eliminar
        MetodoPago metodo = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
        metodo.setActivo(false);
        repository.save(metodo);
    }
}
