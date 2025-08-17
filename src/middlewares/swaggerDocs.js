import createHttpError from 'http-errors';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    return swaggerDoc;
  } catch (err) {
    throw createHttpError(500, "Can't load swagger docs");
  }
};
