package com.tudespensa.service;

import com.tudespensa.model.Supermercado;
import com.tudespensa.repository.SupermercadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SupermercadoService {

    @Autowired
    private SupermercadoRepository supermercadoRepository;

    public List<Supermercado> findAll() {
        return supermercadoRepository.findAll();
    }

    public Optional<Supermercado> findById(Integer id) {
        return supermercadoRepository.findById(id);
    }

    public Supermercado save(Supermercado supermercado) {
        return supermercadoRepository.save(supermercado);
    }

    public void deleteById(Integer id) {
        supermercadoRepository.deleteById(id);
    }
}
