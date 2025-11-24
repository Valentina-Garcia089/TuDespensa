package com.tudespensa.repository;

import com.tudespensa.model.Supermercado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupermercadoRepository extends JpaRepository<Supermercado, Integer> {
}
