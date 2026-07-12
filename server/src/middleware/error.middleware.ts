import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../types";
import { env } from "../config/env";

/** Wraps async route handlers so thrown/rejected errors reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

/** 404 handler for unmatched API routes. */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
}

/**
 * Final error handler. Never leaks stack traces, server file paths, or raw
 * exception messages to the client in production - only a safe, friendly
 * message plus an HTTP status code.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (!env.isProduction) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  if (err instanceof multer.MulterError) {
    const multerErr = err as multer.MulterError;
    const message =
      multerErr.code === "LIMIT_FILE_SIZE"
        ? "One or more files exceed the maximum allowed file size."
        : multerErr.code === "LIMIT_FILE_COUNT"
        ? "Too many files in a single upload."
        : "File upload error.";
    res.status(413).json({ error: message });
    return;
  }

  if (err instanceof Error && err.message === "UNSUPPORTED_FILE_TYPE") {
    res.status(415).json({ error: "Only JPG, PNG, and WEBP images are allowed." });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Something went wrong on our end. Please try again." });
}
