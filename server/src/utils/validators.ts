import path from "path";

/** Only these MIME types are ever accepted. Everything else is rejected outright. */
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** Matching file extensions, used as a second, independent check (defense in depth). */
export const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isAllowedMimeType(mime: string): boolean {
  return ALLOWED_MIME_TYPES.has(mime.toLowerCase());
}

export function isAllowedExtension(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Strips directory components and dangerous characters from a user-supplied
 * filename. This is used ONLY for display purposes - the file is never
 * actually saved under this name (we always use a generated UUID) - but we
 * still sanitize it defensively in case it is ever logged or echoed back.
 */
export function sanitizeFileName(fileName: string): string {
  const base = path.basename(fileName);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

/** Validates that a string is a well-formed UUID v4, used for session/image/download ids. */
export function isValidUuid(value: string): boolean {
  return typeof value === "string" && UUID_V4_REGEX.test(value);
}

/**
 * Resolves `fileName` inside `baseDir` and throws if the resolved path would
 * escape `baseDir`. This is the core defense against directory traversal
 * (e.g. "../../etc/passwd") when building file paths from user input.
 */
export function safeResolvePath(baseDir: string, fileName: string): string {
  const resolvedBase = path.resolve(baseDir);
  const resolvedPath = path.resolve(resolvedBase, fileName);

  if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
    throw new Error("Path traversal detected");
  }

  return resolvedPath;
}
