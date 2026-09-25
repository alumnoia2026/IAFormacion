import React, { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:3001/api/chat";

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensajes, setMensajes] = useState([
    { tipo: "bot", texto: "¡Hola! Soy el asistente de atención al cliente. ¿Qué necesitas saber sobre pedidos, envíos, pagos o devoluciones?" }
  ]);
  const listaRef = useRef(null);

  useEffect(() => {
    if (abierto && listaRef.current) listaRef.current.scrollTop = listaRef.current.scrollHeight;
  }, [abierto, mensajes]);

  const enviar = async (event) => {
    event.preventDefault();
    const texto = mensaje.trim();
    if (!texto || enviando) return;
    setMensajes((actuales) => [...actuales, { tipo: "usuario", texto }]);
    setMensaje("");
    setEnviando(true);
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto })
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo obtener una respuesta.");
      setMensajes((actuales) => [...actuales, { tipo: "bot", texto: datos.respuesta }]);
    } catch (error) {
      setMensajes((actuales) => [...actuales, { tipo: "bot", texto: `${error.message} Comprueba que el backend esté en marcha.` }]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {abierto && <aside className="chat-panel" aria-label="Chat de atención al cliente">
        <div className="chat-cabecera">
          <div><strong>Asistente de atención</strong><span>Respuestas a preguntas frecuentes</span></div>
          <button className="chat-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar chat">×</button>
        </div>
        <div className="chat-mensajes" ref={listaRef} aria-live="polite">
          {mensajes.map((item, index) => <div className={`chat-mensaje ${item.tipo}`} key={index}>{item.texto}</div>)}
          {enviando && <div className="chat-mensaje bot">Estoy buscando una respuesta…</div>}
        </div>
        <form className="chat-formulario" onSubmit={enviar}>
          <input aria-label="Escribe tu pregunta" placeholder="Escribe tu pregunta…" value={mensaje} onChange={(event) => setMensaje(event.target.value)} maxLength={1000} />
          <button type="submit" disabled={!mensaje.trim() || enviando}>Enviar</button>
        </form>
      </aside>}
      <button className="chat-boton" onClick={() => setAbierto((valor) => !valor)} aria-label={abierto ? "Cerrar asistente" : "Abrir asistente"}>
        {abierto ? "Cerrar" : "¿Necesitas ayuda?"}
      </button>
    </>
  );
}

export default Chatbot;
