import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Configuração do Multer para armazenar imagens em memória
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// Rota para upload de imagem
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

        const filePath = `uploads/${Date.now()}_${file.originalname}`;
        const { data, error } = await supabase.storage
            .from("redator")
            .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (error) throw error;

        const { publicUrl } = supabase.storage.from("redator").getPublicUrl(filePath);
        res.json({ url: publicUrl });
    } catch (error) {
        console.error("Erro no upload:", error.message);
        res.status(500).json({ error: "Erro ao enviar arquivo." });
    }
});

export default app;
