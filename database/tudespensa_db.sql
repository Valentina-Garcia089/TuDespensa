-- ============================================
-- BASE DE DATOS: TU DESPENSA
-- Sistema de gestión de productos del hogar
-- PostgreSQL
-- ============================================

-- Eliminar tablas si existen (para recrear)
DROP TABLE IF EXISTS detalle_factura CASCADE;
DROP TABLE IF EXISTS factura CASCADE;
DROP TABLE IF EXISTS detalle_pedido CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS producto_supermercado CASCADE;
DROP TABLE IF EXISTS supermercado CASCADE;
DROP TABLE IF EXISTS historial_notificaciones CASCADE;
DROP TABLE IF EXISTS lista_compras CASCADE;
DROP TABLE IF EXISTS producto_usuario CASCADE;
DROP TABLE IF EXISTS categoria_producto CASCADE;
DROP TABLE IF EXISTS metodo_pago CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- ============================================
-- TABLA: USUARIO
-- Almacena información de los usuarios registrados
-- ============================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL, -- Contraseña cifrada
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    CONSTRAINT chk_correo_formato CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- TABLA: METODO_PAGO
-- Almacena los métodos de pago del usuario
-- ============================================
CREATE TABLE metodo_pago (
    id_metodo_pago SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    tipo_pago VARCHAR(50) NOT NULL, -- 'Tarjeta Crédito', 'Tarjeta Débito', 'PSE', etc.
    nombre_titular VARCHAR(150),
    numero_tarjeta_encriptado VARCHAR(255), -- Solo últimos 4 dígitos visibles
    ultimos_digitos VARCHAR(4),
    fecha_expiracion VARCHAR(7), -- MM/YYYY
    es_preferido BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_tipo_pago CHECK (tipo_pago IN ('Tarjeta Crédito', 'Tarjeta Débito', 'PSE', 'Efectivo', 'Nequi', 'Daviplata'))
);

-- ============================================
-- TABLA: CATEGORIA_PRODUCTO
-- Categorías de productos (Alimentos, Limpieza, Higiene)
-- ============================================
CREATE TABLE categoria_producto (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- ============================================
-- TABLA: PRODUCTO_USUARIO
-- Productos registrados por cada usuario
-- ============================================
CREATE TABLE producto_usuario (
    id_producto_usuario SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    cantidad_actual DECIMAL(10,2) DEFAULT 0,
    unidad_medida VARCHAR(20), -- 'unidades', 'kg', 'litros', 'gramos', etc.
    frecuencia_reposicion INTEGER NOT NULL, -- Días para notificación (15, 30, 8, etc.)
    fecha_ultimo_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_proxima_notificacion DATE,
    producto_agotado BOOLEAN DEFAULT FALSE,
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria),
    CONSTRAINT chk_frecuencia CHECK (frecuencia_reposicion > 0),
    CONSTRAINT chk_unidad_medida CHECK (unidad_medida IN ('unidades', 'kg', 'litros', 'gramos', 'ml', 'paquetes'))
);

-- ============================================
-- TABLA: HISTORIAL_NOTIFICACIONES
-- Registro de notificaciones enviadas
-- ============================================
CREATE TABLE historial_notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_producto_usuario INTEGER NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_notificacion VARCHAR(50), -- 'Recordatorio', 'Producto Agotado', 'Lista Disponible'
    mensaje TEXT,
    leida BOOLEAN DEFAULT FALSE,
    respuesta_usuario VARCHAR(50), -- 'Agotado', 'No Agotado', 'Pendiente'
    fecha_respuesta TIMESTAMP,
    FOREIGN KEY (id_producto_usuario) REFERENCES producto_usuario(id_producto_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_tipo_notif CHECK (tipo_notificacion IN ('Recordatorio', 'Producto Agotado', 'Lista Disponible'))
);

-- ============================================
-- TABLA: LISTA_COMPRAS
-- Listas de compras generadas
-- ============================================
CREATE TABLE lista_compras (
    id_lista SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada DATE, -- Fecha en que el usuario quiere revisar
    estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'Descargada', 'Pedido Realizado', 'Completada'
    tipo_lista VARCHAR(50), -- 'Manual', 'Automatica'
    total_productos INTEGER DEFAULT 0,
    enviada_correo BOOLEAN DEFAULT FALSE,
    fecha_envio_correo TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_estado_lista CHECK (estado IN ('Pendiente', 'Descargada', 'Pedido Realizado', 'Completada', 'Cancelada')),
    CONSTRAINT chk_tipo_lista CHECK (tipo_lista IN ('Manual', 'Automatica'))
);

-- ============================================
-- TABLA: SUPERMERCADO
-- Supermercados asociados al sistema
-- ============================================
CREATE TABLE supermercado (
    id_supermercado SERIAL PRIMARY KEY,
    nombre_supermercado VARCHAR(150) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    horario_atencion VARCHAR(200),
    activo BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLA: PRODUCTO_SUPERMERCADO
-- Catálogo de productos disponibles en supermercados
-- ============================================
CREATE TABLE producto_supermercado (
    id_producto_supermercado SERIAL PRIMARY KEY,
    id_supermercado INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(20),
    cantidad_disponible INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_supermercado) REFERENCES supermercado(id_supermercado) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria),
    CONSTRAINT chk_precio CHECK (precio >= 0)
);

-- ============================================
-- TABLA: PEDIDO
-- Pedidos realizados por el usuario
-- ============================================
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_lista INTEGER,
    id_supermercado INTEGER NOT NULL,
    id_metodo_pago INTEGER,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_recogida_programada TIMESTAMP,
    subtotal DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado_pedido VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'En Preparación', 'Listo para Recoger', 'Completado', 'Cancelado'
    notas TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_lista) REFERENCES lista_compras(id_lista),
    FOREIGN KEY (id_supermercado) REFERENCES supermercado(id_supermercado),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago),
    CONSTRAINT chk_total CHECK (total >= 0),
    CONSTRAINT chk_estado_pedido CHECK (estado_pedido IN ('Pendiente', 'Pagado', 'En Preparación', 'Listo para Recoger', 'Completado', 'Cancelado'))
);

-- ============================================
-- TABLA: DETALLE_PEDIDO
-- Productos incluidos en cada pedido
-- ============================================
CREATE TABLE detalle_pedido (
    id_detalle_pedido SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_producto_supermercado INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto_supermercado) REFERENCES producto_supermercado(id_producto_supermercado),
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_unitario CHECK (precio_unitario >= 0)
);

-- ============================================
-- TABLA: FACTURA
-- Facturas generadas por pedidos
-- ============================================
CREATE TABLE factura (
    id_factura SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado_factura VARCHAR(50) DEFAULT 'Generada', -- 'Generada', 'Enviada', 'Pagada'
    ruta_pdf VARCHAR(500),
    enviada_correo BOOLEAN DEFAULT FALSE,
    fecha_envio_correo TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    CONSTRAINT chk_total_factura CHECK (total >= 0),
    CONSTRAINT chk_estado_factura CHECK (estado_factura IN ('Generada', 'Enviada', 'Pagada', 'Anulada'))
);

-- ============================================
-- TABLA: DETALLE_FACTURA
-- Detalle de productos en la factura
-- ============================================
CREATE TABLE detalle_factura (
    id_detalle_factura SERIAL PRIMARY KEY,
    id_factura INTEGER NOT NULL,
    descripcion_producto VARCHAR(300) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura) ON DELETE CASCADE,
    CONSTRAINT chk_cantidad_factura CHECK (cantidad > 0)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX idx_usuario_correo ON usuario(correo);
CREATE INDEX idx_usuario_activo ON usuario(activo);
CREATE INDEX idx_producto_usuario_usuario ON producto_usuario(id_usuario);
CREATE INDEX idx_producto_usuario_agotado ON producto_usuario(producto_agotado);
CREATE INDEX idx_producto_usuario_fecha_notif ON producto_usuario(fecha_proxima_notificacion);
CREATE INDEX idx_lista_usuario ON lista_compras(id_usuario);
CREATE INDEX idx_lista_estado ON lista_compras(estado);
CREATE INDEX idx_pedido_usuario ON pedido(id_usuario);
CREATE INDEX idx_pedido_estado ON pedido(estado_pedido);
CREATE INDEX idx_pedido_fecha ON pedido(fecha_pedido);
CREATE INDEX idx_notificacion_producto ON historial_notificaciones(id_producto_usuario);
CREATE INDEX idx_notificacion_fecha ON historial_notificaciones(fecha_envio);

-- ============================================
-- DATOS INICIALES: CATEGORÍAS
-- ============================================
INSERT INTO categoria_producto (nombre_categoria, descripcion) VALUES
('Alimentos', 'Productos alimenticios y bebidas'),
('Limpieza', 'Productos de aseo y limpieza del hogar'),
('Higiene Personal', 'Productos de cuidado e higiene personal'),
('Bebidas', 'Bebidas no alcohólicas'),
('Lácteos', 'Productos lácteos y derivados'),
('Carnes y Pescados', 'Proteínas animales'),
('Panadería', 'Productos de panadería y pastelería'),
('Snacks', 'Aperitivos y golosinas');

-- ============================================
-- DATOS INICIALES: SUPERMERCADOS (Ejemplo)
-- ============================================
INSERT INTO supermercado (nombre_supermercado, direccion, telefono, horario_atencion) VALUES
('Éxito', 'Calle 100 #10-20, Bogotá', '3001234567', 'Lunes a Domingo 8:00 AM - 9:00 PM'),
('Carulla', 'Carrera 15 #93-50, Bogotá', '3007654321', 'Lunes a Domingo 7:00 AM - 10:00 PM'),
('Jumbo', 'Avenida 68 #75-50, Bogotá', '3009876543', 'Lunes a Domingo 8:00 AM - 9:00 PM'),
('Olímpica', 'Calle 80 #69-70, Bogotá', '3005551234', 'Lunes a Domingo 8:00 AM - 8:00 PM');

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE usuario IS 'Usuarios registrados en la aplicación';
COMMENT ON TABLE metodo_pago IS 'Métodos de pago asociados a usuarios';
COMMENT ON TABLE categoria_producto IS 'Categorías de productos del hogar';
COMMENT ON TABLE producto_usuario IS 'Productos registrados por cada usuario para gestión de inventario';
COMMENT ON TABLE historial_notificaciones IS 'Historial de notificaciones enviadas a usuarios';
COMMENT ON TABLE lista_compras IS 'Listas de compras generadas automática o manualmente';
COMMENT ON TABLE supermercado IS 'Supermercados asociados al sistema';
COMMENT ON TABLE producto_supermercado IS 'Catálogo de productos disponibles en supermercados';
COMMENT ON TABLE pedido IS 'Pedidos en línea para recoger en supermercado';
COMMENT ON TABLE detalle_pedido IS 'Detalle de productos en cada pedido';
COMMENT ON TABLE factura IS 'Facturas generadas por pedidos';
COMMENT ON TABLE detalle_factura IS 'Detalle de productos en facturas';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================