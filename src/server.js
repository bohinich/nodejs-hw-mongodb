import express from 'express';
import pinoHttp from 'pino-http';
import pino from 'pino';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import path from 'node:path';

import { getEnvVariable } from './utils/getEnvVar.js';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import swaggerDocument from '../docs/swagger.json' assert { type: 'json' };

const PORT = getEnvVariable('PORT') || 5150;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use('/photos', express.static(path.resolve('src/uploads/photos')));

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(pinoHttp({ logger }));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    logger.info(`Server is running on port ${PORT}`);
  });
};
