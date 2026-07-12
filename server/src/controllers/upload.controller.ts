import path from "path";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";
import { AppError } from "../types";
import { generatePreviewDataUri, validateAndStoreImage } from "../services/imageService";
import { sessionStore } from "../services/sessionStore";
import { isValidUuid } from "../utils/validators";

/**
 * POST /upload
 * Accepts multipart/form-data with one or more "images" files, plus an
 * optional "sessionId" field to append to an existing session (used when
 * the user adds more images after their first batch).
 */
export async function handleUpload(req: Request, res: Response): Promise<void> {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  if (files.length === 0) {
    throw new AppError("No files were uploaded.", 400);
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > env.maxTotalSizeBytes) {
    throw new AppError(
      `Total upload size exceeds the ${env.maxTotalSizeBytes / (1024 * 1024)}MB limit.`,
      413
    );
  }

  const requestedSessionId = typeof req.body.sessionId === "string" ? req.body.sessionId : undefined;
  const sessionId =
    requestedSessionId && isValidUuid(requestedSessionId) ? requestedSessionId : uuidv4();

  const sessionDir = path.join(env.tempDir, sessionId);

  const storedImages = await Promise.all(
    files.map((file) =>
      validateAndStoreImage(
        {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer,
        },
        sessionDir
      )
    )
  );

  sessionStore.addImages(sessionId, storedImages);

  const imagesWithPreviews = await Promise.all(
    storedImages.map(async (image) => ({
      id: image.id,
      originalName: image.originalName,
      size: image.size,
      mimeType: image.mimeType,
      rotation: image.rotation,
      preview: await generatePreviewDataUri(image.storedPath),
    }))
  );

  res.status(201).json({
    sessionId,
    images: imagesWithPreviews,
  });
}
