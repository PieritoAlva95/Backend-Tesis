const express = require('express');
const router = express.Router();

// @route GET api/profile
// @desc Ruta de prueba
// @access Public
router.get('/', (req, res) => res.send('Ruta de perfiles'));

module.exports = router;
