-- ============================================
-- FIX PARA HISTORIAL_NOTIFICACIONES
-- Permite notificaciones sin producto asociado (como las de pedidos)
-- ============================================

-- Primero, hacer la columna id_producto_usuario NULLABLE
ALTER TABLE historial_notificaciones 
ALTER COLUMN id_producto_usuario DROP NOT NULL;

-- Agregar columna id_usuario si no existe (para notificaciones de pedidos)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'historial_notificaciones' 
        AND column_name = 'id_usuario'
    ) THEN
        ALTER TABLE historial_notificaciones 
        ADD COLUMN id_usuario INTEGER;
        
        ALTER TABLE historial_notificaciones
        ADD CONSTRAINT fk_notif_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;
    END IF;
END $$;

-- Verificar que la restricción permite 'PEDIDO_CREADO'
-- (Ya está incluido en el constraint original)

SELECT 'Fix aplicado exitosamente' AS resultado;
