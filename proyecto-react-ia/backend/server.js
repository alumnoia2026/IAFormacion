require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
// FLUX.2 dev acepta guidance (CFG). Usamos 8, dentro del rango 7-9 pedido.
const MODEL = '@cf/black-forest-labs/flux-2-dev';
const GUIDANCE = 8;

async function traducirPromptConDeepL(prompt, apiKey) {
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: [prompt], target_lang: 'EN' })
  });
  const data = await response.json();
  const translated = data.translations?.[0]?.text?.trim();
  if (!response.ok || !translated) {
    console.error('DeepL API error:', data.message || response.status);
    throw new Error(data.message
      ? `DeepL: ${data.message}`
      : 'DeepL no pudo traducir el prompt. Revisa que la clave sea de DeepL API Free.');
  }
  return translated;
}

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));

// React envía el prompt a esta ruta. El token de Cloudflare se queda en el backend.
app.post('/api/generar-imagen', async (req, res) => {
  const prompt = typeof req.body.prompt === 'string' ? req.body.prompt.trim() : '';

  if (!prompt) return res.status(400).json({ error: 'Escribe una descripción para la imagen.' });
  if (prompt.length > 2048) return res.status(400).json({ error: 'La descripción no puede superar los 2048 caracteres.' });

  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, DEEPL_API_KEY } = process.env;
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !DEEPL_API_KEY) {
    return res.status(503).json({ error: 'Falta configurar la clave de DeepL API o las credenciales de Cloudflare. Sigue los pasos del README.' });
  }

  try {
    const promptEnIngles = await traducirPromptConDeepL(prompt, DEEPL_API_KEY);
    console.info('Prompt traducido con DeepL; enviándolo a FLUX.2 dev.');
    // Este modelo requiere multipart/form-data, aunque solo enviemos texto.
    const formData = new FormData();
    formData.append('prompt', promptEnIngles);
    formData.append('guidance', String(GUIDANCE));

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` },
      body: formData
    });
    const data = await response.json();
    if (!response.ok || !data.success || !data.result?.image) {
      console.error('Error de Cloudflare Workers AI:', data.errors);
      return res.status(502).json({ error: 'Cloudflare no pudo generar la imagen. Revisa el token, el Account ID y el acceso a Workers AI.' });
    }
    res.json({ imagen: `data:image/jpeg;base64,${data.result.image}` });
  } catch (error) {
    console.error('Error al contactar con Cloudflare:', error.message);
    res.status(502).json({ error: error.message || 'No se pudo conectar con Cloudflare. Comprueba tu conexión e inténtalo de nuevo.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'La ruta solicitada no existe en el backend.' });
});

app.listen(PORT, () => console.log(`Backend listo en http://localhost:${PORT}`));
