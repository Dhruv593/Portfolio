import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Pass only validated fields to controllers. Parsing alone leaves unknown
      // client fields in req.body, where update services could persist them.
      if (parsed.body !== undefined) req.body = parsed.body;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        return sendError(res, `Validation failed: ${issues}`, 400, error.issues);
      }
      return sendError(res, 'Invalid request input', 400);
    }
  };
};
