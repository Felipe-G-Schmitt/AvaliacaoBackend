const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Avaliação Backend',
      version: '1.0.0',
      description: 'Documentação da API que gerencia usuários, produtos e pedidos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    security: [
      { bearerAuth: [] }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerOptions = require('swagger-jsdoc')(options);
module.exports = swaggerOptions;