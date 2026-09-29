import React, { useCallback, useState } from "react";
import { API_URL } from "../config";
import Clientes from "./Clientes";
import AtencionCliente from "./AtencionCliente";
import PerfilUsuario from "./PerfilUsuario";

async function leerRespuestaApi(response) {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    if (/^\s*<!doctype\s+html|^\s*<html/i.test(body)) {
      throw new Error("La petición llegó a una página web, no a la API. Revisa VITE_API_URL en Render: debe apuntar al backend y luego hay que reconstruir el frontend.");
    }
    throw new Error("El backend no devolvió JSON. Comprueba que el servicio y la ruta /api/auth/login estén desplegados.");
  }
}

function AdminPanel({ session, checking, onAuthChange }) {
  const token = session?.token || "";
  const user = session?.user || null;
  const [credentials, setCredentials] = useState({ nombre: "", apellido: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await leerRespuestaApi(response);
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar sesión.");
      onAuthChange({ token: data.token, user: data.user });
      setCredentials({ nombre: "", apellido: "", password: "" });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSending(false);
    }
  };

  const cerrarSesion = () => {
    onAuthChange(null);
  };

  const expiroSesion = useCallback(() => {
    cerrarSesion();
    setError("La sesión ha caducado. Inicia sesión de nuevo para ver las listas.");
  }, [onAuthChange]);

  return (
    <div className="admin-area">
      <section className="admin-access-card">
        <div>
          <p className="section-kicker">DATOS PROTEGIDOS</p>
          <h2>{user ? `Sesión de ${user.nombre} ${user.apellido}` : "Iniciar sesión"}</h2>
          <p>{user ? `Has iniciado sesión como ${user.Rol}.` : "Inicia sesión con tu nombre, apellidos y teléfono para abrir tu perfil."}</p>
        </div>
        {token ? <button className="admin-logout" type="button" onClick={cerrarSesion}>Cerrar sesión</button> : checking ? <p role="status">Comprobando sesión…</p> : (
          <form className="admin-login-form" onSubmit={iniciarSesion}>
            <label>Nombre<input autoComplete="given-name" value={credentials.nombre} onChange={(event) => setCredentials({ ...credentials, nombre: event.target.value })} required /></label>
            <label>Apellidos<input autoComplete="family-name" value={credentials.apellido} onChange={(event) => setCredentials({ ...credentials, apellido: event.target.value })} required /></label>
            <label>Teléfono (contraseña)<input type="password" inputMode="tel" autoComplete="current-password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>
            <button type="submit" disabled={sending}>{sending ? "Accediendo…" : "Iniciar sesión"}</button>
          </form>
        )}
        {error && <p className="admin-login-error" role="alert">{error}</p>}
      </section>

      {!user && !checking && <div className="admin-grid">
        <div className="admin-card customers-card"><Clientes onSessionExpired={expiroSesion} /></div>
      </div>}
      {user?.Rol === "Cliente" && <PerfilUsuario token={token} onSessionExpired={expiroSesion} />}
      {user?.Rol === "Administrador" && <>
        <PerfilUsuario token={token} onSessionExpired={expiroSesion} />
        <div className="admin-grid">
          <div className="admin-card customers-card"><Clientes adminToken={token} onSessionExpired={expiroSesion} /></div>
          <div className="admin-card support-card"><AtencionCliente adminToken={token} onSessionExpired={expiroSesion} /></div>
        </div>
      </>}
    </div>
  );
}

export default AdminPanel;
