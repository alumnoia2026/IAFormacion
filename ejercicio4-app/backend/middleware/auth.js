import { createHmac, timingSafeEqual } from "node:crypto";

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

function compararSecretos(a, b) {
  const hashA = createHmac("sha256", "admin-login-compare").update(a).digest();
  const hashB = createHmac("sha256", "admin-login-compare").update(b).digest();
  return timingSafeEqual(hashA, hashB) && a.length === b.length;
}

export function configuracionAdminDisponible() {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32
  );
}

export function emitirTokenAdmin(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  })).toString("base64url");
  const signature = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function validarTokenAdmin(token) {
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
    if (data.sub !== process.env.ADMIN_USERNAME || !Number.isInteger(data.exp) || data.exp <= Date.now() / 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export const requireAdminAuth = (req, res, next) => {
  if (!configuracionAdminDisponible()) {
    return res.status(503).json({ error: "El acceso de administración no está configurado en el servidor." });
  }
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const session = match && validarTokenAdmin(match[1]);
  if (!session) return res.status(401).json({ error: "La sesión ha caducado o no es válida. Inicia sesión de nuevo." });
  req.admin = { username: session.sub };
  next();
};

export const adminSessionSeconds = ADMIN_SESSION_SECONDS;

export function credencialesAdminValidas(username, password) {
  return configuracionAdminDisponible() &&
    compararSecretos(String(username), process.env.ADMIN_USERNAME) &&
    compararSecretos(String(password), process.env.ADMIN_PASSWORD);
}
