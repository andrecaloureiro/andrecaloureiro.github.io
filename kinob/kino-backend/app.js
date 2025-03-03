require('dotenv').config(); // Carrega variáveis de ambiente (opcional)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Middleware
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Parse JSON

// Conexão com o MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://andrenox:m$4dm1n$@defaultnosql.w3fpt.mongodb.net/?retryWrites=true&w=majority&appName=defaultnosql';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api', logRoutes); // Prefixo "/api" para as rotas

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});