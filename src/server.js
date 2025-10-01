import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import statusMessages from '../statusMessages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const port = 3000;

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Erro: A chave de API não foi definida no ambiente.");
}

const textOnlyModel = 'models/gemini-pro';

const client = new GoogleGenerativeAI({
    auth: { apiKey: API_KEY },
});

app.use(cors());
app.use(express.json());
app.use(express.static(projectRoot));

app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(statusMessages.BadRequest).json({ message: 'A mensagem não foi fornecida.' });
    }

    try {
        const result = await client.generateContent({
            model: textOnlyModel,
            prompt: { text: message },
        });

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            return res.status(statusMessages.InternalServerError).json({ message: 'Não foi possível obter uma resposta da IA.' });
        }

        const iaResponse = result.response.candidates[0].content.parts[0].text;

        res.status(statusMessages.OK).json({ message: iaResponse });

    } catch (error) {
        console.error('Erro ao chamar a API da IA:', error);
        res.status(statusMessages.InternalServerError).json({ message: 'Ocorreu um erro ao processar a requisição da IA.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js rodando em http://localhost:${port}`);
});
