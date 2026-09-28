import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

function Clientes({ adminToken = "", onSessionExpired = () => {} }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", telefono: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clientes`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if ([401, 403].includes(response.status)) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error("Error al obtener clientes");
      setClientes(await response.json());
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) cargarClientes();
  }, [adminToken]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al crear cliente");
      setClientes([...clientes, data]);
      setForm({ nombre: "", apellido: "", email: "", telefono: "" });
      setError("");
      setSuccess(`Cliente registrado correctamente. Tu número de cliente es ${data.id_cliente}.`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h2>Registro de cliente</h2>
      <p>Completa estos datos para registrarte en la tienda.</p>
      {error && <div className="error">{error}</div>}
      {success && <div className="form-success" role="status">{success}</div>}
      <form onSubmit={handleSubmit} className="formulario">
        <input name="nombre" placeholder="Nombre" value={form.nombre}
          onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido}
          onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email}
          onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono}
          onChange={handleChange} />
        <button type="submit">Registrarme</button>
      </form>

      {adminToken && <>
      <h2>Lista privada de clientes</h2>
      {loading ? <p>Cargando clientes...</p> :
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
      </>}
    </section>
  );
}

export default Clientes;
