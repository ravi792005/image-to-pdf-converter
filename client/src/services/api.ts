import axios, { AxiosProgressEvent } from "axios";
import { ConvertOptions, ConvertResponse, UploadResponse } from "../types";

// In production, set VITE_API_URL to your Render backend URL (e.g. https://api.yourapp.com/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
});

/** Extracts a friendly error message from an Axios error, falling back to a generic one. */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
    if (!error.response) return "Could not reach the server. Check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

export async function uploadImages(
  files: File[],
  sessionId: string | null,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  if (sessionId) formData.append("sessionId", sessionId);

  try {
    const { data } = await apiClient.post<UploadResponse>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function convertToPdf(
  sessionId: string,
  order: string[],
  rotations: Record<string, number>,
  options: ConvertOptions
): Promise<ConvertResponse> {
  try {
    const { data } = await apiClient.post<ConvertResponse>("/convert", {
      sessionId,
      order,
      rotations,
      ...options,
    });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** Builds the direct download URL for a completed conversion. */
export function getDownloadUrl(downloadId: string): string {
  return `${API_BASE_URL}/download/${downloadId}`;
}

export async function cleanupSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete("/cleanup", { data: { sessionId } });
  } catch {
    // Best-effort - the backend's own retention sweep will catch this regardless.
  }
}
