const express = require('express');

const app = express();

app.get('/', (req, res)=> res.send('API corriendo'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Servidor iniciado en el puerto ${PORT}`));