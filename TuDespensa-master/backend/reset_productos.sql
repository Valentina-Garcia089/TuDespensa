-- Script para limpiar tabla de productos de supermercado y permitir re-seed
-- Ejecuta este script en tu base de datos PostgreSQL antes de reiniciar la aplicación

-- Limpiar productos de supermercado
TRUNCATE TABLE producto_supermercado CASCADE;

-- Verificar que se limpiaron correctamente
SELECT COUNT(*) as total_productos FROM producto_supermercado;

-- Si quieres también resetear productos de usuario (opcional)
-- TRUNCATE TABLE producto_usuario CASCADE;
