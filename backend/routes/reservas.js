const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');

router.post('/', async (req, res) => {
  const { nombre, corte, fecha } = req.body;
  if (!nombre || !corte || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const nuevaReserva = new Reserva({ nombre, corte, fecha });
    await nuevaReserva.save();
    res.status(201).json({ mensaje: 'Reserva guardada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

module.exports = router;
