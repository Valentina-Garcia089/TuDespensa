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
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public MetodoPago guardar(MetodoPago metodo) {
        return repository.save(metodo);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
