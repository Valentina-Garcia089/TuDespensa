package com.tudespensa.service;

import com.tudespensa.model.Factura;
import com.tudespensa.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository repository;

    public Factura guardarFactura(Factura factura) {
        return repository.save(factura);
    }

    public Optional<Factura> buscarPorId(Integer id) {
        return repository.findById(id);
    }
}
