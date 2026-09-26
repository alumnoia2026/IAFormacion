import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientesRoutes from "./routes/clientesRoutes.js";
import atencionRoutes from "./routes/atencionRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Añade las URLs de localhost (3000 o 5173 según uses React estándar o Vite)
const allowedOrigins = [
  "https://iaformacion-1.onrender.com", 
  "http://localhost:5173",  // Común si usas Vite
  "http://localhost:3000"   // Común si usas Create React App
];

// 2. Modifica la configuración de CORS para validar el origen dinámicamente
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o llamadas del propio servidor)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "X-API-Key"]
}));

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({ message: "API ejercicio4 funcionando correctamente" });
});

app.use("/api/clientes", clientesRoutes);
app.use("/api/atencion", atencionRoutes);
app.use("/api/consulta", consultaRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
