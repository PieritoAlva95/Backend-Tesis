const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Conectar la base de datos
connectDB();

app.get('/', (req, res) => res.send('API corriendo'));

// Definir rutas
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`El servidor inicio en el puerto ${PORT}`));
