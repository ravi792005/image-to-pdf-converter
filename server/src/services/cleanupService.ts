import path from "path";
import { env } from "../config/env";
import { sessionStore } from "./sessionStore";
import { downloadStore } from "./downloadStore";
import { safeRemoveDir, safeUnlink } from "../utils/fileUtils";

/** Deletes every file belonging to an upload session and forgets the session. */
export async function cleanupSession(sessionId: string): Promise<void> {
  const sessionDir = path.join(env.tempDir, sessionId);
  await safeRemoveDir(sessionDir);
  sessionStore.delete(sessionId);
}

/** Deletes a single generated PDF and forgets it. Called right after a successful download. */
export async function cleanupDownload(downloadId: string): Promise<void> {
  const record = downloadStore.get(downloadId);
  if (record) {
    await safeUnlink(record.filePath);
    downloadStore.remove(downloadId);
  }
}

/**
 * Sweeps every tracked session and download and removes anything older than
 * the configured retention window. This is the safety net that guarantees
 * files are deleted even if a user closes the tab mid-flow and the
 * "delete after download" path never fires.
 */
export async function sweepExpired(): Promise<void> {
  const now = Date.now();

  const expiredSessions = sessionStore
    .all()
    .filter((session) => now - session.createdAt > env.fileRetentionMs);
  await Promise.all(expiredSessions.map((session) => cleanupSession(session.sessionId)));

  const expiredDownloads = downloadStore
    .all()
    .filter((download) => now > download.expiresAt);
  await Promise.all(expiredDownloads.map((download) => cleanupDownload(download.downloadId)));
}

let sweepInterval: NodeJS.Timeout | null = null;

/** Starts the recurring background sweep. Call once at server boot. */
export function startCleanupScheduler(): void {
  if (sweepInterval) return;
  // Run twice as often as the retention window (min every 60s) to keep the window tight.
  const intervalMs = Math.min(Math.max(env.fileRetentionMs / 2, 60_000), 5 * 60_000);
  sweepInterval = setInterval(() => {
    sweepExpired().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("[cleanup] sweep failed:", err);
    });
  }, intervalMs);
  sweepInterval.unref(); // don't keep the process alive just for this timer
}

export function stopCleanupScheduler(): void {
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
}
