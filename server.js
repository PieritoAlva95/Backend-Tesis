const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Conectar la base de datos
connectDB();

app.get('/', (req, res) => res.send('API corriendo'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`El servidor inicio en el puerto ${PORT}`));
