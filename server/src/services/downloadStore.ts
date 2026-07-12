export interface DownloadRecord {
  downloadId: string;
  filePath: string;
  fileName: string;
  createdAt: number;
  expiresAt: number;
}

/** Tracks generated PDFs that are available for download, until they expire or are downloaded. */
class DownloadStore {
  private downloads = new Map<string, DownloadRecord>();

  add(record: DownloadRecord): void {
    this.downloads.set(record.downloadId, record);
  }

  get(downloadId: string): DownloadRecord | undefined {
    return this.downloads.get(downloadId);
  }

  remove(downloadId: string): void {
    this.downloads.delete(downloadId);
  }

  all(): DownloadRecord[] {
    return Array.from(this.downloads.values());
  }
}

export const downloadStore = new DownloadStore();
