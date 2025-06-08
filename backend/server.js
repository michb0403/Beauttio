require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const reservasRouter = require('./routes/reservas');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/reservas', reservasRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error MongoDB:', err));

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
