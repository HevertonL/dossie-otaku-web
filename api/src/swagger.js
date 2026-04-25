import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dossiê Otaku API',
      version: '1.0.0',
      description: 'Documentação interativa da API do Dossiê Otaku',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' },
    ],
  },
  // Diz ao Swagger onde procurar as anotações das rotas
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};