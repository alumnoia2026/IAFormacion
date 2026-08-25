-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2026 a las 12:21:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ejercicio4`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atencion_cliente`
--

CREATE TABLE `atencion_cliente` (
  `id` int(11) NOT NULL,
  `Consulta` text NOT NULL,
  `Respuesta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `atencion_cliente`
--

INSERT INTO `atencion_cliente` (`id`, `Consulta`, `Respuesta`) VALUES
(1, '¿Cuál es el horario de atención?', 'Nuestro horario es de lunes a viernes de 9:00 a 18:00.'),
(1, '¿Cómo puedo cambiar mi contraseña?', 'Puede cambiar su contraseña desde el apartado Mi Cuenta.'),
(2, '¿Cómo puedo realizar un pedido?', 'Puede realizar su pedido desde nuestra página web.'),
(2, '¿Qué métodos de pago aceptan?', 'Aceptamos tarjeta, transferencia bancaria y PayPal.'),
(3, '¿Puedo cancelar mi pedido?', 'Sí, puede cancelar el pedido antes de que sea enviado.'),
(3, '¿Cuánto tarda el envío?', 'El envío suele tardar entre 2 y 5 días laborables.'),
(4, '¿Realizan envíos internacionales?', 'Sí, realizamos envíos a varios países de Europa.'),
(4, '¿Cómo puedo devolver un producto?', 'Puede solicitar una devolución dentro de los 30 días posteriores a la compra.'),
(5, '¿Dónde puedo consultar mi factura?', 'Puede consultar sus facturas desde el apartado Mi Cuenta.'),
(5, '¿Puedo recibir la factura por correo?', 'Sí, podemos enviarle la factura a su correo electrónico.'),
(6, '¿Cómo puedo modificar mis datos personales?', 'Puede modificarlos desde su perfil de usuario.'),
(6, '¿Puedo cambiar mi dirección de envío?', 'Sí, puede modificarla antes de confirmar el pedido.'),
(7, '¿Cuánto cuesta el envío?', 'Los gastos de envío dependen del destino y del importe del pedido.'),
(7, '¿El envío es gratuito?', 'El envío es gratuito para pedidos superiores a 50 euros.'),
(8, '¿Cómo puedo hacer una devolución?', 'Debe solicitar la devolución desde su cuenta de cliente.'),
(8, '¿Cuánto tiempo tengo para devolver un producto?', 'Dispone de 30 días desde la recepción del pedido.'),
(9, '¿Puedo cambiar un producto?', 'Sí, puede solicitar un cambio dentro del plazo establecido.'),
(9, '¿Quién paga los gastos de devolución?', 'Depende del motivo de la devolución y de las condiciones de compra.'),
(10, '¿Dónde está mi pedido?', 'Puede consultar el estado del pedido desde su cuenta.'),
(10, '¿Puedo conocer el número de seguimiento?', 'Sí, recibirá el número de seguimiento por correo electrónico.'),
(11, '¿Qué tarjetas aceptan?', 'Aceptamos Visa, Mastercard y otras tarjetas compatibles.'),
(11, '¿Es seguro pagar con tarjeta?', 'Sí, utilizamos sistemas de pago seguros.'),
(12, '¿Puedo pagar mediante PayPal?', 'Sí, PayPal está disponible como método de pago.'),
(12, '¿Puedo pagar mediante transferencia?', 'Sí, ofrecemos la opción de transferencia bancaria.'),
(13, '¿Cómo creo una cuenta?', 'Puede registrarse utilizando el formulario de registro.'),
(13, '¿Es necesario crear una cuenta para comprar?', 'Puede consultar las opciones disponibles durante el proceso de compra.'),
(14, 'He olvidado mi contraseña.', 'Puede utilizar la opción Recuperar contraseña.'),
(14, 'No recibo el correo para cambiar la contraseña.', 'Compruebe la carpeta de correo no deseado o spam.'),
(15, '¿Cómo puedo contactar con atención al cliente?', 'Puede contactar con nosotros mediante este servicio de atención.'),
(15, '¿Cuánto tardan en responder?', 'Normalmente respondemos en un plazo de 24 horas laborables.'),
(16, '¿Puedo modificar un pedido?', 'Puede modificarlo mientras todavía no haya sido preparado para su envío.'),
(16, 'Quiero añadir un producto a mi pedido.', 'Si el pedido aún no ha sido procesado, podemos estudiar la modificación.'),
(17, '¿Cuándo recibiré mi pedido?', 'El plazo habitual de entrega es de 2 a 5 días laborables.'),
(17, 'Mi pedido está retrasado.', 'Vamos a comprobar el estado de su envío.'),
(18, '¿Puedo elegir una hora de entrega?', 'Las opciones de horario dependen de la empresa de transporte.'),
(18, '¿Puedo cambiar la dirección de entrega?', 'Sí, siempre que el pedido todavía no haya sido enviado.'),
(19, 'He recibido un producto incorrecto.', 'Lamentamos el inconveniente. Contacte con atención al cliente para solucionarlo.'),
(19, '¿Cómo puedo reclamar?', 'Puede presentar una reclamación mediante nuestro servicio de atención.'),
(20, 'El producto ha llegado dañado.', 'Envíenos información sobre el daño para poder gestionar la incidencia.'),
(20, '¿Me pueden enviar otro producto?', 'Sí, estudiaremos la sustitución según las condiciones de la compra.'),
(21, '¿Tienen productos en stock?', 'Puede consultar la disponibilidad directamente en la página del producto.'),
(21, '¿Cuándo repondrán un producto agotado?', 'La fecha de reposición depende de la disponibilidad del proveedor.'),
(22, '¿Puedo reservar un producto?', 'Las opciones de reserva dependen del producto.'),
(22, '¿Cómo sé si un producto está disponible?', 'La disponibilidad aparece indicada en la ficha del producto.'),
(23, '¿Los precios incluyen impuestos?', 'Los precios mostrados incluyen los impuestos correspondientes.'),
(23, '¿Dónde puedo consultar los precios?', 'Los precios aparecen en la página de cada producto.'),
(24, '¿Hay descuentos para clientes?', 'Disponemos de promociones que pueden variar según el momento.'),
(24, '¿Cómo puedo utilizar un código promocional?', 'Introduzca el código durante el proceso de compra.'),
(25, 'Mi código de descuento no funciona.', 'Compruebe que el código esté vigente y correctamente escrito.'),
(25, '¿Puedo utilizar dos descuentos a la vez?', 'Depende de las condiciones de cada promoción.'),
(26, '¿Puedo recibir información de las ofertas?', 'Sí, puede suscribirse a nuestro boletín de ofertas.'),
(26, '¿Cómo puedo dejar de recibir publicidad?', 'Puede darse de baja desde el enlace incluido en nuestros correos.'),
(27, '¿Cómo puedo actualizar mi correo electrónico?', 'Puede modificarlo desde la configuración de su cuenta.'),
(27, 'He cambiado de número de teléfono.', 'Puede actualizar su teléfono desde su perfil.'),
(28, '¿Puedo eliminar mi cuenta?', 'Sí, puede solicitar la eliminación de su cuenta.'),
(28, '¿Qué ocurre con mis datos si elimino la cuenta?', 'Los datos serán tratados conforme a nuestra política de privacidad.'),
(29, '¿Cómo puedo consultar mis pedidos anteriores?', 'Puede consultar el historial de pedidos desde su cuenta.'),
(29, 'Necesito una factura de un pedido antiguo.', 'Podemos ayudarle a localizar la factura correspondiente.'),
(30, '¿Puedo descargar mis facturas?', 'Sí, puede descargarlas desde el apartado correspondiente de su cuenta.'),
(30, 'Necesito cambiar los datos de una factura.', 'Contacte con atención al cliente para revisar el caso.'),
(31, '¿Trabajan los fines de semana?', 'El servicio de atención funciona en el horario indicado en nuestra página.'),
(31, '¿Puedo contactar fuera del horario de atención?', 'Puede dejar su consulta y responderemos durante el siguiente horario laboral.'),
(32, '¿Dónde puedo encontrar las condiciones de compra?', 'Las condiciones están disponibles en nuestra página web.'),
(32, '¿Dónde está la política de devoluciones?', 'Puede consultarla en el apartado de condiciones y devoluciones.'),
(33, '¿Cómo puedo presentar una reclamación?', 'Puede presentar su reclamación mediante nuestro servicio de atención al cliente.'),
(33, 'Quiero hablar con un responsable.', 'Tras revisar su caso podemos derivarlo al departamento correspondiente.'),
(34, '¿Puedo comprar desde otro país?', 'Sí, dependiendo del país podemos ofrecer servicio de compra y envío.'),
(34, '¿Cuáles son los gastos internacionales?', 'Los gastos dependen del país de destino.'),
(35, '¿Puedo cambiar el idioma de la página?', 'Sí, puede seleccionar el idioma disponible en la página.'),
(35, '¿Tienen atención al cliente en otros idiomas?', 'Consulte los idiomas disponibles en nuestro servicio de atención.'),
(36, '¿Cómo puedo saber si mi pedido ha sido enviado?', 'Recibirá una notificación cuando el pedido sea enviado.'),
(36, 'No he recibido el correo de confirmación.', 'Compruebe la carpeta de spam y verifique que su correo sea correcto.'),
(37, '¿Puedo recibir el pedido en otra dirección?', 'Sí, puede indicar una dirección diferente durante la compra.'),
(37, '¿Puedo recoger el pedido personalmente?', 'Las opciones de recogida dependen del servicio disponible.'),
(38, '¿Qué hago si no estoy en casa cuando llegue el pedido?', 'La empresa de transporte podrá intentar una nueva entrega.'),
(38, '¿Puedo contactar con el transportista?', 'Los datos de contacto estarán disponibles en la información de seguimiento.'),
(39, '¿Puedo solicitar un reembolso?', 'Sí, cuando se cumplan las condiciones de devolución.'),
(39, '¿Cuánto tarda un reembolso?', 'El tiempo depende del método de pago utilizado.'),
(40, '¿Dónde puedo consultar mis datos de cliente?', 'Puede consultar sus datos desde su perfil.'),
(40, 'Quiero cambiar mi nombre.', 'Puede solicitar la modificación de sus datos personales.'),
(41, '¿Cómo puedo contactar con soporte técnico?', 'Puede realizar su consulta mediante este servicio de atención.'),
(41, 'Tengo un problema con la página web.', 'Indíquenos el problema y trataremos de ayudarle.'),
(42, 'La página no me permite realizar el pago.', 'Compruebe los datos de pago o pruebe otro método disponible.'),
(42, 'Mi pago aparece pendiente.', 'Vamos a revisar el estado de la operación.'),
(43, 'Me han cobrado dos veces.', 'Enviaremos la incidencia al departamento correspondiente para revisarla.'),
(43, '¿Cómo puedo demostrar el pago?', 'Puede utilizar el justificante de la operación bancaria.'),
(44, '¿Puedo cambiar mi método de pago?', 'Depende del estado actual del pedido.'),
(44, 'El pago ha sido rechazado.', 'Compruebe los datos introducidos o utilice otro método de pago.'),
(45, '¿Cómo puedo conocer las novedades?', 'Puede consultar nuestra página y suscribirse a las novedades.'),
(45, '¿Tienen algún catálogo?', 'Puede consultar nuestros productos disponibles en la página web.'),
(46, '¿Puedo recibir recomendaciones de productos?', 'Sí, podemos orientarle según sus necesidades.'),
(46, 'Necesito ayuda para elegir un producto.', 'Indíquenos qué características busca y le ayudaremos.'),
(47, '¿Puedo cambiar un producto por otro modelo?', 'Sí, dependiendo de la disponibilidad y las condiciones de cambio.'),
(47, '¿Qué ocurre si el producto que quiero cambiar está agotado?', 'Podemos ofrecerle las alternativas disponibles.'),
(48, '¿Cómo puedo saber el estado de mi reclamación?', 'Puede solicitar información sobre su reclamación a atención al cliente.'),
(48, 'Todavía no he recibido respuesta a mi reclamación.', 'Comprobaremos el estado de su solicitud.'),
(49, '¿Puedo solicitar información sobre un pedido antiguo?', 'Sí, podemos consultar el historial disponible.'),
(49, 'Necesito ayuda con una compra anterior.', 'Indíquenos los datos del pedido y revisaremos el caso.'),
(50, '¿Cómo puedo contactar con atención al cliente?', 'Puede contactar con nosotros mediante este servicio de atención.'),
(50, '¿Puedo realizar varias consultas?', 'Sí, puede realizar todas las consultas que necesite.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_personales`
--

CREATE TABLE `datos_personales` (
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `edad` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_personales`
--

INSERT INTO `datos_personales` (`nombre`, `apellidos`, `edad`) VALUES
('Manuel', 'Mancebo', 62),
('Juan', 'Martinez', 55),
('jose', 'Vidal', 64),
('Antonio', 'Mancebo', 60),
('Procopio', 'Sanchez', 57),
('Procopio', 'Sanchez', 57);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `atencion_cliente`
--
ALTER TABLE `atencion_cliente`
  ADD KEY `id` (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `atencion_cliente`
--
ALTER TABLE `atencion_cliente`
  ADD CONSTRAINT `atencion_cliente_ibfk_1` FOREIGN KEY (`id`) REFERENCES `clientes` (`id_cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
