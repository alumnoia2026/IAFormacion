import React, { useEffect, useState } from "react";

const API_URL = "https://iaformacion.onrender.com";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", telefono: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clientes`);
      if (!response.ok) throw new Error("Error al obtener clientes");
      setClientes(await response.json());
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
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
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <section>
      <h2>Clientes</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="formulario">
        <input name="nombre" placeholder="Nombre" value={form.nombre}
          onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido}
          onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email}
          onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono}
          onChange={handleChange} />
        <button type="submit">Añadir cliente</button>
      </form>

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
    </section>
  );
}

export default Clientes;
