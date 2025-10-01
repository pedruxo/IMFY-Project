const express = require('express');
const cors = require('cors');
const { GoogleGenerativeLanguageServiceClient } = require('@google/generative-ai');

const statusMessages = require('./statusMessages');

const app = express();
const port = 3000;

const YOUR_API_KEY = "SUA_CHAVE_DE_API_AQUI"; 
const textOnlyModel = 'models/gemini-pro';

const client = new GoogleGenerativeLanguageServiceClient({
    auth: { apiKey: YOUR_API_KEY },
});

app.use(cors());
app.use(express.json());

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
