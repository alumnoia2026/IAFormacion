import { useRef, useState } from 'react';

async function leerRespuesta(respuesta) {
  const contentType = respuesta.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const detalle = await respuesta.text();
    if (detalle.trimStart().startsWith('<!DOCTYPE') || detalle.trimStart().startsWith('<html')) {
      throw new Error('El servidor respondió con una página web en vez de JSON. Comprueba que el backend está arrancado en el puerto 4000 y que ejecutaste npm start dentro de la carpeta backend.');
    }
    throw new Error(`Respuesta inesperada del servidor (${respuesta.status}). Comprueba que el backend está funcionando.`);
  }
  return respuesta.json();
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [errorVoz, setErrorVoz] = useState('');
  const recognitionRef = useRef(null);

  function dictarPrompt() {
    if (grabando) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorVoz('El dictado no está disponible en este navegador. Prueba con Chrome o Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setGrabando(true); setErrorVoz(''); };
    recognition.onresult = (event) => {
      const textoDictado = event.results[0][0].transcript.trim();
      if (!textoDictado) return;
      setPrompt(textoDictado);
      setErrorVoz('');
      setError('');
      generarImagen(null, textoDictado);
    };
    recognition.onerror = (event) => {
      setErrorVoz(event.error === 'not-allowed' ? 'Permite el acceso al micrófono en tu navegador.' : 'No se entendió el dictado. Vuelve a intentarlo.');
    };
    recognition.onend = () => setGrabando(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (_error) {
      setErrorVoz('No se pudo iniciar el micrófono. Inténtalo de nuevo.');
    }
  }

  async function generarImagen(event, texto = prompt) {
    event?.preventDefault();
    if (!texto.trim()) return;
    setCargando(true);
    setError('');
    setImagen('');
    try {
      const respuesta = await fetch('http://localhost:4000/api/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: texto })
      });
      const datos = await leerRespuesta(respuesta);
      if (!respuesta.ok) throw new Error(datos.error || 'No se pudo generar la imagen.');
      setImagen(datos.imagen);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el backend.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="page">
      <header className="topbar"><a className="brand" href="#inicio"><span className="brand-icon">✳</span> Imagina</a><span className="powered">Una imagen empieza con una idea</span></header>
      <section className="content" id="inicio">
        <div className="intro">
          <img className="academy-logo" src="/images/logo-academia.png" alt="Logo de Grupo Juyma Formación" />
          <span className="eyebrow">TU ESTUDIO CREATIVO CON IA</span>
          <h1>¿Qué te gustaría<br />crear hoy?</h1>
          <p>Describe una imagen con tus propias palabras y deja que la IA la imagine.</p>
        </div>
        <form className="prompt-box" onSubmit={generarImagen}>
          <label htmlFor="prompt">Describe la imagen que quieres generar</label>
          <textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Hola, ¿en qué te puedo ayudar hoy?" maxLength={2048} rows={4} disabled={cargando || grabando} />
          <div className="prompt-bottom"><div className="prompt-tools"><span className="char-count">{prompt.length}/2048</span><button type="button" className={`voice-button ${grabando ? 'listening' : ''}`} onClick={dictarPrompt} disabled={cargando || grabando} aria-label="Dictar prompt">{grabando ? '🎙' : '🎙'} <span>{grabando ? 'Escuchando…' : 'Dictar'}</span></button></div><button type="submit" disabled={cargando || grabando || !prompt.trim()}>{cargando ? <><span className="spinner" /> Creando imagen...</> : <>✦ <span>Generar imagen</span></>}</button></div>
          {errorVoz && <p className="voice-error" role="status">{errorVoz}</p>}
        </form>
        <section className={`result ${imagen || error || cargando ? 'has-result' : ''}`} aria-live="polite">
          {cargando && <div className="loading-state"><span className="large-spinner" /><b>Estamos preparando tu imagen</b><span>Puede tardar unos segundos...</span></div>}
          {error && <div className="error-state"><span className="error-icon">!</span><b>No se pudo generar la imagen</b><p>{error}</p></div>}
          {imagen && <div className="image-result"><img src={imagen} alt="Imagen generada" /><a href={imagen} download="mi-imagen.jpg">Descargar imagen ↓</a></div>}
          {!imagen && !error && !cargando && <div className="empty-state"><div className="empty-art"><span className="art-sun">✳</span><span className="art-mountain mountain-back"/><span className="art-mountain mountain-front"/><span className="art-star">✦</span></div><b>Tu próxima idea puede estar aquí</b><span>Escribe un prompt arriba y genera tu primera imagen.</span></div>}
        </section>
        <p className="note">Modelo FLUX.2 dev · CFG 8 · Cloudflare Workers AI</p>
      </section>
      <footer>Hecho para aprender y crear <span>✳</span></footer>
    </main>
  );
}

export default App;
