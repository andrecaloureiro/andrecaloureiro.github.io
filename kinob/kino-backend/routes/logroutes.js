const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// Rota para salvar um log
router.post('/save-log', async (req, res) => {
    const { item, log } = req.body;

    if (!item || !log) {
        return res.status(400).json({ success: false, message: 'Dados inválidos.' });
    }

    try {
        const newLog = new Log({ item, log });
        await newLog.save();
        res.json({ success: true, message: 'Log salvo com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar o log:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar o log.' });
    }
});

// Rota para carregar o histórico
router.get('/load-history', async (req, res) => {
    const { item } = req.query;

    if (!item) {
        return res.status(400).json({ success: false, message: 'Item não fornecido.' });
    }

    try {
        const logs = await Log.find({ item }).sort({ timestamp: -1 }); // Ordena do mais recente para o mais antigo
        res.json({ success: true, logs });
    } catch (error) {
        console.error('Erro ao carregar o histórico:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar o histórico.' });
    }
});

module.exports = router;