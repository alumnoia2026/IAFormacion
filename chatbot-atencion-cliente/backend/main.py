import os
import logging
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from chatbot_core import ChatbotCore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()
app = FastAPI(title="Chatbot de atención al cliente", version="1.0.0")
origin_value = os.getenv("CORS_ORIGINS") or os.getenv("FRONTEND_ORIGINS", "http://localhost:3000")
origins = [item.strip() for item in origin_value.split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
core = ChatbotCore()

class ChatRequest(BaseModel):
    client_id: int = Field(gt=0)
    message: str = Field(min_length=1, max_length=4000)
    session_id: str | None = None

@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/clients")
def clients():
    conn = core.connect()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, nombre, apellidos, plan FROM clientes WHERE activo=1 ORDER BY id")
        return cur.fetchall()
    except Exception as exc:
        raise HTTPException(status_code=503, detail="No se pudo consultar MySQL. Revisa la configuración del backend.") from exc
    finally:
        conn.close()

@app.get("/clientes/{id}/historial")
def client_history(id: int):
    try:
        client = core.get_client(id)
        if not client:
            raise HTTPException(status_code=404, detail="No se encontró el cliente indicado.")
        return {"cliente_id": id, "historial": core.get_history(id, limit=100)}
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("No se pudo consultar el historial del cliente %s", id)
        raise HTTPException(status_code=503, detail="No se pudo consultar el historial. Revisa la conexión con MySQL.") from exc

@app.post("/api/chat")
def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid4())
    try:
        client = core.get_client(request.client_id)
        if not client:
            raise HTTPException(status_code=404, detail="No se encontró el cliente indicado.")
        history = core.get_history(request.client_id)
        answer = core.answer(session_id, client, request.message.strip(), history)
        core.save_interaction(request.client_id, request.message.strip(), answer)
        return {"session_id": session_id, "answer": answer}
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("No se pudo completar POST /api/chat")
        raise HTTPException(status_code=503, detail="No se pudo responder. Comprueba MySQL y la configuración de Gemini.") from exc

@app.delete("/api/sessions/{session_id}")
def clear_session(session_id: str):
    core.clear_memory(session_id)
    return {"status": "cleared"}
