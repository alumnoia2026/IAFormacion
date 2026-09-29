import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

function PerfilUsuario({ token, onSessionExpired }) {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    fetch(`${API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if ([401, 403].includes(response.status)) {
          onSessionExpired();
          return;
        }
        if (!response.ok) throw new Error(data.error || "No se pudo cargar el perfil.");
        if (activo) setPerfil(data);
      })
      .catch((requestError) => {
        if (activo) setError(requestError.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, [token, onSessionExpired]);

  if (loading) return <section className="profile-card"><p>Cargando tu perfil…</p></section>;
  if (error) return <section className="profile-card"><div className="error">{error}</div></section>;
  if (!perfil) return null;

  const { user, atenciones } = perfil;
  return (
    <section className="profile-card">
      <div className="profile-heading">
        <div><p className="section-kicker">TU PERFIL</p><h2>Hola, {user.nombre} {user.apellido}</h2></div>
        <span className="profile-role">{user.Rol}</span>
      </div>
      <div className="profile-details">
        <div><span>Correo electrónico</span><strong>{user.email || "No indicado"}</strong></div>
        <div><span>Teléfono</span><strong>{user.telefono || "No indicado"}</strong></div>
        <div><span>Número de cliente</span><strong>{user.id_cliente}</strong></div>
      </div>
      <div className="profile-queries">
        <h3>Mis consultas</h3>
        {atenciones.length ? atenciones.map((atencion, index) => (
          <article key={`${atencion.consulta}-${index}`}>
            <p><strong>Consulta:</strong> {atencion.consulta}</p>
            <p><strong>Respuesta:</strong> {atencion.respuesta || "Pendiente de respuesta"}</p>
          </article>
        )) : <p>Aún no hay consultas asociadas a tu ficha.</p>}
      </div>
    </section>
  );
}

export default PerfilUsuario;
