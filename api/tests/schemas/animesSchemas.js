// ---------------------------------------------------------
  // SCHEMAS (O Molde do Contrato JSON que a API deve seguir)
  // ---------------------------------------------------------
  export const animeSchema = {
  title: 'Anime Schema MVP',
  type: 'object',
  required: ['id', 'title', 'synopsis', 'episodes', 'score', 'imageUrl'],
  properties: {
    id: { type: 'integer' }, // Vem do anime.mal_id
    title: { type: 'string' },
    synopsis: { type: ['string', 'null'] }, // Synopsis pode vir nula às vezes
    episodes: { type: ['integer', 'null'] },
    score: { type: ['number', 'null'] },
    imageUrl: { type: ['string', 'null'] }
  }
};

export const animeListSchema = {
  type: 'array',
  items: animeSchema
};

export const animeDetailsSchema = {
    title: 'Anime Details Schema',
    type: 'object',
    required: ['id', 'title', 'synopsis', 'episodes', 'status', 'score', 'imageUrl'], // Campos essenciais
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      title_english: { type: ['string', 'null'] },
      synopsis: { type: ['string', 'null'] },
      episodes: { type: ['integer', 'null'] },
      status: { type: ['string', 'null'] },
      aired: { type: ['string', 'null'] },
      score: { type: ['number', 'null'] },
      imageUrl: { type: ['string', 'null'] },
      trailerUrl: { type: ['string', 'null'] },
      genres: { 
        type: ['array', 'null'], 
        items: { type: 'string' } 
      }
    }
  };

  export const topAnimeSchema = {
    title: 'Top Anime Schema (Destaques)',
    type: 'object',
    required: ['id', 'title', 'imageUrl', 'score'], 
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      imageUrl: { type: 'string' }, // O seu código garante a URL do placeholder
      score: { type: 'number' }     // O seu código garante o 0
    }
  };

  export const topAnimeListSchema = {
    title: 'Lista de Destaques Schema',
    type: 'array',
    items: topAnimeSchema
  };