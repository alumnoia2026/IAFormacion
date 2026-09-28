import express from "express";
import { requireAdminAuth } from "../middleware/auth.js";
import {
  getClientes, getClienteById, createCliente, updateCliente, deleteCliente
} from "../controllers/clientesController.js";

const router = express.Router();
router.get("/", requireAdminAuth, getClientes);
router.get("/:id", requireAdminAuth, getClienteById);
router.post("/", createCliente);
router.put("/:id", requireAdminAuth, updateCliente);
router.delete("/:id", requireAdminAuth, deleteCliente);

export default router;
