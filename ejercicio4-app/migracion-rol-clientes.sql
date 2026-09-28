-- Ejecutar UNA SOLA VEZ en la base de datos ya existente.
-- No vuelvas a importar ejercicio4.sql en producción: ese archivo recrea las tablas.
ALTER TABLE `clientes`
  ADD COLUMN `Rol` ENUM('Cliente', 'Administrador') NOT NULL DEFAULT 'Cliente';

-- Después, asigna el rol de gerente a la ficha correspondiente, sustituyendo el ID:
-- UPDATE `clientes` SET `Rol` = 'Administrador' WHERE `id_cliente` = 1;
