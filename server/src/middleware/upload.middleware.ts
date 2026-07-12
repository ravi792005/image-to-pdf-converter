import multer from "multer";
import { env } from "../config/env";
import { isAllowedMimeType } from "../utils/validators";

/**
 * Files are held in memory (not written to disk by multer directly) because
 * we always re-encode them through sharp before persisting - see
 * imageService.validateAndStoreImage. This avoids ever writing untrusted
 * bytes to disk under a path we didn't fully control.
 */
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: env.maxFileSizeBytes,
    files: env.maxFiles,
  },
  fileFilter: (_req, file, callback) => {
    if (!isAllowedMimeType(file.mimetype)) {
      // Reject early - multer will surface this as a LIMIT_UNEXPECTED_FILE style error
      // which our error middleware translates into a friendly 415 response.
      callback(new Error("UNSUPPORTED_FILE_TYPE"));
      return;
    }
    callback(null, true);
  },
});
