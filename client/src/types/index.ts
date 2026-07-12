export type Rotation = 0 | 90 | 180 | 270;
export type PageSize = "A4" | "Letter";
export type Orientation = "portrait" | "landscape";
export type FitMode = "fit" | "fill" | "original";

export interface UploadedImage {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  rotation: Rotation;
  preview: string; // base64 data URI
}

export interface UploadResponse {
  sessionId: string;
  images: UploadedImage[];
}

export interface ConvertOptions {
  pageSize: PageSize;
  orientation: Orientation;
  fitMode: FitMode;
}

export interface ConvertResponse {
  downloadId: string;
  fileName: string;
  expiresAt: number;
}
