package com.tudespensa.service;

import com.tudespensa.model.ListaCompras;
import com.tudespensa.repository.ListaComprasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ListaComprasService {

    @Autowired
    private ListaComprasRepository listaComprasRepository;
    @Autowired
    private com.tudespensa.repository.DetalleListaRepository detalleListaRepository;
    @Autowired
    private com.tudespensa.repository.ProductoUsuarioRepository productoUsuarioRepository;
    @Autowired
    private com.tudespensa.repository.ProductoSupermercadoRepository productoSupermercadoRepository;
    @Autowired
    private com.tudespensa.repository.SupermercadoRepository supermercadoRepository;
    @Autowired
    private com.tudespensa.repository.MetodoPagoRepository metodoPagoRepository;
    @Autowired
    private com.tudespensa.repository.UsuarioRepository usuarioRepository;
    @Autowired
    private GestorPedidos gestorPedidos;

    public List<ListaCompras> findAll() {
        return listaComprasRepository.findAll();
    }

    public Optional<ListaCompras> findById(Integer id) {
        return listaComprasRepository.findById(id);
    }

    public ListaCompras save(ListaCompras lista) {
        return listaComprasRepository.save(lista);
    }

    public void deleteById(Integer id) {
        listaComprasRepository.deleteById(id);
    }

    // Métodos para gestionar productos en la lista
    public void agregarProducto(Integer idLista, Integer idProductoUsuario, Integer cantidad) {
        ListaCompras lista = listaComprasRepository.findById(idLista)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        com.tudespensa.model.ProductoUsuario producto = productoUsuarioRepository.findById(idProductoUsuario)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        com.tudespensa.model.DetalleLista detalle = new com.tudespensa.model.DetalleLista();
        detalle.setListaCompras(lista);
        detalle.setProductoUsuario(producto);
        detalle.setCantidad(cantidad);
        detalle.setComprado(false);

        detalleListaRepository.save(detalle);
        
        // Actualizar contador
        lista.setTotalProductos(lista.getTotalProductos() + 1);
        listaComprasRepository.save(lista);
    }

    public void eliminarProducto(Integer idDetalle) {
        detalleListaRepository.deleteById(idDetalle);
    }

    public List<com.tudespensa.model.DetalleLista> obtenerDetalles(Integer idLista) {
        return detalleListaRepository.findByListaComprasIdLista(idLista);
    }

    // Lógica para convertir lista en pedido (Smart Match)
    public com.tudespensa.model.Pedido comprarLista(Integer idLista, Integer idSupermercado, Integer idMetodoPago) {
        ListaCompras lista = listaComprasRepository.findById(idLista)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        
        com.tudespensa.model.Supermercado supermercado = supermercadoRepository.findById(idSupermercado)
                .orElseThrow(() -> new RuntimeException("Supermercado no encontrado"));
        
        com.tudespensa.model.MetodoPago metodoPago = metodoPagoRepository.findById(idMetodoPago)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        List<com.tudespensa.model.DetalleLista> detalles = detalleListaRepository.findByListaComprasIdLista(idLista);
        
        java.util.List<com.tudespensa.model.ProductoSupermercado> productosPedido = new java.util.ArrayList<>();
        java.util.List<Integer> cantidades = new java.util.ArrayList<>();

        for (com.tudespensa.model.DetalleLista det : detalles) {
            com.tudespensa.model.ProductoUsuario prodUsuario = det.getProductoUsuario();
            com.tudespensa.model.ProductoSupermercado prodSuper = null;

            // Buscar equivalente en el supermercado
            List<com.tudespensa.model.ProductoSupermercado> equivalentes = productoSupermercadoRepository
                    .findBySupermercadoIdSupermercadoAndNombreProductoContainingIgnoreCaseAndMarcaContainingIgnoreCase(
                            supermercado.getIdSupermercado(),
                            prodUsuario.getNombreProducto(),
                            prodUsuario.getMarca() != null ? prodUsuario.getMarca() : ""
                    );

            if (!equivalentes.isEmpty()) {
                prodSuper = equivalentes.get(0);
            }

            if (prodSuper != null) {
                productosPedido.add(prodSuper);
                cantidades.add(det.getCantidad());
            }
        }

        if (productosPedido.isEmpty()) {
            throw new RuntimeException("No se encontraron productos disponibles en este supermercado para tu lista.");
        }

        return gestorPedidos.crearPedido(lista.getUsuario(), supermercado, metodoPago, productosPedido, cantidades);
    }
}
