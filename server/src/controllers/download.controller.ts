import { Request, Response } from "express";
import { AppError } from "../types";
import { downloadStore } from "../services/downloadStore";
import { cleanupDownload, cleanupSession } from "../services/cleanupService";
import { isValidUuid } from "../utils/validators";

/**
 * GET /download/:id
 * Streams a generated PDF to the client, then deletes it from disk - the
 * file is single-use. The server path is never exposed to the client; only
 * the random download id is.
 */
export async function handleDownload(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    throw new AppError("Invalid download id.", 400);
  }

  const record = downloadStore.get(id);
  if (!record) {
    throw new AppError("This download link has expired or was already used.", 404);
  }

  res.download(record.filePath, record.fileName, async (err) => {
    // res.download streams the file; once the response has finished (or
    // failed), the single-use file is deleted either way.
    await cleanupDownload(id);
    if (err && !res.headersSent) {
      res.status(500).json({ error: "Failed to send the file." });
    }
  });
}

/**
 * DELETE /cleanup
 * Lets the frontend proactively delete an in-progress upload session, e.g.
 * when the user clears their selection or navigates away before converting.
 * Body: { sessionId: string }
 */
export async function handleManualCleanup(req: Request, res: Response): Promise<void> {
  const { sessionId } = req.body as { sessionId?: string };

  if (!sessionId || !isValidUuid(sessionId)) {
    throw new AppError("A valid sessionId is required.", 400);
  }

  await cleanupSession(sessionId);

  res.status(200).json({ message: "Session cleaned up." });
}
