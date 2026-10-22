# Mi primer proyecto React + Node.js

Este proyecto está dividido en dos partes. **Frontend** es la página que ves en el navegador; **backend** es el servidor que se conecta de forma segura con Cloudflare Workers AI para crear imágenes. Los dos se ejecutan por separado.

## Antes de empezar

Instala Node.js (versión 18 o superior). Para generar imágenes también necesitas una cuenta de Cloudflare y configurar sus credenciales como se explica abajo. Después, abre dos terminales en la carpeta de este proyecto.

## Preparar DeepL y Cloudflare (una vez)

1. Crea una cuenta de desarrollador de DeepL y solicita una clave del plan **DeepL API Free**. DeepL indica que el alta no requiere tarjeta de crédito y que el plan incluye hasta 500.000 caracteres al mes.
2. En el panel de Cloudflare, abre **Workers AI** y crea un token para usar la API REST. El token necesita permisos de Workers AI para tu cuenta.
3. Copia también el **Account ID** de Cloudflare que aparece en esa página.
4. Entra en la carpeta `backend` y crea un archivo llamado `.env` copiando el contenido de `.env.example`.
5. Abre `backend/.env` y sustituye los valores de ejemplo por la clave de DeepL, el Account ID y el token de Cloudflare.

El archivo `.env` guarda datos privados y no se debe compartir. La clave de DeepL y el token de Cloudflare se utilizan solo en el backend, nunca en React. Cloudflare Workers AI puede requerir activar el servicio en tu cuenta.

### 1. Arrancar el backend

En la primera terminal, desde la carpeta principal del proyecto:

```bash
cd backend
npm install
npm start
```

Deja esa terminal abierta. El servidor mostrará `Backend listo en http://localhost:4000`.

### 2. Arrancar el frontend

En la segunda terminal, desde la carpeta principal del proyecto:

```bash
cd frontend
npm install
npm start
```

Se abrirá la página en `http://localhost:3000`. Escribe una descripción y pulsa **Generar imagen**. Mantén abiertas dos terminales: una ejecuta el backend en `http://localhost:4000` y otra el frontend en `http://localhost:3000`. Para dictar, pulsa **Dictar**. Cuando el navegador reconozca la frase, el backend la envía a DeepL API Free para traducirla al inglés y pasa esa traducción a `FLUX.2 dev` con CFG (guidance) en 8. DeepL detecta automáticamente el idioma de origen. El dictado usa el reconocimiento del navegador y requiere uno compatible (por ejemplo, Chrome o Edge) y permiso para el micrófono.

## ¿Dónde escribo cada cosa?

```text
proyecto-react-ia/
├── frontend/                 La web React
│   ├── public/index.html     Página HTML inicial
│   ├── src/App.js            Caja de texto y petición para generar la imagen
│   ├── src/App.css           Estilos de la página
│   ├── src/index.js          Arranca React
│   └── package.json          Dependencias y comandos del frontend
├── backend/                  El servidor Node.js
│   ├── server.js             Traduce con DeepL y envía el prompt a FLUX.2 dev
│   ├── .env.example          Plantilla para tus credenciales de Cloudflare
│   └── package.json          Dependencias y comandos del backend
└── README.md                 Esta guía
```

Cuando quieras cambiar el texto o el aspecto de la página, empieza por `frontend/src/App.js` y `frontend/src/App.css`. La traducción de DeepL y la comunicación con Cloudflare están en `backend/server.js`. Las credenciales se configuran en `backend/.env`.

## Conceptos básicos

- **React** construye la interfaz a partir de componentes. En este ejemplo, `App` es el componente principal.
- **Backend** es un programa que se mantiene ejecutándose y espera peticiones.
- **Ruta** es una dirección del backend. El proyecto usa `POST /api/generar-imagen`.
- **npm install** descarga las librerías indicadas en el `package.json` de esa carpeta.
- **npm start** ejecuta el proyecto. Frontend y backend tienen su propio `package.json`, por eso se instalan y arrancan por separado.

No necesitas configurar una base de datos para generar imágenes. La generación requiere conexión a Internet, credenciales válidas de Cloudflare y acceso a Workers AI.
