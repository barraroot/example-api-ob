const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());

// Constantes da API externa
const EXTERNAL_API_BASE_URL = 'https://backoffice.demo-corretora.com/api/v1';
const REGISTER_TOKEN = '2eb1dc49-cd9a-4408-a871-902cffd9ce1c';

// Rota para registro de usuário
app.post('/register', async (req, res, next) => {
    const userData = req.body;

    // Validação básica (pode ser expandida)
    const requiredFields = [
        'country', 'password', 'currency', 'ddi', 'phone', 
        'password_confirmation', 'email'
    ];
    const missingFields = requiredFields.filter(field => !(field in userData));

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios ausentes', 
            missing: missingFields 
        });
    }

    if (userData.password !== userData.password_confirmation) {
        return res.status(400).json({ error: 'As senhas não conferem' });
    }

    try {
        console.log(`Enviando requisição de registro para: ${EXTERNAL_API_BASE_URL}/user-register`);
        const response = await axios.post(`${EXTERNAL_API_BASE_URL}/user-register`, userData, {
            headers: {
                'token': REGISTER_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Resposta da API externa (Registro):', response.status, response.data);
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Erro ao chamar API externa (Registro):', error.response ? error.response.data : error.message);
        // Passa o erro para o middleware de tratamento de erros
        next(error); 
    }
});

// Rota para autenticação de usuário
app.post('/login', async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'O campo email é obrigatório' });
    }

    try {
        console.log(`Enviando requisição de login para: ${EXTERNAL_API_BASE_URL}/auth-external`);
        const response = await axios.post(`${EXTERNAL_API_BASE_URL}/auth-external`, { email }, {
             headers: {
                'token': REGISTER_TOKEN, // Adicionado o token aqui
                'Content-Type': 'application/json'
            }
        });

        console.log('Resposta da API externa (Login):', response.status, response.data);
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Erro ao chamar API externa (Login):', error.response ? error.response.data : error.message);
        next(error);
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro detectado:', err.stack); // Log completo do erro no servidor

    // Verifica se o erro veio do Axios e tem uma resposta da API externa
    if (err.response) {
        // Retorna o status e corpo do erro da API externa
        res.status(err.response.status || 500).json({
            message: 'Erro na comunicação com a API externa.',
            errorDetails: err.response.data
        });
    } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        res.status(504).json({ message: 'API externa não respondeu (Gateway Timeout).' });
    } else {
        // Erro ao configurar a requisição ou outro erro interno
        res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor intermediário rodando em http://0.0.0.0:${port}`);
});

