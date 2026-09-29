# Configuración del acceso de administración

El backend necesita esta variable de entorno para firmar las sesiones:

- `ADMIN_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres para firmar las sesiones.

En Render, añádela en **Environment** del servicio backend y vuelve a desplegarlo. Para desarrollo local, añádela al `.env` del backend. No pongas este valor en el frontend ni lo subas a GitHub.

Puedes crear el secreto con `openssl rand -hex 32` y guardar el resultado como `ADMIN_SESSION_SECRET`. La sesión dura 8 horas y se cierra al pulsar **Cerrar sesión**.

Antes del despliegue, ejecuta una sola vez `migracion-rol-clientes.sql` en la base de datos existente y cambia `Rol` a `Administrador` en la ficha del gerente. Las demás fichas conservan el rol predeterminado `Cliente`. Clientes y administradores inician sesión con nombre, apellidos y teléfono de su ficha; el teléfono funciona como contraseña, por lo que es fácil de adivinar si alguien lo conoce.

Tras iniciar sesión, un cliente ve únicamente su perfil y sus consultas; el formulario de alta se oculta. Un administrador puede consultar las listas, registrar clientes y gestionar manualmente consultas y respuestas. Las rutas administrativas comprueban el rol en el backend. El alta pública de clientes recibe siempre el rol `Cliente`, incluso si alguien intenta enviar otro rol desde el navegador. El chatbot público conserva su flujo propio para atender consultas.
