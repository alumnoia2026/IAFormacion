import { createHmac, timingSafeEqual } from "node:crypto";
import pool from "../db.js";

export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({
      error: "No autorizado"
    });
  }

  next();
};

const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export function configuracionAdminDisponible() {
  return Boolean(process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32);
}

export function emitirTokenAdmin(usuario) {
  const payload = Buffer.from(JSON.stringify({
    sub: usuario.id_cliente,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  })).toString("base64url");
  const signature = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function validarTokenSesion(token) {
  if (!configuracionAdminDisponible() || typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload).digest();
  let received;
  try {
    received = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!Number.isInteger(data.sub) || !Number.isInteger(data.exp) || data.exp <= Date.now() / 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export const requireAuth = async (req, res, next) => {
  if (!configuracionAdminDisponible()) {
    return res.status(503).json({ error: "Configura ADMIN_SESSION_SECRET en el backend para proteger las sesiones." });
  }
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const session = match && validarTokenSesion(match[1]);
  if (!session) return res.status(401).json({ error: "La sesión ha caducado o no es válida. Inicia sesión de nuevo." });
  try {
    const [rows] = await pool.query(
      `SELECT id_cliente, nombre, apellido, email, telefono, Rol
       FROM clientes WHERE id_cliente = ? LIMIT 1`,
      [session.sub]
    );
    if (!rows.length) return res.status(401).json({ error: "La cuenta ya no está disponible. Inicia sesión de nuevo." });
    req.admin = {
      id: rows[0].id_cliente,
      username: `${rows[0].nombre} ${rows[0].apellido}`,
      role: rows[0].Rol,
      user: rows[0]
    };
    req.user = rows[0];
    next();
  } catch (error) {
    console.error("No se pudo verificar el rol de administración:", error.message);
    res.status(503).json({ error: "No se pudo comprobar tu permiso de administración." });
  }
};

export const requireAdminAuth = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.admin.role !== "Administrador") {
      return res.status(403).json({ error: "Tu cuenta no tiene permisos de administración." });
    }
    next();
  });
};

export const optionalAuth = (req, res, next) => {
  if (!req.headers.authorization) return next();
  return requireAuth(req, res, next);
};

export const adminSessionSeconds = ADMIN_SESSION_SECONDS;
