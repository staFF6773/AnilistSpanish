const { fetchFromAnilist } = require('../services/anilistService');
const { traducirTexto, traducirTitulo, traducirEstado } = require('../utils/traduccion');

async function buscarAnimePorId(req, res) {
  try {
    const query = `
      query ($id: Int) {
        Media (id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description
          episodes
          status
          genres
          averageScore
          coverImage {
            large
          }
        }
      }
    `;

    const data = await fetchFromAnilist(query, { id: parseInt(req.params.id) });
    
    if (data.errors) {
      return res.status(404).json({ error: 'Anime no encontrado' });
    }

    const anime = data.data.Media;
    
    let descripcion = anime.description || 'Sin descripción disponible';
    descripcion = descripcion.replace(/<[^>]*>/g, '');
    const descripcionTraducida = await traducirTexto(descripcion);
    const titulos = await traducirTitulo(anime.title);

    const animeTraducido = {
      id: anime.id,
      titulos: titulos,
      descripcion: descripcionTraducida,
      episodios: anime.episodes || '?',
      estado: traducirEstado(anime.status),
      generos: anime.genres || [],
      puntuacion: anime.averageScore || 'Sin puntuación',
      imagen: anime.coverImage?.large || null
    };

    res.json(animeTraducido);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener datos del anime' });
  }
}

async function buscarAnimePorNombre(req, res) {
  try {
    const query = `
      query ($busqueda: String) {
        Page (page: 1, perPage: 10) {
          media (search: $busqueda, type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
              native
            }
            status
            episodes
            averageScore
            coverImage {
              large
            }
          }
        }
      }
    `;

    const data = await fetchFromAnilist(query, { busqueda: req.params.nombre });
    
    if (data.errors) {
      return res.status(404).json({ error: 'No se encontraron resultados' });
    }

    const resultados = await Promise.all(data.data.Page.media.map(async anime => ({
      id: anime.id,
      titulos: await traducirTitulo(anime.title),
      estado: traducirEstado(anime.status),
      episodios: anime.episodes || '?',
      puntuacion: anime.averageScore || 'Sin puntuación',
      imagen: anime.coverImage?.large || null
    })));

    res.json(resultados);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al buscar anime' });
  }
}

module.exports = {
  buscarAnimePorId,
  buscarAnimePorNombre
}; 
