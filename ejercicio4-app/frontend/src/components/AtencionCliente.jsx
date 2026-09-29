import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

function AtencionCliente({ adminToken = "", onSessionExpired = () => {} }) {
  const [atenciones, setAtenciones] = useState([]);
  const [form, setForm] = useState({ id: "", consulta: "", respuesta: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargarAtenciones = async () => {
    try {
      const response = await fetch(`${API_URL}/atencion`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if ([401, 403].includes(response.status)) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error("Error al obtener las consultas");
      setAtenciones(await response.json());
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!adminToken) return;
    cargarAtenciones();
    const intervalo = setInterval(cargarAtenciones, 10000);
    return () => clearInterval(intervalo);
  }, [adminToken]);
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/atencion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: Number(form.id),
          consulta: form.consulta,
          respuesta: form.respuesta || null
        })
      });
      const data = await response.json();
      if ([401, 403].includes(response.status)) onSessionExpired();
      if (!response.ok) throw new Error(data.error || "Error al crear consulta");
      if (adminToken) await cargarAtenciones();
      setForm({ id: "", consulta: "", respuesta: "" });
      setError("");
      setSuccess("Consulta registrada correctamente.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h2>Consultas y respuestas</h2>
      {!adminToken ? <p>El registro manual de consultas y respuestas está reservado al gerente. Inicia sesión para acceder.</p> : <>
      <p>Registra la consulta y la respuesta acordada con el cliente.</p>
      {error && <div className="error">{error}</div>}
      {success && <div className="form-success" role="status">{success}</div>}

      <form onSubmit={handleSubmit} className="formulario">
        <input type="number" name="id" placeholder="ID del cliente"
          value={form.id} onChange={handleChange} required />
        <textarea name="consulta" placeholder="Consulta"
          value={form.consulta} onChange={handleChange} required />
        <textarea name="respuesta" placeholder="Respuesta"
          value={form.respuesta} onChange={handleChange} />
        <button type="submit">Enviar consulta</button>
      </form>

      <h2>Lista privada de consultas</h2>
      <div className="tabla-container">
        <table>
          <thead>
            <tr><th>Cliente</th><th>Consulta</th><th>Respuesta</th></tr>
          </thead>
          <tbody>
            {atenciones.map((atencion, index) => (
              <tr key={`${atencion.id}-${index}`}>
                <td>{atencion.nombre} {atencion.apellido}</td>
                <td>{atencion.consulta}</td>
                <td>{atencion.respuesta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>}
    </section>
  );
}

export default AtencionCliente;
