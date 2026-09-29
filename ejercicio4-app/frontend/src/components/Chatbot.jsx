import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../config";

const mensajeInicial = {
  role: "assistant",
  kind: "greeting",
  content: "¡Hola! Soy el asistente de atención al cliente. ¿En qué puedo ayudarte?"
};

function esConfirmacionRegistro(frase) {
  const normalizada = frase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const respuestaBreve = /^(si|vale|ok|okay|de acuerdo|perfecto|genial|listo|lista|hecho|hecha|correcto|correcta|ya|ya esta|ya esta hecho|ya esta hecha)$/.test(normalizada);
  const sinCortesia = normalizada.replace(/^(?:(?:si|vale|ok|okay|perfecto|genial|correcto|claro|de acuerdo|listo|lista|hecho|hecha)\s+)+/, "");
  const accionConfirmada = sinCortesia.replace(/^(?:ya|ahora|al final)\s+/, "");
  const respuestaBreveConCortesia = /^(si|ya|ya esta|ya esta hecho|ya esta hecha|hecho|hecha|listo|lista|correcto|correcta)$/.test(accionConfirmada);
  const confirmaRegistro = /^(?:lo hice|lo he hecho|lo complete|lo he completado|esta hecho|esta hecho ya|lo tengo hecho|lo tengo listo|ya estoy|ya estoy registrado|ya estoy registrada|me registre|me he registrado|me acabo de registrar|acabo de registrarme|me di de alta|ya me di de alta|me he dado de alta|acabo de darme de alta|estoy dado de alta|estoy dada de alta|estoy registrado|estoy registrada|he completado el registro|complete el registro|termine el registro|he terminado el registro|finalice el registro|hice el registro|he hecho el registro|registre mis datos|he registrado mis datos|cree la cuenta|he creado la cuenta|ya tengo cuenta|tengo cuenta|el registro esta hecho|el registro esta completo|el registro esta completado|la cuenta esta creada|la cuenta esta activada)$/.test(accionConfirmada);
  return respuestaBreve || respuestaBreveConCortesia || confirmaRegistro;
}

function incluyePresentacionNombre(frase) {
  return /\b(?:me llamo|mi nombre es|soy)\s+[\p{L}][\p{L}'’-]*(?:\s+[\p{L}][\p{L}'’-]*){1,3}/iu.test(frase);
}

function Chatbot({ authenticatedUser, authToken, authChecking = false, onSessionExpired }) {
  const [messages, setMessages] = useState([mensajeInicial]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [awaitingRegistration, setAwaitingRegistration] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const recognitionRef = useRef(null);
  const SpeechRecognition = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  useEffect(() => {
    if (authChecking) return;
    if (authenticatedUser) {
      const fullName = `${authenticatedUser.nombre} ${authenticatedUser.apellido}`.trim();
      setCustomer({ id: authenticatedUser.id_cliente, nombre: authenticatedUser.nombre, apellido: authenticatedUser.apellido, fullName });
      setAwaitingName(false);
      setCandidateName("");
      setAwaitingRegistration(false);
      setPendingQuestion("");
      setMessages([{ role: "assistant", kind: "greeting", content: `Hola, ${fullName}. Ya he identificado tu cuenta. ¿En qué puedo ayudarte?` }]);
    } else {
      setCustomer(null);
      setAwaitingName(false);
      setCandidateName("");
      setAwaitingRegistration(false);
      setPendingQuestion("");
      setMessages([mensajeInicial]);
    }
    setError("");
  }, [authenticatedUser?.id_cliente, authChecking]);

  useEffect(() => {
    const abrirChat = () => setIsOpen(true);
    window.addEventListener("open-support-chat", abrirChat);
    return () => window.removeEventListener("open-support-chat", abrirChat);
  }, []);

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
    if (!content || sending || authChecking) return;

    const confirmingRegistration = !customer && awaitingRegistration && esConfirmacionRegistro(content);
    const introducingName = !customer && awaitingName && !confirmingRegistration;
    const introducedNameWithQuestion = !customer && !awaitingName && incluyePresentacionNombre(content);
    const userMessage = {
      role: "user",
      content,
      ...(!customer && awaitingName ? { kind: "identity" } : {})
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
    } else if ((introducingName || confirmingRegistration) && pendingQuestion) {
      // Identidad y confirmación no reemplazan la consulta original.
      conversation = [{ role: "user", content: pendingQuestion }];
    } else {
      conversation = [{ role: "user", content }];
    }

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          messages: conversation,
          customerName: authToken ? "" : customer?.fullName || (confirmingRegistration ? candidateName : introducingName || introducedNameWithQuestion ? content : ""),
          registrationConfirmed: confirmingRegistration
        })
      });
      const data = await response.json();
      if (response.status === 401 && authToken) onSessionExpired?.();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");

      if (data.needsName) {
        if (!customer && !introducingName && !confirmingRegistration) setPendingQuestion(content);
        setAwaitingName(true);
      }
      if (data.registered === false) {
        setAwaitingRegistration(true);
        if (introducingName || introducedNameWithQuestion) setCandidateName(content);
      }
      if (data.needsSupport) {
        setCustomer(null);
        setAwaitingName(false);
        setAwaitingRegistration(false);
        setCandidateName("");
        setPendingQuestion("");
      }
      if (data.customer) {
        setCustomer({
          ...data.customer,
          fullName: `${data.customer.nombre} ${data.customer.apellido}`
        });
        setAwaitingName(false);
        setAwaitingRegistration(false);
        setCandidateName("");
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

  const placeholder = !customer && awaitingRegistration
    ? "Escribe «ya lo hice» o confirma tu nombre…"
    : !customer && awaitingName
      ? "Escribe tu nombre y apellido registrados…"
    : "Escribe tu consulta…";

  return (
    <div className="chatbot-widget">
      {!isOpen && <button
        type="button"
        className="chatbot-launcher"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="support-chat-window"
      >
        <span className="chatbot-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.4-.75L4 20l1.5-4.2a7.5 7.5 0 1 1 14.5-4.3Z" /><path d="M8.5 11.5h7M8.5 14.5h4.5" /></svg>
        </span>
        <span className="chatbot-launcher-copy">
          <strong>¿Necesitas ayuda?</strong>
          <small>Escríbenos por el chat</small>
        </span>
      </button>}
      {isOpen && <aside id="support-chat-window" className="chatbot" aria-label="Chat de atención al cliente" role="dialog">
      <div className="chatbot-heading">
        <div>
          <h3>Asistente virtual</h3>
          <p>Atención personalizada para clientes registrados</p>
        </div>
        <span className="chatbot-status">En línea</span>
        <button type="button" className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">×</button>
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
          disabled={sending || authChecking}
        />
        <button
          type="button"
          className={`chatbot-mic${listening ? " listening" : ""}`}
          onClick={alternarMicrofono}
          disabled={sending || authChecking || !SpeechRecognition}
          aria-label={listening ? "Detener dictado" : "Dictar consulta"}
          title={!SpeechRecognition ? "El navegador no admite dictado por voz" : listening ? "Detener dictado" : "Dictar consulta"}
        >
          {listening ? "⏹️" : "🎙️"}
        </button>
        <button type="submit" disabled={sending || authChecking || !text.trim()}>Enviar</button>
      </form>
      <p className="chatbot-note">
        {customer ? `Las consultas y respuestas se guardan en tu ficha, ${customer.fullName}.` : "Indica tu nombre y apellido registrados. Las consultas y respuestas se guardan en tu ficha de atención."}
      </p>
      </aside>}
    </div>
  );
}

export default Chatbot;
