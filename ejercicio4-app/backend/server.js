import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientesRoutes from "./routes/clientesRoutes.js";
import atencionRoutes from "./routes/atencionRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["https://iaformacion-1.onrender.com"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "X-API-Key"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API ejercicio4 funcionando correctamente" });
});

app.use("/api/clientes", clientesRoutes);
app.use("/api/atencion", atencionRoutes);
app.use("/api/consulta", consultaRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
