import createHttpError from 'http-errors';

import { isValidObjectId } from 'mongoose';

export function isValidId(req, res, next) {
  console.log(req.params.contactId);
  if (isValidObjectId(req.params.contactId) !== true) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
}