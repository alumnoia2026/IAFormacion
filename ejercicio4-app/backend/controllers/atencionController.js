import pool from "../db.js";

export const getAtenciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ac.id, ac.Consulta AS consulta, ac.Respuesta AS respuesta,
             c.nombre, c.apellido
      FROM atencion_cliente ac
      INNER JOIN clientes c ON ac.id = c.id_cliente
      ORDER BY ac.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las consultas" });
  }
};

export const getAtencionById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ac.id, ac.Consulta AS consulta, ac.Respuesta AS respuesta,
              c.nombre, c.apellido
       FROM atencion_cliente ac
       INNER JOIN clientes c ON ac.id = c.id_cliente
       WHERE ac.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la consulta" });
  }
};

export const createAtencion = async (req, res) => {
  try {
    const { id, consulta, respuesta } = req.body;

    if (!id || !consulta) {
      return res.status(400).json({
        error: "El cliente y la consulta son obligatorios"
      });
    }

    const [cliente] = await pool.query(
      "SELECT id_cliente, nombre, apellido, email FROM clientes WHERE id_cliente = ?",
      [id]
    );

    if (!cliente.length) {
      return res.status(404).json({ error: "El cliente no existe" });
    }

    // Guardar la consulta en Aiven.
    // Si no hay respuesta, Respuesta queda en NULL para que Zapier la procese.
    const [result] = await pool.query(
      `INSERT INTO atencion_cliente (id, Consulta, Respuesta)
       VALUES (?, ?, ?)`,
      [id, consulta, respuesta || null]
    );

    const idAtencion = result.insertId;

    // Avisar a Zapier únicamente si todavía no existe una respuesta.
    if (!respuesta) {
      const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

      if (webhookUrl) {
        try {
          const zapierResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id_atencion: idAtencion,
              id_cliente: id,
              consulta,
              nombre: cliente[0].nombre,
              apellido: cliente[0].apellido,
              email: cliente[0].email
            })
          });

          if (!zapierResponse.ok) {
            console.error(
              "Zapier respondió con error:",
              zapierResponse.status,
              await zapierResponse.text()
            );
          } else {
            console.log(
              `Consulta ${idAtencion} enviada correctamente a Zapier`
            );
          }
        } catch (zapierError) {
          // La consulta ya está guardada en Aiven aunque Zapier falle.
          console.error("Error al enviar la consulta a Zapier:", zapierError);
        }
      } else {
        console.warn(
          "ZAPIER_WEBHOOK_URL no está configurada. La consulta se ha guardado, pero no se ha enviado a Zapier."
        );
      }
    }

    res.status(201).json({
      message: "Consulta creada correctamente",
      id_atencion: idAtencion,
      id,
      consulta,
      respuesta: respuesta || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la consulta" });
  }
};
export const updateAtencion = async (req, res) => {
  try {
    const { consulta, respuesta } = req.body;
    const [result] = await pool.query(
      `UPDATE atencion_cliente SET Consulta=?, Respuesta=? WHERE id=?`,
      [consulta, respuesta || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json({ message: "Consulta actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la consulta" });
  }
};

export const deleteAtencion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM atencion_cliente WHERE id = ?", [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Consulta no encontrada" });
    res.json({ message: "Consulta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la consulta" });
  }
};
