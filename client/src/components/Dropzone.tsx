import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
}

export default function Dropzone({ onFilesAccepted, disabled }: DropzoneProps): JSX.Element {
  const onDrop = useCallback(
    (acceptedFiles: File[], _rejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-card flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed
        px-6 py-14 text-center transition-colors
        ${isDragActive ? "border-brand bg-brand/5" : "border-mist dark:border-white/15"}
        ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-brand/60"}`}
    >
      <input {...getInputProps()} aria-label="Upload images" />
      <div className="grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
        <UploadCloud size={26} />
      </div>
      <p className="font-display text-lg font-semibold text-brand-dark dark:text-white">
        {isDragActive ? "Drop your images here" : "Drag & drop images, or click to browse"}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        JPG, PNG, or WEBP · up to 20MB per image · 100MB total
      </p>
    </div>
  );
}
