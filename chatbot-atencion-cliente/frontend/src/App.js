import React, { useEffect, useRef, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export default function App() {
  const [clients, setClients] = useState([]), [clientId, setClientId] = useState('');
  const [sessionId, setSessionId] = useState(''), [messages, setMessages] = useState([]);
  const [text, setText] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const bottom = useRef(null);
  useEffect(() => {
    fetch(`${API}/api/clients`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setClients)
      .catch(() => setError('No se pudo conectar con la API. Comprueba que FastAPI y MySQL están activos.'));
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  async function send(e) {
    e.preventDefault(); const value = text.trim(); if (!value || !clientId || busy) return;
    setText(''); setError(''); setMessages(m => [...m, { role: 'user', text: value }]); setBusy(true);
    try {
      const response = await fetch(`${API}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: Number(clientId), message: value, session_id: sessionId || undefined }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.detail || 'No se pudo enviar el mensaje.');
     
      setSessionId(data.session_id); setMessages(m => [...m, { role: 'assistant', text: data.answer }]);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function changeClient(id) { setClientId(id); setSessionId(''); setMessages([]); setError(''); }
  return <main className="page"><header className="topbar"><div className="brand-mark">a</div><div><strong>Atención cercana</strong><span>Asistente de soporte</span></div><span className="status"><i/> En línea</span></header>
    <section className="layout"><aside className="intro"><p className="eyebrow">CENTRO DE AYUDA</p><h1>¿En qué podemos ayudarte?</h1><p>Cuéntanos qué necesitas y encontraremos el siguiente paso contigo.</p><div className="tip"><span>✦</span><div><b>Un consejo</b><p>Incluye los detalles del problema para que podamos orientarte mejor.</p></div></div></aside>
      <section className="chat-card"><div className="chat-head"><div className="avatar">✦</div><div><b>Asistente de soporte</b><small>Normalmente responde al instante</small></div></div>
        <div className="client-pick"><label htmlFor="client">Conversación de prueba</label><select id="client" value={clientId} onChange={e => changeClient(e.target.value)}><option value="">Selecciona un cliente...</option>{clients.map(c => <option value={c.id} key={c.id}>{c.nombre} {c.apellidos} · {c.plan}</option>)}</select></div>
        <div className="messages"><div className="bubble assistant">¡Hola! Soy tu asistente virtual. Selecciona un cliente y cuéntame cómo puedo ayudarte.</div>{messages.map((m,i) => <div className={`bubble ${m.role}`} key={i}>{m.text}</div>)}{busy && <div className="bubble assistant typing">Preparando respuesta…</div>}<div ref={bottom}/></div>
        {error && <div className="error">{error}</div>}<form className="composer" onSubmit={send}><input aria-label="Tu mensaje" placeholder={clientId ? 'Escribe tu consulta…' : 'Selecciona un cliente para comenzar'} value={text} onChange={e => setText(e.target.value)} disabled={!clientId || busy}/><button disabled={!clientId || busy || !text.trim()} aria-label="Enviar mensaje">↑</button></form><p className="privacy">Las conversaciones de demostración se guardan en la base de datos local.</p>
      </section></section><footer>Asistencia clara, siempre a un mensaje de distancia.</footer></main>;
}
