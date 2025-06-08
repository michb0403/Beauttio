const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

// Modelo de reserva
const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  genero: { type: String, required: true },
  corte: { type: String, required: true },
  reserva: { type: Date, required: true }
});


const Reserva = mongoose.model('Reserva', reservaSchema);

// Ruta de registro
app.post('/registro', async (req, res) => {
  const { nombre, genero, corte, reserva } = req.body;

  if (!nombre || !genero || !corte || !reserva) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  try {
    const nuevaReserva = new Reserva({ nombre, genero, corte, reserva });
    await nuevaReserva.save();
    res.redirect('/registro_exitoso.html');
  } catch (error) {
    console.error('Error guardando la reserva:', error);
    res.status(500).send('Error guardando la reserva');
  }
});

app.post('/login', async (req, res) => {
  const { nombre, corte } = req.body;

  if (!nombre || !corte) {
    return res.status(400).send('Faltan datos para el login');
  }

  try {
    const reservaEncontrada = await Reserva.findOne({ nombre, corte });

    if (!reservaEncontrada) {
      return res.status(404).send('No se encontró una reserva con esos datos');
    }

    // Buscar todas las reservas del usuario
    const reservas = await Reserva.find({ nombre });

    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Mis Reservas</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Montserrat', sans-serif;
            background: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            text-align: center;
          }
          h2 {
            color: #be2d5a9e;
            margin-bottom: 20px;
          }
          ul {
            list-style: none;
            padding: 0;
            text-align: left;
          }
          li {
            background: #ffe7dc;
            margin: 10px 0;
            padding: 15px;
            border-radius: 6px;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #5ae3f180;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
          a:hover {
            background-color: #5ae3f180;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reservas de ${nombre}</h2>
          <ul>
    `;

    reservas.forEach(r => {
      html += `<li>
        <strong>Corte:</strong> ${r.corte} <br>
        <strong>Género:</strong> ${r.genero} <br>
        <strong>Fecha:</strong> ${new Date(r.reserva).toLocaleString()}
      </li>`;
    });

    html += `
          </ul>
          <a href="/registro.html">Volver</a>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error del servidor');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
