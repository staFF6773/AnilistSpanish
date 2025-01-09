const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const animeRoutes = require('./routes/animeRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Bienvenido a aniListSpanish by @StaFF6773!',
    endpoints: {
      'GET /api/anime/:id': 'Obtener anime por ID',
      'GET /api/anime/search/:nombre': 'Buscar anime por nombre'
    }
  });
});

// Rutas
app.use('/api', animeRoutes);

app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
}); 
