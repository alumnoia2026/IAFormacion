# Configuración del acceso de administración

El backend necesita esta variable de entorno para firmar las sesiones:

- `ADMIN_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres para firmar las sesiones.

En Render, añádela en **Environment** del servicio backend y vuelve a desplegarlo. Para desarrollo local, añádela al `.env` del backend. No pongas este valor en el frontend ni lo subas a GitHub.

Puedes crear el secreto con `openssl rand -hex 32` y guardar el resultado como `ADMIN_SESSION_SECRET`. La sesión dura 8 horas y se cierra al pulsar **Cerrar sesión**.

Antes del despliegue, ejecuta una sola vez `migracion-rol-clientes.sql` en la base de datos existente y cambia `Rol` a `Administrador` en la ficha del gerente. Las demás fichas conservan el rol predeterminado `Cliente`. El login usa nombre, apellidos y teléfono de esa ficha; el teléfono funciona como contraseña, por lo que es fácil de adivinar si alguien lo conoce.

Las listas de clientes y consultas, así como sus rutas de lectura, edición y borrado, requieren una sesión de administración. El alta de clientes sigue siendo pública desde **Administración** y recibe siempre el rol `Cliente`; el endpoint público ignora cualquier rol enviado desde el navegador. El registro manual de consultas y respuestas también requiere sesión de administración. El chatbot público conserva su flujo propio para atender consultas de clientes.
