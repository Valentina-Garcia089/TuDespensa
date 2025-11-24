package com.tudespensa.repository;

import com.tudespensa.model.ProductoSupermercado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoSupermercadoRepository extends JpaRepository<ProductoSupermercado, Integer> {
    List<ProductoSupermercado> findBySupermercadoIdSupermercado(Integer idSupermercado);
    List<ProductoSupermercado> findByCategoriaIdCategoria(Integer idCategoria);
    
    // Buscar por nombre y marca en un supermercado específico (ignorando mayúsculas/minúsculas)
    List<ProductoSupermercado> findBySupermercadoIdSupermercadoAndNombreProductoContainingIgnoreCaseAndMarcaContainingIgnoreCase(
            Integer idSupermercado, String nombreProducto, String marca);
}
