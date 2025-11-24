package com.tudespensa.repository;

import com.tudespensa.model.PedidoProgramado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface PedidoProgramadoRepository extends JpaRepository<PedidoProgramado, Integer> {
    List<PedidoProgramado> findByUsuarioIdUsuario(Integer idUsuario);
    List<PedidoProgramado> findByActivoTrueAndProximaEjecucionBefore(LocalDateTime fecha);
}
