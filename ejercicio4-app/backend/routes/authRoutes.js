import express from "express";
import pool from "../db.js";
import {
  adminSessionSeconds,
  configuracionAdminDisponible,
  emitirTokenAdmin,
  requireAuth
} from "../middleware/auth.js";

const router = express.Router();
const intentosPorIp = new Map();
const LIMITE_INTENTOS = 10;
const VENTANA_MS = 15 * 60 * 1000;

router.post("/login", async (req, res) => {
  if (!configuracionAdminDisponible()) {
    return res.status(503).json({ error: "Configura ADMIN_SESSION_SECRET en el entorno del backend." });
  }

  const ip = req.ip || req.socket.remoteAddress || "desconocida";
  const ahora = Date.now();
  const ventana = intentosPorIp.get(ip);
  if (ventana && ahora < ventana.expira && ventana.cantidad >= LIMITE_INTENTOS) {
    return res.status(429).json({ error: "Demasiados intentos de acceso. Espera 15 minutos y vuelve a intentarlo." });
  }
  if (!ventana || ahora >= ventana.expira) intentosPorIp.set(ip, { cantidad: 0, expira: ahora + VENTANA_MS });

  const { nombre, apellido, password } = req.body || {};
  if (typeof nombre !== "string" || typeof apellido !== "string" || typeof password !== "string" ||
      !nombre.trim() || !apellido.trim() || !password.trim()) {
    const actual = intentosPorIp.get(ip);
    actual.cantidad += 1;
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  try {
    const [usuarios] = await pool.query(
      `SELECT id_cliente, nombre, apellido, telefono, Rol
       FROM clientes
       WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(?))
         AND LOWER(TRIM(apellido)) = LOWER(TRIM(?))
         AND TRIM(telefono) = TRIM(?)
       LIMIT 2`,
      [nombre.trim(), apellido.trim(), password.trim()]
    );

    if (usuarios.length !== 1) {
      const actual = intentosPorIp.get(ip);
      actual.cantidad += 1;
      return res.status(401).json({ error: "Nombre, apellidos o teléfono incorrectos." });
    }
    intentosPorIp.delete(ip);
    const usuario = usuarios[0];
    res.json({
      token: emitirTokenAdmin(usuario),
      username: `${usuario.nombre} ${usuario.apellido}`,
      user: {
        id_cliente: usuario.id_cliente,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        Rol: usuario.Rol
      },
      expiresIn: adminSessionSeconds
    });
  } catch (error) {
    console.error("No se pudo iniciar sesión de administración:", error.message);
    res.status(503).json({ error: "No se pudo comprobar el usuario. Verifica que la columna Rol exista en clientes." });
  }
});

router.get("/session", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT CASE WHEN LEFT(Consulta, 10) = '[CHATBOT] '
                   THEN SUBSTRING(Consulta, 11) ELSE Consulta END AS consulta,
              Respuesta AS respuesta
       FROM atencion_cliente
       WHERE id = ?
       LIMIT 100`,
      [req.user.id_cliente]
    );
    res.json({ user: req.user, atenciones: rows });
  } catch (error) {
    console.error("No se pudo cargar el perfil del cliente:", error.message);
    res.status(500).json({ error: "No se pudo cargar tu perfil." });
  }
});

export default router;
