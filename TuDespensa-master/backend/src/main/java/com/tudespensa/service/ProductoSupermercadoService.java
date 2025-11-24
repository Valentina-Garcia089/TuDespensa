package com.tudespensa.service;

import com.tudespensa.model.ProductoSupermercado;
import com.tudespensa.repository.ProductoSupermercadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoSupermercadoService {

    @Autowired
    private ProductoSupermercadoRepository repository;

    public List<ProductoSupermercado> findAll() {
        return repository.findAll();
    }

    public List<ProductoSupermercado> findBySupermercado(Integer idSupermercado) {
        return repository.findBySupermercadoIdSupermercado(idSupermercado);
    }

    public List<ProductoSupermercado> findByCategoria(Integer idCategoria) {
        return repository.findByCategoriaIdCategoria(idCategoria);
    }

    public Optional<ProductoSupermercado> findById(Integer id) {
        return repository.findById(id);
    }

    public ProductoSupermercado save(ProductoSupermercado producto) {
        return repository.save(producto);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
