-- Script de migración para permitir id_producto_usuario nulo en historial_notificaciones
-- Esto permite notificaciones de pedidos que no están vinculadas a un producto específico

ALTER TABLE historial_notificaciones
ALTER COLUMN id_producto_usuario DROP NOT NULL;

-- Verificar que el cambio se aplicó
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'historial_notificaciones' 
AND column_name = 'id_producto_usuario';
