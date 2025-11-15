import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
};
