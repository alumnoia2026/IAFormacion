import express from "express";
import {
  getAtenciones,
  getAtencionById,
  createAtencion,
  guardarRespuestaIA,
  updateAtencion,
  deleteAtencion
} from "../controllers/atencionController.js";

import { requireAdminAuth, requireApiKey } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAdminAuth, getAtenciones);
router.get("/:id", requireAdminAuth, getAtencionById);
router.post("/", requireAdminAuth, createAtencion);

router.post(
  "/respuesta-ia",
  requireApiKey,
  guardarRespuestaIA
);

router.put("/:id", requireAdminAuth, updateAtencion);
router.delete("/:id", requireAdminAuth, deleteAtencion);

export default router;
