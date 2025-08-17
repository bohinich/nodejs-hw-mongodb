import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js'; // шлях до SWAGGER_PATH

try {
  const data = fs.readFileSync(SWAGGER_PATH, 'utf-8');
  console.log('Swagger JSON loaded successfully!');
} catch (err) {
  console.error('Cannot read swagger.json:', err);
}


export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');