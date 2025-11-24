package com.tudespensa.repository;

import com.tudespensa.model.DetalleLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetalleListaRepository extends JpaRepository<DetalleLista, Integer> {
    List<DetalleLista> findByListaComprasIdLista(Integer idLista);
    void deleteByListaComprasIdLista(Integer idLista);
}
