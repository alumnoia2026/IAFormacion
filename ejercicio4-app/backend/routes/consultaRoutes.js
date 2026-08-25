import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "CALL obtener_consulta_por_id(?)",
      [id]
    );

    const resultado = rows[0];

    if (resultado.length === 0) {
      return res.status(404).json({
        error: "Consulta no encontrada"
      });
    }

    res.json(resultado[0]);

  } catch (error) {
    console.error("Error al buscar la consulta:", error);

    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

export default router;