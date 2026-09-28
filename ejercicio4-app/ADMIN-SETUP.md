# Configuración del acceso de administración

El backend necesita estas variables de entorno:

- `ADMIN_USERNAME`: usuario para el panel.
- `ADMIN_PASSWORD`: contraseña privada para ese usuario.
- `ADMIN_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres para firmar las sesiones.

En Render, añádelas en **Environment** del servicio backend y vuelve a desplegarlo. Para desarrollo local, añádelas al `.env` del backend. No pongas estos valores en el frontend ni los subas a GitHub.

Puedes crear el secreto con `openssl rand -hex 32` y guardar el resultado como `ADMIN_SESSION_SECRET`. La sesión dura 8 horas y se cierra al pulsar **Cerrar sesión**. El sistema usa un usuario y contraseña configurados en el entorno; todos los responsables que lo utilicen compartirán esas credenciales.

Las listas de clientes y consultas, así como sus rutas de lectura, edición y borrado, requieren una sesión de administración. El alta de clientes sigue siendo pública desde **Administración**. El registro manual de consultas y respuestas también requiere sesión de administración. El chatbot público conserva su flujo propio para atender consultas de clientes.
