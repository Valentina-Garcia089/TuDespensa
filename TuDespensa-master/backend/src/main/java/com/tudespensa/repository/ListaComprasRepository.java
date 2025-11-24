package com.tudespensa.repository;

import com.tudespensa.model.ListaCompras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListaComprasRepository extends JpaRepository<ListaCompras, Integer> {
}
