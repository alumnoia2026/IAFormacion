import pool from "../db.js";

const normalizar = (texto) => texto
  .toLocaleLowerCase("es")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\s]/g, " ")
  .split(/\s+/)
  .filter((palabra) => palabra.length > 2 && !["como", "para", "puedo", "quiero", "tienen", "cuanto", "donde", "esta", "este", "esta", "una", "unos", "unas", "por", "con", "del", "las", "los", "que"].includes(palabra));

export const responderChat = async (req, res) => {
  const mensaje = typeof req.body?.mensaje === "string" ? req.body.mensaje.trim() : "";
  if (!mensaje) return res.status(400).json({ error: "Escribe una consulta para el asistente." });
  if (mensaje.length > 1000) return res.status(400).json({ error: "La consulta no puede superar los 1000 caracteres." });

  try {
    const [preguntas] = await pool.query(
      `SELECT Consulta AS consulta, Respuesta AS respuesta
       FROM atencion_cliente WHERE Respuesta IS NOT NULL AND Respuesta <> ''`
    );
    const palabras = new Set(normalizar(mensaje));
    let mejor = null;
    let puntuacionMaxima = 0;

    for (const fila of preguntas) {
      const palabrasFaq = new Set(normalizar(fila.consulta));
      const coincidencias = [...palabras].filter((palabra) => palabrasFaq.has(palabra)).length;
      const puntuacion = coincidencias / Math.max(1, Math.min(palabras.size, palabrasFaq.size));
      if (coincidencias > 0 && puntuacion > puntuacionMaxima) {
        mejor = fila;
        puntuacionMaxima = puntuacion;
      }
    }

    if (!mejor || puntuacionMaxima < 0.2) {
      return res.json({ respuesta: "No encuentro una respuesta exacta en las consultas frecuentes. Prueba con otra pregunta sobre pedidos, envíos, pagos o devoluciones." });
    }
    return res.json({ respuesta: mejor.respuesta });
  } catch (error) {
    console.error("Error en el chatbot:", error);
    return res.status(500).json({ error: "No se pudo consultar la base de conocimiento. Inténtalo de nuevo." });
  }
};
