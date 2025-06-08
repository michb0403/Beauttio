//Prueba de integracion
// backend/tests/api.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const reservasRouter = require('../../routes/reservas');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/reservas', reservasRouter);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /api/reservas', () => {
  it('debería registrar una nueva reserva', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        nombre: 'Test User',
        corte: 'clásico',
        fecha: '2025-06-20T14:00:00Z'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBe('Reserva guardada');
  });

  it('debería fallar si falta un campo', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({ nombre: 'Test User' }); // falta corte y fecha

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Todos los campos son requeridos');
  });
});
