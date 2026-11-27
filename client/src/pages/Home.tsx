import { useState } from "react";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import Dropzone from "../components/Dropzone";
import ImageList from "../components/ImageList";
import ProgressBar from "../components/ProgressBar";
import ConvertPanel from "../components/ConvertPanel";
import ErrorBanner from "../components/ErrorBanner";
import { useImageUpload } from "../hooks/useImageUpload";
import { ConvertOptions } from "../types";
import { RotateCcw } from "lucide-react";

const DEFAULT_OPTIONS: ConvertOptions = {
  pageSize: "A4",
  orientation: "portrait",
  fitMode: "fit",
};

export default function Home(): JSX.Element {
  const {
    images,
    status,
    progress,
    errorMessage,
    downloadUrl,
    addFiles,
    rejectFiles,
    removeImage,
    reorderImages,
    rotateImage,
    convert,
    reset,
    clearError,
  } = useImageUpload();

  const [options, setOptions] = useState<ConvertOptions>(DEFAULT_OPTIONS);

  const isUploading = status === "uploading";
  const isConverting = status === "converting";

  return (
    <>
      <SEO
        title="Free Image to PDF Converter"
        description="Convert JPG, PNG, and WEBP images into a single PDF instantly. No sign-up. Files are automatically deleted."
        path="/"
      />
      <Hero />

      <section id="converter" className="container-page scroll-mt-20 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-brand-dark dark:text-white">Convert your images</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Upload, arrange, and export — all in one place.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {errorMessage && <ErrorBanner message={errorMessage} onDismiss={clearError} />}

          <Dropzone
            onFilesAccepted={addFiles}
            onFilesRejected={rejectFiles}
            disabled={isUploading || isConverting}
          />

          {isUploading && <ProgressBar percent={progress} label="Uploading images…" />}

          {images.length > 0 && (
            <>
              <ImageList
                images={images}
                onRemove={removeImage}
                onRotate={rotateImage}
                onReorder={reorderImages}
              />

              <ConvertPanel
                options={options}
                onOptionsChange={setOptions}
                onConvert={() => convert(options)}
                isConverting={isConverting}
                downloadUrl={downloadUrl}
                disabled={images.length === 0}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand dark:text-slate-400"
                >
                  <RotateCcw size={14} /> Start over
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
