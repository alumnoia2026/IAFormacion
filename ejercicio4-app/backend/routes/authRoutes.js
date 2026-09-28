import express from "express";
import {
  adminSessionSeconds,
  configuracionAdminDisponible,
  credencialesAdminValidas,
  emitirTokenAdmin,
  requireAdminAuth
} from "../middleware/auth.js";

const router = express.Router();
const intentosPorIp = new Map();
const LIMITE_INTENTOS = 10;
const VENTANA_MS = 15 * 60 * 1000;

router.post("/login", (req, res) => {
  if (!configuracionAdminDisponible()) {
    return res.status(503).json({ error: "Configura ADMIN_USERNAME, ADMIN_PASSWORD y ADMIN_SESSION_SECRET en el entorno del backend." });
  }

  const ip = req.ip || req.socket.remoteAddress || "desconocida";
  const ahora = Date.now();
  const ventana = intentosPorIp.get(ip);
  if (ventana && ahora < ventana.expira && ventana.cantidad >= LIMITE_INTENTOS) {
    return res.status(429).json({ error: "Demasiados intentos de acceso. Espera 15 minutos y vuelve a intentarlo." });
  }
  if (!ventana || ahora >= ventana.expira) intentosPorIp.set(ip, { cantidad: 0, expira: ahora + VENTANA_MS });

  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !credencialesAdminValidas(username, password)) {
    const actual = intentosPorIp.get(ip);
    actual.cantidad += 1;
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  intentosPorIp.delete(ip);
  res.json({
    token: emitirTokenAdmin(username),
    username,
    expiresIn: adminSessionSeconds
  });
});

router.get("/session", requireAdminAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

export default router;
