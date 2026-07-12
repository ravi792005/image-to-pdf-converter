export type PageSize = "A4" | "Letter";
export type Orientation = "portrait" | "landscape";
export type FitMode = "fit" | "fill" | "original";

/** Metadata describing a single uploaded image once it has been validated and stored. */
export interface UploadedImageMeta {
  id: string; // random UUID, used as the on-disk filename (no extension leakage)
  originalName: string; // sanitized original filename, for UI display only
  storedPath: string; // absolute path on disk inside the session's temp folder
  mimeType: string;
  size: number;
  rotation: 0 | 90 | 180 | 270;
}

/** A single upload "session" - a batch of images uploaded together. */
export interface UploadSession {
  sessionId: string;
  images: UploadedImageMeta[];
  createdAt: number; // epoch ms, used by the cleanup job
}

/** Body shape expected by POST /convert */
export interface ConvertRequestBody {
  sessionId: string;
  order: string[]; // array of image ids in the order the user wants them
  rotations?: Record<string, 0 | 90 | 180 | 270>;
  pageSize?: PageSize;
  orientation?: Orientation;
  fitMode?: FitMode;
}

export interface ConvertResult {
  downloadId: string;
  fileName: string;
  expiresAt: number;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
