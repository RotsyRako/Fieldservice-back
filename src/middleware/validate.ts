import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { fail } from "../utils/base_response.utils";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues.map(e => e.message).join("; ");
      return res.status(400).json(fail(msg));
    }
    req.body = result.data; // données validées
    next();
  };
