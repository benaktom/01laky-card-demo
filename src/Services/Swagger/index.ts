import swaggerJSDoc from 'swagger-jsdoc';
import { join } from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Card demo',
      version: '1.0.0',
      description: 'Card demo',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    join(__dirname, '../../Routes/authRouter/*.ts'),
    join(__dirname, '../../Routes/baseRouter/*.ts'),
    join(__dirname, '../../Routes/cardRouter/*.ts')
  ],
};

const specs = swaggerJSDoc(options);

export { specs };

