import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';
import cors from 'cors';
import uploadRoutes from "./routes/server.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/", uploadRoutes);



const app = express();

// Aumentando o limite do corpo da requisição para 50MB
app.use(express.json({ limit: '50mb' })); // Limite do corpo da requisição para JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Limite para dados URL-encoded (se você estiver enviando formulários)

app.use(cors({ origin: '*' })); // Permite requisições de qualquer origem

app.use('/', publicRoutes);
app.use('/', auth, privateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});