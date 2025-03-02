const mongoose = require('mongoose');

// Define o schema do log
const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now }, // Data e hora do log
    item: String,                                // Identificador do exercício (ex: "d1ex1")
    log: String                                  // Texto do log
});

// Cria o modelo
const Log = mongoose.model('Log', logSchema);

module.exports = Log;