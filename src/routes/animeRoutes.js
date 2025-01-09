const express = require('express');
const router = express.Router();
const { buscarAnimePorId, buscarAnimePorNombre } = require('../controllers/animeController');

router.get('/anime/:id', buscarAnimePorId);
router.get('/anime/search/:nombre', buscarAnimePorNombre);

module.exports = router; 
