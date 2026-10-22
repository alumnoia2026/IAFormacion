# Chatbot de atención al cliente

Proyecto educativo con frontend React, API FastAPI, MySQL y Gemini. Los registros incluidos en `database/schema.sql` son ficticios y sirven para practicar.

## Requisitos

- Python 3.11
- Node.js 18 o superior y npm
- MySQL 8 o MariaDB 10
- Una clave de Google AI Studio para respuestas Gemini (opcional; sin ella funciona el modo local)

## 1. Base de datos

Desde la raíz del proyecto, ejecuta:

```bash
mysql -u root -p < database/schema.sql
```

El script crea `atencion_db`, las tablas `clientes` y `atencion_cliente`, 50 clientes y 100 consultas.

## 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Copia `backend/.env.example` a `backend/.env` y configura el acceso MySQL. Añade `GOOGLE_API_KEY` para habilitar Gemini. Inicia la API:

```bash
uvicorn main:app --reload
```

Documentación interactiva: http://127.0.0.1:8000/docs

Para usar Conda en lugar del entorno virtual, desde `backend/` ejecuta `conda env create -f environment.yml` y `conda activate chatbot`.

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Copia `frontend/.env.example` a `frontend/.env` si necesitas cambiar la URL de la API. Después ejecuta `npm start` y abre http://localhost:3000.

## Uso

Selecciona uno de los clientes de prueba e inicia una conversación. Cada sesión conserva contexto en memoria mientras el proceso de API está activo. La ruta `POST /api/chat` registra consultas y respuestas en MySQL. En modo local, la respuesta informa de la consulta reciente más parecida del cliente; Gemini utiliza los datos del cliente y sus últimas consultas como contexto.

## Cuaderno de pruebas

Abre `backend/pruebas.ipynb` desde Jupyter, selecciona el kernel del entorno y sigue las celdas en orden para comprobar conexión, clientes, API y conversación.

## Estructura

```text
chatbot-atencion-cliente/
├── README.md
├── database/schema.sql
├── backend/ (FastAPI, lógica, configuración y cuaderno)
├── frontend/ (React con react-scripts, sin Vite)
└── docs/Guia_paso_a_paso.pdf
```
