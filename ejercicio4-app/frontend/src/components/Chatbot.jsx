import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../config";

const mensajeInicial = {
  role: "assistant",
  kind: "greeting",
  content: "¡Hola! Soy el asistente de atención al cliente. ¿Qué necesitas saber sobre pedidos, envíos, pagos o devoluciones?"
};

const BASE_API_URL = API_URL || "http://localhost:3001/api";

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensajes, setMensajes] = useState([mensajeInicial]);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const listaRef = useRef(null);
  const recognitionRef = useRef(null);
  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  useEffect(() => {
    if (abierto && listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [abierto, mensajes]);

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
        setMensaje((actual) => [actual.trim(), transcript].filter(Boolean).join(" "));
      }
    };
    recognition.onerror = (event) => {
      const mensajesError = {
        "not-allowed": "Permite el acceso al micrófono en el navegador para dictar.",
        "service-not-allowed": "El navegador no permite el reconocimiento de voz.",
        "no-speech": "No se detectó voz. Inténtalo de nuevo."
      };
      setError(mensajesError[event.error] || "No se pudo reconocer la voz. Puedes escribir la consulta.");
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

  const enviar = async (event) => {
    event.preventDefault();
    const texto = mensaje.trim();
    if (!texto || enviando) return;

    const introduciendoNombre = !customer && awaitingName;
    const userMessage = {
      role: "user",
      content: texto,
      ...(introduciendoNombre ? { kind: "identity" } : {})
    };

    const siguientesMensajes = [...mensajes, userMessage];
    setMensajes(siguientesMensajes);
    setMensaje("");
    setEnviando(true);
    setError("");

    let conversation;
    if (customer) {
      conversation = siguientesMensajes
        .filter((message) => message.kind !== "identity" && message.kind !== "greeting")
        .slice(-10)
        .map(({ role, content: textContent, kind }) => ({ role, content: textContent, kind }));
    } else if (introduciendoNombre && pendingQuestion) {
      conversation = [{ role: "user", content: pendingQuestion }];
    } else {
      conversation = [{ role: "user", content: texto }];
    }

    try {
      const respuesta = await fetch(`${BASE_API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation,
          customerName: customer?.fullName || (introduciendoNombre ? texto : "")
        })
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo obtener una respuesta.");

      if (datos.needsName) {
        if (!customer && !introduciendoNombre) setPendingQuestion(texto);
        setAwaitingName(true);
      }
      if (datos.needsSupport) {
        setCustomer(null);
        setAwaitingName(false);
        setPendingQuestion("");
      }
      if (datos.customer) {
        setCustomer({
          ...datos.customer,
          fullName: `${datos.customer.nombre} ${datos.customer.apellido}`
        });
        setAwaitingName(false);
        setPendingQuestion("");
      }

      setMensajes((actuales) => [
        ...actuales,
        {
          role: "assistant",
          content: datos.reply || datos.respuesta,
          ...((datos.needsName || datos.needsSupport) ? { kind: "identity" } : {})
        }
      ]);
    } catch (errorChatbot) {
      try {
        const respuestaLegacy = await fetch(`${BASE_API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje: texto })
        });

        const datosLegacy = await respuestaLegacy.json();
        if (!respuestaLegacy.ok) throw new Error(datosLegacy.error || "No se pudo obtener una respuesta.");

        setMensajes((actuales) => [
          ...actuales,
          { role: "assistant", content: datosLegacy.respuesta || datosLegacy.reply }
        ]);
      } catch (legacyError) {
        setError(legacyError.message || errorChatbot.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  const placeholder = !customer && awaitingName
    ? "Escribe tu nombre y apellido registrados…"
    : "Escribe tu consulta…";

  return (
    <>
      {abierto && (
        <aside className="chat-panel" aria-label="Chat de atención al cliente">
          <div className="chat-cabecera">
            <div>
              <strong>Asistente virtual</strong>
              <span>Atención personalizada para clientes registrados</span>
            </div>
            <button className="chat-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar chat">
              ×
            </button>
          </div>
          <div className="chat-mensajes" ref={listaRef} aria-live="polite">
            {mensajes.map((item, index) => (
              <div className={`chat-mensaje ${item.role || item.tipo}`} key={`${index}-${item.role || item.tipo}`}>
                {item.content || item.texto}
              </div>
            ))}
            {enviando && <div className="chat-mensaje bot">Estoy buscando una respuesta…</div>}
          </div>
          {error && <div className="chatbot-error" role="alert">{error}</div>}
          <form className="chat-formulario" onSubmit={enviar}>
            <input
              aria-label={placeholder}
              placeholder={placeholder}
              value={mensaje}
              onChange={(event) => setMensaje(event.target.value)}
              maxLength={2000}
              disabled={enviando}
            />
            <button
              type="button"
              className={`chatbot-mic${listening ? " listening" : ""}`}
              onClick={alternarMicrofono}
              disabled={enviando || !SpeechRecognition}
              aria-label={listening ? "Detener dictado" : "Dictar consulta"}
              title={!SpeechRecognition ? "El navegador no admite dictado por voz" : listening ? "Detener dictado" : "Dictar consulta"}
            >
              {listening ? "⏹️" : "🎙️"}
            </button>
            <button type="submit" disabled={!mensaje.trim() || enviando}>Enviar</button>
          </form>
          <p className="chatbot-note">
            Indica tu nombre y apellido registrados. Las consultas y respuestas se guardan en tu ficha de atención.
          </p>
        </aside>
      )}
      <button className="chat-boton" onClick={() => setAbierto((valor) => !valor)} aria-label={abierto ? "Cerrar asistente" : "Abrir asistente"}>
        {abierto ? "Cerrar" : "¿Necesitas ayuda?"}
      </button>
    </>
  );
}

export default Chatbot;

  );
}

export default Chatbot;
