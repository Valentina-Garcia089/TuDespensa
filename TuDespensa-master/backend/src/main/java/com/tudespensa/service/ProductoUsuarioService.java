package com.tudespensa.service;

import com.tudespensa.model.ProductoUsuario;
import com.tudespensa.repository.ProductoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoUsuarioService {

    @Autowired
    private ProductoUsuarioRepository repository;

    @Autowired
    private com.tudespensa.repository.CategoriaProductoRepository categoriaRepository;

    public List<ProductoUsuario> listarPorUsuario(Integer idUsuario) {
        return repository.findByUsuarioIdUsuario(idUsuario);
    }

    public ProductoUsuario guardarProducto(ProductoUsuario producto) {
        return repository.save(producto);
    }

    public void eliminarProducto(Integer id) {
        repository.deleteById(id);
    }

    public java.util.List<com.tudespensa.model.CategoriaProducto> listarCategorias() {
        return categoriaRepository.findAll();
    }
}
