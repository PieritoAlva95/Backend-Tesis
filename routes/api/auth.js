const express = require('express');
const router = express.Router();

// @route GET api/auth
// @desc Ruta de prueba
// @access Public
router.get('/', (req, res) => res.send('Ruta de autorizacion'));

module.exports = router;
