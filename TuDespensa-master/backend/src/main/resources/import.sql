-- Initial Data for TuDespensa Application
-- This file populates the database with sample supermercados, categorias, and productos

-- ==========================================
-- 1. SUPERMERCADOS
-- ==========================================
INSERT INTO supermercado (nombre_supermercado, direccion, telefono, correo, activo) VALUES
('Éxito', 'Calle 53 #45-110, Medellín', '(604) 3226000', 'contacto@exito.com', true),
('Carulla', 'Carrera 43A #1-50, Medellín', '(604) 4448000', 'servicio@carulla.com', true),
('Jumbo', 'Calle 4 Sur #43A-195, Medellín', '(604) 4448100', 'atencion@jumbo.com.co', true),
('Olímpica', 'Carrera 70 #32-82, Medellín', '(604) 4440000', 'clientes@olimpica.com', true),
('D1', 'Avenida 33 #82-71, Medellín', '(604) 3335500', 'info@tiendas-d1.com', true);

-- ==========================================
-- 1.1 METODOS DE PAGO (EJEMPLO - NO VINCULADOS A USUARIO)
-- ==========================================
-- Nota: Estos son solo ejemplos. Los usuarios crearán sus propios métodos de pago.
-- INSERT INTO metodo_pago (tipo_pago, ultimos_digitos, activo) VALUES
-- ('Efectivo', NULL, true),
-- ('Tarjeta Débito', '1234', true),
-- ('Tarjeta Crédito', '5678', true);

-- ==========================================
-- 2. CATEGORIAS DE PRODUCTOS
-- ==========================================
INSERT INTO categoria_producto (nombre_categoria, descripcion) VALUES
('Frutas y Verduras', 'Productos frescos del campo'),
('Lácteos', 'Leche, quesos, yogures y derivados'),
('Carnes y Pescados', 'Proteínas animales frescas y congeladas'),
('Panadería', 'Pan, pasteles y productos horneados'),
('Abarrotes', 'Productos no perecederos de despensa'),
('Bebidas', 'Jugos, gaseosas, agua y bebidas'),
('Aseo Personal', 'Productos de higiene y cuidado personal'),
('Aseo Hogar', 'Productos de limpieza para el hogar'),
('Snacks', 'Dulces, galletas y aperitivos'),
('Congelados', 'Productos conservados en frío');

-- ==========================================
-- 3. PRODUCTOS POR SUPERMERCADO
-- ==========================================

-- Productos en ÉXITO (id_supermercado = 1)
-- Frutas y Verduras (id_categoria = 1)
INSERT INTO producto_supermercado (id_supermercado, id_categoria, nombre_producto, marca, descripcion, precio, unidad_medida, cantidad_disponible, activo) VALUES
(1, 1, 'Banano', 'Del Monte', 'Bananos frescos y maduros', 2500, 'kg', 100, true),
(1, 1, 'Manzana Roja', 'Washington', 'Manzanas importadas', 8500, 'kg', 50, true),
(1, 1, 'Tomate', 'Cosecha Fresca', 'Tomates rojos maduros', 3200, 'kg', 80, true),
(1, 1, 'Lechuga', 'Verde Campo', 'Lechuga crespa fresca', 2800, 'und', 60, true),

-- Lácteos (id_categoria = 2)
(1, 2, 'Leche Entera', 'Alpina', 'Leche entera 1100ml', 4200, 'und', 150, true),
(1, 2, 'Queso Campesino', 'Alquería', 'Queso campesino 500g', 12500, 'und', 40, true),
(1, 2, 'Yogurt Griego', 'Alpina', 'Yogurt griego natural 150g', 3800, 'und', 70, true),

-- Carnes (id_categoria = 3)
(1, 3, 'Pechuga de Pollo', 'Zenú', 'Pechuga de pollo sin hueso', 15800, 'kg', 30, true),
(1, 3, 'Carne Molida', 'El Corral', 'Carne molida de res', 18500, 'kg', 25, true),

-- Abarrotes (id_categoria = 5)
(1, 5, 'Arroz Blanco', 'Diana', 'Arroz premium 1kg', 4500, 'und', 200, true),
(1, 5, 'Aceite Vegetal', 'Goya', 'Aceite vegetal 1L', 8900, 'und', 100, true),
(1, 5, 'Pasta Espagueti', 'Doria', 'Pasta larga 500g', 3200, 'und', 120, true),

-- Bebidas (id_categoria = 6)
(1, 5, 'Jugo Naranja', 'Hit', 'Jugo de naranja 1L', 3500, 'und', 90, true),
(1, 6, 'Agua Mineral', 'Brisa', 'Agua sin gas 600ml', 1500, 'und', 300, true);

-- Productos en CARULLA (id_supermercado = 2)
INSERT INTO producto_supermercado (id_supermercado, id_categoria, nombre_producto, marca, descripcion, precio, unidad_medida, cantidad_disponible, activo) VALUES
(2, 1, 'Banano', 'Premium', 'Bananos premium', 3000, 'kg', 80, true),
(2, 1, 'Aguacate Hass', 'Agrícola', 'Aguacates frescos', 7500, 'kg', 45, true),
(2, 2, 'Leche Deslactosada', 'Alpina', 'Leche deslactosada 1100ml', 5200, 'und', 100, true),
(2, 2, 'Queso Mozzarella', 'Colanta', 'Queso mozzarella 250g', 9800, 'und', 35, true),
(2, 3, 'Filete de Pescado', 'Friomar', 'Filete de tilapia', 22000, 'kg', 20, true),
(2, 5, 'Arroz Integral', 'Roa', 'Arroz integral 500g', 5800, 'und', 60, true),
(2, 5, 'Lentejas', 'ICA', 'Lentejas premium 500g', 4200, 'und', 80, true),
(2, 6, 'Jugo de Manzana', 'Del Valle', 'Jugo 100% natural 1L', 4500, 'und', 70, true);

-- Productos en JUMBO (id_supermercado = 3)
INSERT INTO producto_supermercado (id_supermercado, id_categoria, nombre_producto, marca, descripcion, precio, unidad_medida, cantidad_disponible, activo) VALUES
(3, 1, 'Mango', 'Tommy', 'Mangos dulces', 5500, 'kg', 60, true),
(3, 1, 'Zanahoria', 'Huerta Verde', 'Zanahorias frescas', 2800, 'kg', 90, true),
(3, 2, 'Mantequilla', 'Alpina', 'Mantequilla con sal 250g', 7200, 'und', 50, true),
(3, 3, 'Carne de Cerdo', 'PorkCo', 'Chuleta de cerdo', 16500, 'kg', 28, true),
(3, 4, 'Pan Tajado', 'Bimbo', 'Pan tajado integral', 5800, 'und', 100, true),
(3, 5, 'Frijol Rojo', 'La Campiña', 'Frijol rojo 500g', 4800, 'und', 110, true),
(3, 6, 'Gaseosa Cola', 'Coca-Cola', 'Gaseosa 1.5L', 5200, 'und', 150, true),
(3, 7, 'Champú', 'Sedal', 'Champú hidratante 400ml', 12500, 'und', 40, true);

-- Productos en OLÍMPICA (id_supermercado = 4)
INSERT INTO producto_supermercado (id_supermercado, id_categoria, nombre_producto, marca, descripcion, precio, unidad_medida, cantidad_disponible, activo) VALUES
(4, 1, 'Papaya', 'Frutiexpress', 'Papaya madura', 4200, 'kg', 50, true),
(4, 2, 'Leche Entera', 'Colanta', 'Leche entera 1L', 4000, 'und', 130, true),
(4, 5, 'Azúcar Blanca', 'Incauca', 'Azúcar refinada 1kg', 3800, 'und', 180, true),
(4, 5, 'Sal', 'Refisal', 'Sal de cocina 1kg', 1800, 'und', 200, true),
(4, 6, 'Agua Saborizada', 'Awafrut', 'Agua con sabor 500ml', 2200, 'und', 120, true),
(4, 8, 'Jabón en Polvo', 'Fab', 'Detergente 1kg', 8500, 'und', 65, true);

-- Productos en D1 (id_supermercado = 5)
INSERT INTO producto_supermercado (id_supermercado, id_categoria, nombre_producto, marca, descripcion, precio, unidad_medida, cantidad_disponible, activo) VALUES
(5, 1, 'Banano', 'Economía', 'Bananos precio bajo', 2200, 'kg', 150, true),
(5, 2, 'Leche Entera', 'Propia D1', 'Leche entera 900ml', 3500, 'und', 180, true),
(5, 5, 'Arroz Blanco', 'Florhuila', 'Arroz básico 1kg', 3800, 'und', 220, true),
(5, 5, 'Aceite', 'Premier', 'Aceite vegetal 900ml', 7500, 'und', 140, true),
(5, 6, 'Gaseosa', 'Postobón', 'Gaseosa 1.5L', 4200, 'und', 160, true),
(5, 9, 'Galletas', 'Festival', 'Galletas dulces 250g', 2800, 'und', 200, true);
