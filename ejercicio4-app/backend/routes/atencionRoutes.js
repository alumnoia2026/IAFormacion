import express from "express";
import {
  getAtenciones,
  getAtencionById,
  createAtencion,
  guardarRespuestaIA,
  updateAtencion,
  deleteAtencion
} from "../controllers/atencionController.js";

import { requireApiKey } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAtenciones);
router.get("/:id", getAtencionById);
router.post("/", createAtencion);

router.post(
  "/respuesta-ia",
  requireApiKey,
  guardarRespuestaIA
);

router.put("/:id", updateAtencion);
router.delete("/:id", deleteAtencion);

export default router;