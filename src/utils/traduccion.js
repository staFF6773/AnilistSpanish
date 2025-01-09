const translate = require('translate-google');

const traducirEstado = (status) => {
  const estados = {
    'FINISHED': 'Finalizado',
    'RELEASING': 'En emisión',
    'NOT_YET_RELEASED': 'Próximamente',
    'CANCELLED': 'Cancelado',
    'HIATUS': 'En pausa'
  };
  return estados[status] || status;
};

async function traducirTexto(texto) {
  if (!texto) return '';
  
  try {
    const traduccion = await translate(texto, { to: 'es' });
    return traduccion;
  } catch (error) {
    console.error('Error de traducción:', error);
    return texto;
  }
}

async function traducirTitulo(titulo) {
  try {
    const tituloEspanol = await traducirTexto(titulo.romaji);
    return {
      nativo: titulo.native || titulo.romaji,
      espanol: tituloEspanol
    };
  } catch (error) {
    console.error('Error al traducir título:', error);
    return {
      nativo: titulo.native || titulo.romaji,
      espanol: titulo.romaji
    };
  }
}

module.exports = {
  traducirEstado,
  traducirTexto,
  traducirTitulo
}; 
