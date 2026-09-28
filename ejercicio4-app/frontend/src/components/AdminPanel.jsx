import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import Clientes from "./Clientes";
import AtencionCliente from "./AtencionCliente";

function AdminPanel() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [credentials, setCredentials] = useState({ nombre: "", apellido: "", password: "" });
  const [checking, setChecking] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem("tonymarkt-admin-token");
    if (!savedToken) {
      setChecking(false);
      return;
    }
    fetch(`${API_URL}/auth/session`, { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "La sesión ha caducado.");
        setToken(savedToken);
        setUsername(data.username);
      })
      .catch(() => window.sessionStorage.removeItem("tonymarkt-admin-token"))
      .finally(() => setChecking(false));
  }, []);

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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar sesión.");
      window.sessionStorage.setItem("tonymarkt-admin-token", data.token);
      setToken(data.token);
      setUsername(data.username);
      setCredentials({ nombre: "", apellido: "", password: "" });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSending(false);
    }
  };

  const cerrarSesion = () => {
    window.sessionStorage.removeItem("tonymarkt-admin-token");
    setToken("");
    setUsername("");
  };

  const expiroSesion = () => {
    cerrarSesion();
    setError("La sesión ha caducado. Inicia sesión de nuevo para ver las listas.");
  };

  return (
    <div className="admin-area">
      <section className="admin-access-card">
        <div>
          <p className="section-kicker">DATOS PROTEGIDOS</p>
          <h2>{token ? `Sesión de ${username}` : "Acceso para gerencia"}</h2>
          <p>{token ? "Las listas privadas están desbloqueadas." : "Inicia sesión con tu nombre, apellidos y teléfono. Solo las cuentas con rol Administrador pueden acceder."}</p>
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

      <div className="admin-grid">
        <div className="admin-card customers-card"><Clientes adminToken={token} onSessionExpired={expiroSesion} /></div>
        <div className="admin-card support-card"><AtencionCliente adminToken={token} onSessionExpired={expiroSesion} /></div>
      </div>
    </div>
  );
}

export default AdminPanel;
