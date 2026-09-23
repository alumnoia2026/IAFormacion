# Ejercicio 4 - React + Node.js + Express + MySQL

## 1. Base de datos

Crea una base de datos llamada `ejercicio4` e importa `ejercicio4.sql`.

En MySQL:

```sql
CREATE DATABASE ejercicio4
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
```

Después:

```bash
mysql -u root -p ejercicio4 < ejercicio4.sql
```

También puedes importar el SQL desde phpMyAdmin.

## 2. Backend

```bash
cd backend
npm install
```

Edita `.env` con tus datos de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ejercicio4
DB_PORT=3306
```

Arranca:

```bash
npm run dev
```

API:

- http://localhost:3000
- http://localhost:3000/api/clientes
- http://localhost:3000/api/atencion
- http://localhost:3000/api/chatbot

### Chatbot

El chatbot de la página de clientes llama a `POST /api/chatbot`. El backend consulta las preguntas y respuestas previas de atención como contexto y solicita la respuesta a Google Gemini mediante su API Interactions:

```env
GEMINI_API_KEY=tu_clave_secreta
GEMINI_MODEL=gemini-3.8-flash
```

Configura `GEMINI_API_KEY` únicamente en las variables de entorno del servicio backend en Render. No pongas la clave en el frontend ni publiques el archivo `.env`. Puedes usar `backend/.env.example` como referencia para las variables locales. El archivo `frontend/.env.example` muestra cómo cambiar la URL de la API; en Render Static Site configura `VITE_API_URL` con la URL pública del backend seguida de `/api` si cambia el dominio.

El chatbot no guarda sus mensajes en MySQL y envía las conversaciones a Gemini con `store: false`. El formulario de Atención al cliente existente sí sigue creando registros en `atencion_cliente` y enviando a Zapier las consultas sin respuesta cuando `ZAPIER_WEBHOOK_URL` está configurada en el backend.

El servidor limita el contenido a 20 KB, cada texto a 2.000 caracteres y aplica un límite básico de 20 mensajes por IP cada 15 minutos. Para producción con varias instancias, conviene mover el límite a un almacén compartido y proteger la gestión de clientes con autenticación.

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre la dirección que indique Vite, normalmente:

http://localhost:5173

## 4. Funcionalidades

- Listar clientes
- Crear clientes
- Obtener cliente por ID
- Actualizar clientes
- Eliminar clientes
- Listar atenciones
- Crear atenciones
- Obtener atención por ID
- Actualizar atenciones
- Eliminar atenciones
- Pool de conexiones MySQL
- CORS
- React Hooks
- Fetch API
