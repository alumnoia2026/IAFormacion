import React, { useState } from "react";
import { API_URL } from "../config";

const mensajeInicial = {
  role: "assistant",
  content: "¡Hola! Soy el asistente de atención al cliente. ¿En qué puedo ayudarte?"
};

function Chatbot() {
  const [messages, setMessages] = useState([mensajeInicial]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const enviarMensaje = async (event) => {
    event.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setText("");
    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="chatbot" aria-label="Chat de atención al cliente">
      <div className="chatbot-heading">
        <div>
          <h3>Asistente virtual</h3>
          <p>Respuestas sobre pedidos, pagos y devoluciones</p>
        </div>
        <span className="chatbot-status">En línea</span>
      </div>
      <div className="chatbot-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${index}-${message.role}`} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {sending && <div className="chat-message assistant">Estoy preparando una respuesta…</div>}
      </div>
      {error && <div className="chatbot-error" role="alert">{error}</div>}
      <form className="chatbot-form" onSubmit={enviarMensaje}>
        <input
          aria-label="Escribe tu mensaje"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe tu consulta…"
          maxLength={2000}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()}>Enviar</button>
      </form>
      <p className="chatbot-note">La conversación no se guarda en la base de datos.</p>
    </aside>
  );
}

export default Chatbot;
