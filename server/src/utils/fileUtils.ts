import fs from "fs/promises";
import path from "path";

/** Ensures a directory exists, creating it (and parents) if necessary. */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/** Deletes a file if it exists; silently ignores "file not found" errors. */
export async function safeUnlink(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (err: unknown) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code !== "ENOENT") {
      // Re-throw anything that isn't "already gone" - permission errors etc. matter.
      throw err;
    }
  }
}

/** Recursively removes a directory and its contents if it exists. */
export async function safeRemoveDir(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup - never let a cleanup failure crash the process.
  }
}

/** Returns the age of a file in milliseconds based on its creation/modify time. */
export async function getFileAgeMs(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  const referenceTime = Math.max(stats.birthtimeMs, stats.mtimeMs);
  return Date.now() - referenceTime;
}

/** Lists absolute paths of every entry (file or dir) directly inside `dirPath`. */
export async function listEntries(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.map((entry) => path.join(dirPath, entry));
  } catch {
    return [];
  }
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
