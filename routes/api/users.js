const express = require('express');
const router = express.Router();

// @route GET api/users
// @desc Ruta de prueba
// @access Public
router.get('/', (req, res) => res.send('Ruta de usuarios'));

module.exports = router;
