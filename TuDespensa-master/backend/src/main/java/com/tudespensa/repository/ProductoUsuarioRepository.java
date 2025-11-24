package com.tudespensa.repository;

import com.tudespensa.model.ProductoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoUsuarioRepository extends JpaRepository<ProductoUsuario, Integer> {
    List<ProductoUsuario> findByUsuarioIdUsuario(Integer idUsuario);
    // ¡Listo! No necesitas escribir nada más aquí.
    // Spring Boot ya sabe cómo guardar, buscar y borrar por ti.
}