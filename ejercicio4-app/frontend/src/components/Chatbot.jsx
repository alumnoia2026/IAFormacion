import React, { useRef, useState } from "react";
import { API_URL } from "../config";

const mensajeInicial = {
  role: "assistant",
  kind: "greeting",
  content: "¡Hola! Soy el asistente de atención al cliente. ¿En qué puedo ayudarte?"
};

function esConfirmacionDeRegistro(frase) {
  const normalizada = frase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  return /\b(ya me he registrado|ya me registre|ya estoy registrado|ya estoy registrada|estoy registrado|estoy registrada|me acabo de registrar)\b/.test(normalizada);
}

function Chatbot() {
  const [messages, setMessages] = useState([mensajeInicial]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const recognitionRef = useRef(null);
  const SpeechRecognition = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  const alternarMicrofono = () => {
    if (!SpeechRecognition) {
      setError("Tu navegador no admite dictado por voz. Puedes escribir la consulta.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    setError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        setText((current) => [current.trim(), transcript].filter(Boolean).join(" "));
      }
    };
    recognition.onerror = (event) => {
      const messagesByError = {
        "not-allowed": "Permite el acceso al micrófono en el navegador para dictar.",
        "service-not-allowed": "El navegador no permite el reconocimiento de voz.",
        "no-speech": "No se detectó voz. Inténtalo de nuevo."
      };
      setError(messagesByError[event.error] || "No se pudo reconocer la voz. Puedes escribir la consulta.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError("No se pudo iniciar el micrófono. Inténtalo de nuevo.");
    }
  };

  const enviarMensaje = async (event) => {
    event.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    const introducingName = !customer && awaitingName;
    const userMessage = {
      role: "user",
      content,
      ...(introducingName ? { kind: "identity" } : {})
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setText("");
    setSending(true);
    setError("");

    let conversation;
    if (customer) {
      conversation = nextMessages
        .filter((message) => message.kind !== "identity" && message.kind !== "greeting")
        .slice(-10)
        .map(({ role, content: messageContent, kind }) => ({ role, content: messageContent, kind }));
    } else {
      // Conserva los mensajes previos mientras se verifica la identidad. Así el
      // servidor puede volver a consultar el nombre si el cliente confirma registro.
      conversation = nextMessages
        .filter((message) => message.role === "user")
        .slice(-10)
        .map(({ role, content: messageContent, kind }) => ({ role, content: messageContent, kind }));
    }

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation,
          customerName: customer?.fullName || (introducingName && !esConfirmacionDeRegistro(content) ? content : "")
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");

      if (data.needsName) {
        if (!customer && !introducingName) setPendingQuestion(content);
        setAwaitingName(true);
      }
      if (data.needsSupport) {
        setCustomer(null);
        setAwaitingName(false);
        setPendingQuestion("");
      }
      if (data.customer) {
        setCustomer({
          ...data.customer,
          fullName: `${data.customer.nombre} ${data.customer.apellido}`
        });
        setAwaitingName(false);
        setPendingQuestion("");
      }

      setMessages((current) => [...current, {
        role: "assistant",
        content: data.reply,
        ...((data.needsName || data.needsSupport) ? { kind: "identity" } : {})
      }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

  const placeholder = !customer && awaitingName
    ? "Escribe tu nombre y apellido registrados…"
    : "Escribe tu consulta…";

  return (
    <aside className="chatbot" aria-label="Chat de atención al cliente">
      <div className="chatbot-heading">
        <div>
          <h3>Asistente virtual</h3>
          <p>Atención personalizada para clientes registrados</p>
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
          aria-label={placeholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          maxLength={2000}
          disabled={sending}
        />
        <button
          type="button"
          className={`chatbot-mic${listening ? " listening" : ""}`}
          onClick={alternarMicrofono}
          disabled={sending || !SpeechRecognition}
          aria-label={listening ? "Detener dictado" : "Dictar consulta"}
          title={!SpeechRecognition ? "El navegador no admite dictado por voz" : listening ? "Detener dictado" : "Dictar consulta"}
        >
          {listening ? "⏹️" : "🎙️"}
        </button>
        <button type="submit" disabled={sending || !text.trim()}>Enviar</button>
      </form>
      <p className="chatbot-note">
        Indica tu nombre y apellido registrados. Las consultas y respuestas se guardan en tu ficha de atención.
      </p>
    </aside>
  );
}

export default Chatbot;
