import { useCallback, useRef, useState } from "react";
import { cleanupSession, convertToPdf, getDownloadUrl, uploadImages } from "../services/api";
import { ConvertOptions, Rotation, UploadedImage } from "../types";

export type FlowStatus = "idle" | "uploading" | "ready" | "converting" | "done" | "error";

const MAX_FILE_SIZE_MB = 20;
const MAX_TOTAL_SIZE_MB = 100;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const validateFiles = useCallback((files: File[]): string | null => {
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return `"${file.name}" isn't a supported format. Please use JPG, PNG, or WEBP.`;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `"${file.name}" is larger than the ${MAX_FILE_SIZE_MB}MB per-file limit.`;
      }
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      return `Total selection exceeds the ${MAX_TOTAL_SIZE_MB}MB limit.`;
    }
    return null;
  }, []);

  const addFiles = useCallback(
    async (files: File[]) => {
      setErrorMessage(null);
      const validationError = validateFiles(files);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus("error");
        return;
      }

      setStatus("uploading");
      setProgress(0);

      try {
        const response = await uploadImages(files, sessionIdRef.current, (percent) =>
          setProgress(percent)
        );
        sessionIdRef.current = response.sessionId;
        setSessionId(response.sessionId);
        setImages((prev) => [...prev, ...response.images]);
        setStatus("ready");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
        setStatus("error");
      }
    },
    [validateFiles]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const rotateImage = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, rotation: (((img.rotation + 90) % 360) as Rotation) }
          : img
      )
    );
  }, []);

  const reset = useCallback(async () => {
    if (sessionIdRef.current) {
      await cleanupSession(sessionIdRef.current);
    }
    sessionIdRef.current = null;
    setSessionId(null);
    setImages([]);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
    setDownloadUrl(null);
  }, []);

  const convert = useCallback(
    async (options: ConvertOptions) => {
      if (!sessionIdRef.current || images.length === 0) {
        setErrorMessage("Add at least one image before converting.");
        return;
      }

      setStatus("converting");
      setErrorMessage(null);

      try {
        const rotations = Object.fromEntries(images.map((img) => [img.id, img.rotation]));
        const order = images.map((img) => img.id);
        const result = await convertToPdf(sessionIdRef.current, order, rotations, options);
        setDownloadUrl(getDownloadUrl(result.downloadId));
        setStatus("done");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Conversion failed.");
        setStatus("error");
      }
    },
    [images]
  );

  return {
    images,
    sessionId,
    status,
    progress,
    errorMessage,
    downloadUrl,
    addFiles,
    removeImage,
    reorderImages,
    rotateImage,
    convert,
    reset,
    clearError,
  };
}
