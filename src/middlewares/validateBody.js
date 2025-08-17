import createHttpRrror from 'http-errors';

export function validateBody(shema) {
  return async (req, res, next) => {
    try {
      await shema.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (error) {
      const errors = error.details.map((detail) => detail.message);
      next(new createHttpRrror.BadRequest(errors));
    }
  };
}