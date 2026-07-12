import { Request, Response } from "express";
import { env } from "../config/env";
import { AppError, ConvertRequestBody } from "../types";
import { sessionStore } from "../services/sessionStore";
import { buildPdf } from "../services/pdfService";
import { downloadStore } from "../services/downloadStore";
import { cleanupSession } from "../services/cleanupService";
import { isValidUuid } from "../utils/validators";

/**
 * POST /convert
 * Builds a PDF from a previously uploaded session, in the requested order,
 * rotation, page size, and fit mode. The source images are deleted
 * immediately afterward - only the generated PDF is retained, and only
 * until it is downloaded or the retention window elapses.
 */
export async function handleConvert(req: Request, res: Response): Promise<void> {
  const body = req.body as ConvertRequestBody;

  if (!body.sessionId || !isValidUuid(body.sessionId)) {
    throw new AppError("A valid sessionId is required.", 400);
  }

  if (!Array.isArray(body.order) || body.order.length === 0) {
    throw new AppError("An image order array is required.", 400);
  }

  const session = sessionStore.get(body.sessionId);
  if (!session || session.images.length === 0) {
    throw new AppError("Upload session not found or has expired. Please re-upload your images.", 404);
  }

  const { downloadId, filePath, fileName } = await buildPdf(session, body);

  const expiresAt = Date.now() + env.fileRetentionMs;
  downloadStore.add({ downloadId, filePath, fileName, createdAt: Date.now(), expiresAt });

  // Source images are no longer needed once the PDF is built.
  await cleanupSession(session.sessionId);

  res.status(200).json({ downloadId, fileName, expiresAt });
}
