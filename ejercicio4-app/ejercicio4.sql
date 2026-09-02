-- Base de datos ejercicio4
-- Preparada para integración Backend Render -> Zapier -> IA -> Aiven
-- La notificación a Zapier la realizará el BACKEND después de insertar
-- una nueva consulta. La base de datos no necesita conectarse directamente
-- a Zapier.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `ejercicio4`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ejercicio4`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `atencion_cliente`;
DROP TABLE IF EXISTS `datos_personales`;
DROP TABLE IF EXISTS `clientes`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `email`, `telefono`) VALUES
(1, 'Laura', 'García', 'laura.garcia@email.com', '600100001'),
(2, 'Manuel', 'Rodríguez', 'manuel.rodriguez@email.com', '600100002'),
(3, 'Jacinto', 'Pérez', 'jacinto.perez@email.com', '600100003'),
(4, 'Eulalia', 'Martínez', 'eulalia.martinez@email.com', '600100004'),
(5, 'Carlos', 'López', 'carlos.lopez@email.com', '600100005'),
(6, 'Ana', 'Sánchez', 'ana.sanchez@email.com', '600100006'),
(7, 'David', 'Fernández', 'david.fernandez@email.com', '600100007'),
(8, 'María', 'Gómez', 'maria.gomez@email.com', '600100008'),
(9, 'Javier', 'Díaz', 'javier.diaz@email.com', '600100009'),
(10, 'Lucía', 'Moreno', 'lucia.moreno@email.com', '600100010'),
(11, 'Miguel', 'Álvarez', 'miguel.alvarez@email.com', '600100011'),
(12, 'Carmen', 'Romero', 'carmen.romero@email.com', '600100012'),
(13, 'Antonio', 'Alonso', 'antonio.alonso@email.com', '600100013'),
(14, 'Sofía', 'Navarro', 'sofia.navarro@email.com', '600100014'),
(15, 'Daniel', 'Torres', 'daniel.torres@email.com', '600100015'),
(16, 'Elena', 'Domínguez', 'elena.dominguez@email.com', '600100016'),
(17, 'Pablo', 'Vázquez', 'pablo.vazquez@email.com', '600100017'),
(18, 'Sara', 'Ramos', 'sara.ramos@email.com', '600100018'),
(19, 'Álvaro', 'Ramírez', 'alvaro.ramirez@email.com', '600100019'),
(20, 'Claudia', 'Vázquez', 'claudia.vazquez@email.com', '600100020'),
(21, 'Sergio', 'Cruz', 'sergio.cruz@email.com', '600100021'),
(22, 'Marta', 'Morales', 'marta.morales@email.com', '600100022'),
(23, 'Fernando', 'Ortiz', 'fernando.ortiz@email.com', '600100023'),
(24, 'Paula', 'Rubio', 'paula.rubio@email.com', '600100024'),
(25, 'Adrián', 'Molina', 'adrian.molina@email.com', '600100025'),
(26, 'Isabel', 'Suárez', 'isabel.suarez@email.com', '600100026'),
(27, 'Rubén', 'Blanco', 'ruben.blanco@email.com', '600100027'),
(28, 'Patricia', 'Iglesias', 'patricia.iglesias@email.com', '600100028'),
(29, 'Óscar', 'Medina', 'oscar.medina@email.com', '600100029'),
(30, 'Natalia', 'Marín', 'natalia.marin@email.com', '600100030'),
(31, 'Diego', 'Sanz', 'diego.sanz@email.com', '600100031'),
(32, 'Cristina', 'Gutiérrez', 'cristina.gutierrez@email.com', '600100032'),
(33, 'Mario', 'Ortega', 'mario.ortega@email.com', '600100033'),
(34, 'Beatriz', 'Delgado', 'beatriz.delgado@email.com', '600100034'),
(35, 'Raúl', 'Castro', 'raul.castro@email.com', '600100035'),
(36, 'Teresa', 'Ortiz', 'teresa.ortiz@email.com', '600100036'),
(37, 'Iván', 'Rubio', 'ivan.rubio@email.com', '600100037'),
(38, 'Silvia', 'Méndez', 'silvia.mendez@email.com', '600100038'),
(39, 'Héctor', 'Santiago', 'hector.santiago@email.com', '600100039'),
(40, 'Rocío', 'Durán', 'rocio.duran@email.com', '600100040'),
(41, 'Víctor', 'Pastor', 'victor.pastor@email.com', '600100041'),
(42, 'Andrea', 'Cabrera', 'andrea.cabrera@email.com', '600100042'),
(43, 'Gonzalo', 'Reyes', 'gonzalo.reyes@email.com', '600100043'),
(44, 'Alicia', 'Nieto', 'alicia.nieto@email.com', '600100044'),
(45, 'Enrique', 'Vega', 'enrique.vega@email.com', '600100045'),
(46, 'Lorena', 'Pascual', 'lorena.pascual@email.com', '600100046'),
(47, 'Jesús', 'Herrera', 'jesus.herrera@email.com', '600100047'),
(48, 'Verónica', 'Arias', 'veronica.arias@email.com', '600100048'),
(49, 'Francisco', 'Moya', 'francisco.moya@email.com', '600100049'),
(50, 'Nuria', 'Calvo', 'nuria.calvo@email.com', '600100050');

CREATE TABLE `datos_personales` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `edad` int(2) NOT NULL,
  PRIMARY KEY (`id_persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `datos_personales` (`nombre`, `apellidos`, `edad`) VALUES
('Manuel', 'Mancebo', 62),
('Juan', 'Martinez', 55),
('jose', 'Vidal', 64),
('Antonio', 'Mancebo', 60),
('Procopio', 'Sanchez', 57),
('Procopio', 'Sanchez', 57);

CREATE TABLE `atencion_cliente` (
  `id_atencion` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL,
  `Consulta` text NOT NULL,
  `Respuesta` text DEFAULT NULL,
  `estado_respuesta` enum('pendiente','procesando','respondida','error') NOT NULL DEFAULT 'pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_atencion`),
  KEY `idx_atencion_cliente_id` (`id`),
  KEY `idx_atencion_cliente_estado` (`estado_respuesta`),
  CONSTRAINT `fk_atencion_cliente_cliente`
    FOREIGN KEY (`id`) REFERENCES `clientes` (`id_cliente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `atencion_cliente` (`id`, `Consulta`, `Respuesta`, `estado_respuesta`) VALUES
(1, '¿Cuál es el horario de atención?', 'Nuestro horario es de lunes a viernes de 9:00 a 18:00.', 'respondida'),
(1, '¿Cómo puedo cambiar mi contraseña?', 'Puede cambiar su contraseña desde el apartado Mi Cuenta.', 'respondida'),
(2, '¿Cómo puedo realizar un pedido?', 'Puede realizar su pedido desde nuestra página web.', 'respondida'),
(2, '¿Qué métodos de pago aceptan?', 'Aceptamos tarjeta, transferencia bancaria y PayPal.', 'respondida'),
(3, '¿Puedo cancelar mi pedido?', 'Sí, puede cancelar el pedido antes de que sea enviado.', 'respondida'),
(3, '¿Cuánto tarda el envío?', 'El envío suele tardar entre 2 y 5 días laborables.', 'respondida'),
(4, '¿Realizan envíos internacionales?', 'Sí, realizamos envíos a varios países de Europa.', 'respondida'),
(4, '¿Cómo puedo devolver un producto?', 'Puede solicitar una devolución dentro de los 30 días posteriores a la compra.', 'respondida'),
(5, '¿Dónde puedo consultar mi factura?', 'Puede consultar sus facturas desde el apartado Mi Cuenta.', 'respondida'),
(5, '¿Puedo recibir la factura por correo?', 'Sí, podemos enviarle la factura a su correo electrónico.', 'respondida'),
(6, '¿Cómo puedo modificar mis datos personales?', 'Puede modificarlos desde su perfil de usuario.', 'respondida'),
(6, '¿Puedo cambiar mi dirección de envío?', 'Sí, puede modificarla antes de confirmar el pedido.', 'respondida'),
(7, '¿Cuánto cuesta el envío?', 'Los gastos de envío dependen del destino y del importe del pedido.', 'respondida'),
(7, '¿El envío es gratuito?', 'El envío es gratuito para pedidos superiores a 50 euros.', 'respondida'),
(8, '¿Cómo puedo hacer una devolución?', 'Debe solicitar la devolución desde su cuenta de cliente.', 'respondida'),
(8, '¿Cuánto tiempo tengo para devolver un producto?', 'Dispone de 30 días desde la recepción del pedido.', 'respondida'),
(9, '¿Puedo cambiar un producto?', 'Sí, puede solicitar un cambio dentro del plazo establecido.', 'respondida'),
(9, '¿Quién paga los gastos de devolución?', 'Depende del motivo de la devolución y de las condiciones de compra.', 'respondida'),
(10, '¿Dónde está mi pedido?', 'Puede consultar el estado del pedido desde su cuenta.', 'respondida'),
(10, '¿Puedo conocer el número de seguimiento?', 'Sí, recibirá el número de seguimiento por correo electrónico.', 'respondida'),
(11, '¿Qué tarjetas aceptan?', 'Aceptamos Visa, Mastercard y otras tarjetas compatibles.', 'respondida'),
(11, '¿Es seguro pagar con tarjeta?', 'Sí, utilizamos sistemas de pago seguros.', 'respondida'),
(12, '¿Puedo pagar mediante PayPal?', 'Sí, PayPal está disponible como método de pago.', 'respondida'),
(12, '¿Puedo pagar mediante transferencia?', 'Sí, ofrecemos la opción de transferencia bancaria.', 'respondida'),
(13, '¿Cómo creo una cuenta?', 'Puede registrarse utilizando el formulario de registro.', 'respondida'),
(13, '¿Es necesario crear una cuenta para comprar?', 'Puede consultar las opciones disponibles durante el proceso de compra.', 'respondida'),
(14, 'He olvidado mi contraseña.', 'Puede utilizar la opción Recuperar contraseña.', 'respondida'),
(14, 'No recibo el correo para cambiar la contraseña.', 'Compruebe la carpeta de correo no deseado o spam.', 'respondida'),
(15, '¿Cómo puedo contactar con atención al cliente?', 'Puede contactar con nosotros mediante este servicio de atención.', 'respondida'),
(15, '¿Cuánto tardan en responder?', 'Normalmente respondemos en un plazo de 24 horas laborables.', 'respondida'),
(16, '¿Puedo modificar un pedido?', 'Puede modificarlo mientras todavía no haya sido preparado para su envío.', 'respondida'),
(16, 'Quiero añadir un producto a mi pedido.', 'Si el pedido aún no ha sido procesado, podemos estudiar la modificación.', 'respondida'),
(17, '¿Cuándo recibiré mi pedido?', 'El plazo habitual de entrega es de 2 a 5 días laborables.', 'respondida'),
(17, 'Mi pedido está retrasado.', 'Vamos a comprobar el estado de su envío.', 'respondida'),
(18, '¿Puedo elegir una hora de entrega?', 'Las opciones de horario dependen de la empresa de transporte.', 'respondida'),
(18, '¿Puedo cambiar la dirección de entrega?', 'Sí, siempre que el pedido todavía no haya sido enviado.', 'respondida'),
(19, 'He recibido un producto incorrecto.', 'Lamentamos el inconveniente. Contacte con atención al cliente para solucionarlo.', 'respondida'),
(19, '¿Cómo puedo reclamar?', 'Puede presentar una reclamación mediante nuestro servicio de atención.', 'respondida'),
(20, 'El producto ha llegado dañado.', 'Envíenos información sobre el daño para poder gestionar la incidencia.', 'respondida'),
(20, '¿Me pueden enviar otro producto?', 'Sí, estudiaremos la sustitución según las condiciones de la compra.', 'respondida'),
(21, '¿Tienen productos en stock?', 'Puede consultar la disponibilidad directamente en la página del producto.', 'respondida'),
(21, '¿Cuándo repondrán un producto agotado?', 'La fecha de reposición depende de la disponibilidad del proveedor.', 'respondida'),
(22, '¿Puedo reservar un producto?', 'Las opciones de reserva dependen del producto.', 'respondida'),
(22, '¿Cómo sé si un producto está disponible?', 'La disponibilidad aparece indicada en la ficha del producto.', 'respondida'),
(23, '¿Los precios incluyen impuestos?', 'Los precios mostrados incluyen los impuestos correspondientes.', 'respondida'),
(23, '¿Dónde puedo consultar los precios?', 'Los precios aparecen en la página de cada producto.', 'respondida'),
(24, '¿Hay descuentos para clientes?', 'Disponemos de promociones que pueden variar según el momento.', 'respondida'),
(24, '¿Cómo puedo utilizar un código promocional?', 'Introduzca el código durante el proceso de compra.', 'respondida'),
(25, 'Mi código de descuento no funciona.', 'Compruebe que el código esté vigente y correctamente escrito.', 'respondida'),
(25, '¿Puedo utilizar dos descuentos a la vez?', 'Depende de las condiciones de cada promoción.', 'respondida'),
(26, '¿Puedo recibir información de las ofertas?', 'Sí, puede suscribirse a nuestro boletín de ofertas.', 'respondida'),
(26, '¿Cómo puedo dejar de recibir publicidad?', 'Puede darse de baja desde el enlace incluido en nuestros correos.', 'respondida'),
(27, '¿Cómo puedo actualizar mi correo electrónico?', 'Puede modificarlo desde la configuración de su cuenta.', 'respondida'),
(27, 'He cambiado de número de teléfono.', 'Puede actualizar su teléfono desde su perfil.', 'respondida'),
(28, '¿Puedo eliminar mi cuenta?', 'Sí, puede solicitar la eliminación de su cuenta.', 'respondida'),
(28, '¿Qué ocurre con mis datos si elimino la cuenta?', 'Los datos serán tratados conforme a nuestra política de privacidad.', 'respondida'),
(29, '¿Cómo puedo consultar mis pedidos anteriores?', 'Puede consultar el historial de pedidos desde su cuenta.', 'respondida'),
(29, 'Necesito una factura de un pedido antiguo.', 'Podemos ayudarle a localizar la factura correspondiente.', 'respondida'),
(30, '¿Puedo descargar mis facturas?', 'Sí, puede descargarlas desde el apartado correspondiente de su cuenta.', 'respondida'),
(30, 'Necesito cambiar los datos de una factura.', 'Contacte con atención al cliente para revisar el caso.', 'respondida'),
(31, '¿Trabajan los fines de semana?', 'El servicio de atención funciona en el horario indicado en nuestra página.', 'respondida'),
(31, '¿Puedo contactar fuera del horario de atención?', 'Puede dejar su consulta y responderemos durante el siguiente horario laboral.', 'respondida'),
(32, '¿Dónde puedo encontrar las condiciones de compra?', 'Las condiciones están disponibles en nuestra página web.', 'respondida'),
(32, '¿Dónde está la política de devoluciones?', 'Puede consultarla en el apartado de condiciones y devoluciones.', 'respondida'),
(33, '¿Cómo puedo presentar una reclamación?', 'Puede presentar su reclamación mediante nuestro servicio de atención al cliente.', 'respondida'),
(33, 'Quiero hablar con un responsable.', 'Tras revisar su caso podemos derivarlo al departamento correspondiente.', 'respondida'),
(34, '¿Puedo comprar desde otro país?', 'Sí, dependiendo del país podemos ofrecer servicio de compra y envío.', 'respondida'),
(34, '¿Cuáles son los gastos internacionales?', 'Los gastos dependen del país de destino.', 'respondida'),
(35, '¿Puedo cambiar el idioma de la página?', 'Sí, puede seleccionar el idioma disponible en la página.', 'respondida'),
(35, '¿Tienen atención al cliente en otros idiomas?', 'Consulte los idiomas disponibles en nuestro servicio de atención.', 'respondida'),
(36, '¿Cómo puedo saber si mi pedido ha sido enviado?', 'Recibirá una notificación cuando el pedido sea enviado.', 'respondida'),
(36, 'No he recibido el correo de confirmación.', 'Compruebe la carpeta de spam y verifique que su correo sea correcto.', 'respondida'),
(37, '¿Puedo recibir el pedido en otra dirección?', 'Sí, puede indicar una dirección diferente durante la compra.', 'respondida'),
(37, '¿Puedo recoger el pedido personalmente?', 'Las opciones de recogida dependen del servicio disponible.', 'respondida'),
(38, '¿Qué hago si no estoy en casa cuando llegue el pedido?', 'La empresa de transporte podrá intentar una nueva entrega.', 'respondida'),
(38, '¿Puedo contactar con el transportista?', 'Los datos de contacto estarán disponibles en la información de seguimiento.', 'respondida'),
(39, '¿Puedo solicitar un reembolso?', 'Sí, cuando se cumplan las condiciones de devolución.', 'respondida'),
(39, '¿Cuánto tarda un reembolso?', 'El tiempo depende del método de pago utilizado.', 'respondida'),
(40, '¿Dónde puedo consultar mis datos de cliente?', 'Puede consultar sus datos desde su perfil.', 'respondida'),
(40, 'Quiero cambiar mi nombre.', 'Puede solicitar la modificación de sus datos personales.', 'respondida'),
(41, '¿Cómo puedo contactar con soporte técnico?', 'Puede realizar su consulta mediante este servicio de atención.', 'respondida'),
(41, 'Tengo un problema con la página web.', 'Indíquenos el problema y trataremos de ayudarle.', 'respondida'),
(42, 'La página no me permite realizar el pago.', 'Compruebe los datos de pago o pruebe otro método disponible.', 'respondida'),
(42, 'Mi pago aparece pendiente.', 'Vamos a revisar el estado de la operación.', 'respondida'),
(43, 'Me han cobrado dos veces.', 'Enviaremos la incidencia al departamento correspondiente para revisarla.', 'respondida'),
(43, '¿Cómo puedo demostrar el pago?', 'Puede utilizar el justificante de la operación bancaria.', 'respondida'),
(44, '¿Puedo cambiar mi método de pago?', 'Depende del estado actual del pedido.', 'respondida'),
(44, 'El pago ha sido rechazado.', 'Compruebe los datos introducidos o utilice otro método de pago.', 'respondida'),
(45, '¿Cómo puedo conocer las novedades?', 'Puede consultar nuestra página y suscribirse a las novedades.', 'respondida'),
(45, '¿Tienen algún catálogo?', 'Puede consultar nuestros productos disponibles en la página web.', 'respondida'),
(46, '¿Puedo recibir recomendaciones de productos?', 'Sí, podemos orientarle según sus necesidades.', 'respondida'),
(46, 'Necesito ayuda para elegir un producto.', 'Indíquenos qué características busca y le ayudaremos.', 'respondida'),
(47, '¿Puedo cambiar un producto por otro modelo?', 'Sí, dependiendo de la disponibilidad y las condiciones de cambio.', 'respondida'),
(47, '¿Qué ocurre si el producto que quiero cambiar está agotado?', 'Podemos ofrecerle las alternativas disponibles.', 'respondida'),
(48, '¿Cómo puedo saber el estado de mi reclamación?', 'Puede solicitar información sobre su reclamación a atención al cliente.', 'respondida'),
(48, 'Todavía no he recibido respuesta a mi reclamación.', 'Comprobaremos el estado de su solicitud.', 'respondida'),
(49, '¿Puedo solicitar información sobre un pedido antiguo?', 'Sí, podemos consultar el historial disponible.', 'respondida'),
(49, 'Necesito ayuda con una compra anterior.', 'Indíquenos los datos del pedido y revisaremos el caso.', 'respondida'),
(50, '¿Cómo puedo contactar con atención al cliente?', 'Puede contactar con nosotros mediante este servicio de atención.', 'respondida'),
(50, '¿Puedo realizar varias consultas?', 'Sí, puede realizar todas las consultas que necesite.', 'respondida');

COMMIT;
