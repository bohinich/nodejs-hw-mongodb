import express from 'express';
import pinoHttp from 'pino-http';
import pino from 'pino';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { getEnvVariable } from './utils/getEnvVar.js';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authenticate } from './middlewares/authenticate.js';

const PORT = getEnvVariable('PORT') || 5150;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(pinoHttp({ logger }));

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    logger.info(`Server is runing on port ${PORT}`);
  });
};