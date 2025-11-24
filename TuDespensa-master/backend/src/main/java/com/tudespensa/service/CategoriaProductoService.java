package com.tudespensa.service;

import com.tudespensa.model.CategoriaProducto;
import com.tudespensa.repository.CategoriaProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaProductoService {

    @Autowired
    private CategoriaProductoRepository repository;

    public List<CategoriaProducto> findAll() {
        return repository.findAll();
    }

    public Optional<CategoriaProducto> findById(Integer id) {
        return repository.findById(id);
    }

    public CategoriaProducto save(CategoriaProducto categoria) {
        return repository.save(categoria);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
