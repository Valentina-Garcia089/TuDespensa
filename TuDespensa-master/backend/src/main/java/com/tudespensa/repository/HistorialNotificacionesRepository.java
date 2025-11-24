package com.tudespensa.repository;
import com.tudespensa.model.HistorialNotificaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialNotificacionesRepository extends JpaRepository<HistorialNotificaciones, Integer> {
    List<HistorialNotificaciones> findByProductoUsuarioUsuarioIdUsuario(Integer idUsuario);
}