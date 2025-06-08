const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  corte: { type: String, required: true },
  fecha: { type: Date, required: true }
});

module.exports = mongoose.model('Reserva', reservaSchema);
