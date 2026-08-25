import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

function AtencionCliente() {
  const [atenciones, setAtenciones] = useState([]);
  const [form, setForm] = useState({ id: "", consulta: "", respuesta: "" });
  const [error, setError] = useState("");

  const cargarAtenciones = async () => {
    try {
      const response = await fetch(`${API_URL}/atencion`);
      if (!response.ok) throw new Error("Error al obtener las consultas");
      setAtenciones(await response.json());
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => { cargarAtenciones(); }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/atencion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(form.id),
          consulta: form.consulta,
          respuesta: form.respuesta
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al crear consulta");
      await cargarAtenciones();
      setForm({ id: "", consulta: "", respuesta: "" });
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h2>Atención al cliente</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="formulario">
        <input type="number" name="id" placeholder="ID del cliente"
          value={form.id} onChange={handleChange} required />
        <textarea name="consulta" placeholder="Consulta"
          value={form.consulta} onChange={handleChange} required />
        <textarea name="respuesta" placeholder="Respuesta"
          value={form.respuesta} onChange={handleChange} />
        <button type="submit">Añadir consulta</button>
      </form>

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
    </section>
  );
}

export default AtencionCliente;
