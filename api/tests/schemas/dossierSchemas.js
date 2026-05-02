// api/tests/schemas/dossierSchemas.js

export const dossierSchema = {
  title: 'Dossier Schema (Review)',
  type: 'object',
  required: ['id', 'animeId', 'userId', 'rating', 'text', 'hasSpoiler', 'status', 'user'],
  properties: {
    id: { type: 'string' }, 
    animeId: { type: 'integer' },
    userId: { type: 'string'},
    rating: { type: 'integer' },
    text: { type: 'string' },
    hasSpoiler: { type: 'boolean' },
    status: { type: 'string' },
    // A mágica do seu include aparece aqui:
    user: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' }
      },
      additionalProperties: false // Garante que o e-mail/senha NÃO vão vazar no teste!
    }
  }
};

export const dossierListSchema = {
  title: 'Lista de Dossiês Schema',
  type: 'array',
  items: dossierSchema
};