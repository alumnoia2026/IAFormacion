import pool from "../db.js";

export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_cliente, nombre, apellido, email, telefono
      FROM clientes ORDER BY id_cliente
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_cliente, nombre, apellido, email, telefono
       FROM clientes WHERE id_cliente = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    if (!nombre || !apellido) {
      return res.status(400).json({ error: "Nombre y apellido son obligatorios" });
    }
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, apellido, email, telefono)
       VALUES (?, ?, ?, ?)`,
      [nombre, apellido, email || null, telefono || null]
    );
    const [rows] = await pool.query(
      `SELECT id_cliente, nombre, apellido, email, telefono
       FROM clientes WHERE id_cliente = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const [result] = await pool.query(
      `UPDATE clientes SET nombre=?, apellido=?, email=?, telefono=?
       WHERE id_cliente=?`,
      [nombre, apellido, email || null, telefono || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Cliente no encontrado" });
    const [rows] = await pool.query(
      `SELECT id_cliente, nombre, apellido, email, telefono
       FROM clientes WHERE id_cliente=?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se puede eliminar el cliente" });
  }
};
