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
