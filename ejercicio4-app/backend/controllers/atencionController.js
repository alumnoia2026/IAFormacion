import pool from "../db.js";

export const getAtenciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ac.id_atencion, ac.id AS id_cliente,
             ac.Consulta AS consulta, ac.Respuesta AS respuesta,
             c.nombre, c.apellido, c.email
      FROM atencion_cliente ac
      INNER JOIN clientes c ON ac.id = c.id_cliente
      ORDER BY ac.id_atencion
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
      `SELECT ac.id_atencion, ac.id AS id_cliente,
              ac.Consulta AS consulta, ac.Respuesta AS respuesta,
              c.nombre, c.apellido, c.email
       FROM atencion_cliente ac
       INNER JOIN clientes c ON ac.id = c.id_cliente
       WHERE ac.id_atencion = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Consulta no encontrada" });
    }

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
      `SELECT id_cliente, nombre, apellido, email
       FROM clientes
       WHERE id_cliente = ?`,
      [id]
    );

    if (!cliente.length) {
      return res.status(404).json({ error: "El cliente no existe" });
    }

    const [result] = await pool.query(
      `INSERT INTO atencion_cliente (id, Consulta, Respuesta)
       VALUES (?, ?, ?)`,
      [id, consulta, respuesta || null]
    );

    const idAtencion = result.insertId;

    // Si la consulta no tiene respuesta, avisamos a Zapier.
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
      id_cliente: id,
      consulta,
      respuesta: respuesta || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la consulta" });
  }
};

// Esta ruta la llamará Zapier después de recibir la respuesta de Gemini.
export const guardarRespuestaIA = async (req, res) => {
  try {
    const { id_atencion, respuesta } = req.body;

    if (!id_atencion || !respuesta) {
      return res.status(400).json({
        error: "id_atencion y respuesta son obligatorios"
      });
    }

    const [result] = await pool.query(
      `UPDATE atencion_cliente
       SET Respuesta = ?
       WHERE id_atencion = ?`,
      [respuesta, id_atencion]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        error: "Consulta no encontrada"
      });
    }

    res.json({
      message: "Respuesta de IA guardada correctamente",
      id_atencion,
      respuesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al guardar la respuesta de IA"
    });
  }
};

export const updateAtencion = async (req, res) => {
  try {
    const { consulta, respuesta } = req.body;

    const [result] = await pool.query(
      `UPDATE atencion_cliente
       SET Consulta = ?, Respuesta = ?
       WHERE id_atencion = ?`,
      [consulta, respuesta || null, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Consulta no encontrada" });
    }

    res.json({ message: "Consulta actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la consulta" });
  }
};

export const deleteAtencion = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM atencion_cliente WHERE id_atencion = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Consulta no encontrada" });
    }

    res.json({ message: "Consulta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la consulta" });
  }
};
