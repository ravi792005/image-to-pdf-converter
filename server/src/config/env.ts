import dotenv from "dotenv";
import path from "path";

dotenv.config();

/**
 * Centralized, validated environment configuration.
 * Every other module reads config from here instead of touching
 * process.env directly, so defaults and parsing live in one place.
 */
function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // Comma separated list -> array, trimmed, empty entries removed
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads"),
  tempDir: path.resolve(process.cwd(), process.env.TEMP_DIR || "temp"),

  maxFileSizeBytes: toNumber(process.env.MAX_FILE_SIZE_MB, 20) * 1024 * 1024,
  maxTotalSizeBytes: toNumber(process.env.MAX_TOTAL_SIZE_MB, 100) * 1024 * 1024,
  maxFiles: toNumber(process.env.MAX_FILES, 50),

  fileRetentionMs: toNumber(process.env.FILE_RETENTION_MINUTES, 5) * 60 * 1000,

  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MINUTES, 15) * 60 * 1000,
  rateLimitMaxRequests: toNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
};
