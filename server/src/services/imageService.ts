import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { env } from "../config/env";
import { AppError, UploadedImageMeta } from "../types";
import { ensureDir } from "../utils/fileUtils";
import {
  isAllowedExtension,
  isAllowedMimeType,
  sanitizeFileName,
} from "../utils/validators";

export interface RawUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Validates and persists a single uploaded file.
 *
 * Security notes:
 * - MIME type AND extension are both checked against an allow-list.
 * - The file is re-encoded through sharp rather than written verbatim. This
 *   strips EXIF/XMP metadata (which can leak GPS location, device info, etc.)
 *   and also acts as a content sanity check - sharp will throw if the bytes
 *   are not actually a decodable image, catching files that merely spoof
 *   their extension/MIME type.
 * - The file is stored under a randomly generated UUID name, never the
 *   user-supplied name, so the original filename can never be used to
 *   influence a path on disk.
 */
export async function validateAndStoreImage(
  file: RawUploadFile,
  sessionDir: string
): Promise<UploadedImageMeta> {
  if (!isAllowedMimeType(file.mimetype)) {
    throw new AppError(
      `Unsupported file type "${file.mimetype}". Only JPG, PNG, and WEBP images are allowed.`,
      415
    );
  }

  if (!isAllowedExtension(file.originalname)) {
    throw new AppError(
      `Unsupported file extension for "${sanitizeFileName(file.originalname)}".`,
      415
    );
  }

  if (file.size > env.maxFileSizeBytes) {
    throw new AppError(
      `"${sanitizeFileName(file.originalname)}" exceeds the ${
        env.maxFileSizeBytes / (1024 * 1024)
      }MB per-file limit.`,
      413
    );
  }

  await ensureDir(sessionDir);

  const id = uuidv4();
  const storedPath = path.join(sessionDir, `${id}.jpg`);

  try {
    // Re-encode to strip metadata and normalize format; also validates the
    // buffer is genuinely a decodable image (defeats extension spoofing).
    await sharp(file.buffer)
      .rotate() // auto-orient based on EXIF before we strip it
      .jpeg({ quality: 92 })
      .toFile(storedPath);
  } catch {
    throw new AppError(
      `"${sanitizeFileName(file.originalname)}" could not be processed. The file may be corrupted.`,
      422
    );
  }

  const stats = await fs.stat(storedPath);

  return {
    id,
    originalName: sanitizeFileName(file.originalname),
    storedPath,
    mimeType: "image/jpeg",
    size: stats.size,
    rotation: 0,
  };
}

/** Returns a small base64 data URI so the frontend can render a preview without a separate file route. */
export async function generatePreviewDataUri(filePath: string): Promise<string> {
  const previewBuffer = await sharp(filePath)
    .resize({ width: 400, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toBuffer();
  return `data:image/jpeg;base64,${previewBuffer.toString("base64")}`;
}
