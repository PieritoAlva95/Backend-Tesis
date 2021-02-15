const express = require('express');
const router = express.Router();

// @route GET api/posts
// @desc Ruta de prueba
// @access Public
router.get('/', (req, res) => res.send('Ruta de posts'));

module.exports = router;
