-- ============================================
-- ANÁLISIS DE CONSTRAINTS Y CÓDIGO JAVA
-- ============================================

-- Encontré los siguientes constraints CHECK en el esquema:

-- 1. metodo_pago.chk_tipo_pago
--    Valores permitidos: 'Tarjeta Crédito', 'Tarjeta Débito', 'PSE', 'Efectivo', 'Nequi', 'Daviplata'
--    Código Java usa: "Efectivo" ✓

-- 2. pedido.chk_estado_pedido
--    Valores permitidos: 'Pendiente', 'Pagado', 'En Preparación', 'Listo para Recoger', 'Completado', 'Cancelado'
--    Código Java usa: "Pendiente" ✓

-- 3. factura.chk_estado_factura
--    Valores permitidos: 'Generada', 'Enviada', 'Pagada', 'Anulada'
--    Código Java usa: "Generada" ✓

-- 4. lista_compras.chk_estado_lista
--    Valores permitidos: 'Pendiente', 'Descargada', 'Pedido Realizado', 'Completada', 'Cancelada'

-- 5. lista_compras.chk_tipo_lista
--    Valores permitidos: 'Manual', 'Automatica'

-- 6. historial_notificaciones.chk_tipo_notif
--    Valores permitidos (ORIGINAL): 'Recordatorio', 'Producto Agotado', 'Lista Disponible'
--    Valores permitidos (ACTUALIZADO): 'Recordatorio', 'Producto Agotado', 'Lista Disponible', 'PEDIDO_CREADO'
--    Código Java usa: "PEDIDO_CREADO" ✓ (AHORA CORREGIDO)

-- VERIFICAR ESTADO ACTUAL EN DATABASE:
SELECT 
    tc.table_name,
    tc.constraint_name,
    pg_get_constraintdef(pgc.oid) as constraint_definition
FROM information_schema.table_constraints tc
JOIN pg_constraint pgc ON tc.constraint_name = pgc.conname
WHERE tc.constraint_type = 'CHECK'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('metodo_pago', 'pedido', 'factura', 'lista_compras', 'historial_notificaciones')
ORDER BY tc.table_name, tc.constraint_name;
