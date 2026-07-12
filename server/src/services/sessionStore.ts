import { UploadSession, UploadedImageMeta } from "../types";

/**
 * In-memory store mapping sessionId -> UploadSession.
 *
 * The project intentionally has no database - uploads are ephemeral and
 * live only as long as the process (or the retention window, whichever is
 * shorter). A Map is sufficient and avoids the operational overhead of a
 * datastore for data that is deleted within minutes anyway.
 *
 * NOTE: because this is in-memory, it does not survive a server restart
 * and does not scale across multiple backend instances. If you need
 * horizontal scaling later, swap this for Redis with a TTL matching
 * FILE_RETENTION_MINUTES - the interface below is intentionally small so
 * that swap is a single-file change.
 */
class SessionStore {
  private sessions = new Map<string, UploadSession>();

  create(sessionId: string): UploadSession {
    const session: UploadSession = {
      sessionId,
      images: [],
      createdAt: Date.now(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  get(sessionId: string): UploadSession | undefined {
    return this.sessions.get(sessionId);
  }

  getOrCreate(sessionId: string): UploadSession {
    return this.get(sessionId) ?? this.create(sessionId);
  }

  addImages(sessionId: string, images: UploadedImageMeta[]): UploadSession {
    const session = this.getOrCreate(sessionId);
    session.images.push(...images);
    return session;
  }

  delete(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  all(): UploadSession[] {
    return Array.from(this.sessions.values());
  }
}

export const sessionStore = new SessionStore();
