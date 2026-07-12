import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";
import {
  AppError,
  ConvertRequestBody,
  FitMode,
  Orientation,
  PageSize,
  UploadSession,
} from "../types";
import { ensureDir } from "../utils/fileUtils";

// Page dimensions in PDF points (1pt = 1/72 inch)
const PAGE_SIZES_PORTRAIT: Record<PageSize, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

function getPageDimensions(pageSize: PageSize, orientation: Orientation): [number, number] {
  const [width, height] = PAGE_SIZES_PORTRAIT[pageSize];
  return orientation === "landscape" ? [height, width] : [width, height];
}

/**
 * Builds a single multi-page PDF from the images in `session`, in the order
 * and with the rotations specified in `body`. Returns the absolute path of
 * the generated PDF (stored under temp/downloads/{downloadId}.pdf).
 */
export async function buildPdf(
  session: UploadSession,
  body: ConvertRequestBody
): Promise<{ downloadId: string; filePath: string; fileName: string }> {
  const { order, rotations = {}, pageSize = "A4", orientation = "portrait", fitMode = "fit" } = body;

  if (!order || order.length === 0) {
    throw new AppError("No images provided to convert.", 400);
  }

  const imagesById = new Map(session.images.map((img) => [img.id, img]));

  // Validate every id in `order` actually belongs to this session before touching disk.
  for (const imageId of order) {
    if (!imagesById.has(imageId)) {
      throw new AppError(`Image "${imageId}" was not found in this upload session.`, 400);
    }
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setProducer("Secure Image to PDF Converter");
  pdfDoc.setCreator("Secure Image to PDF Converter");

  const [pageWidth, pageHeight] = getPageDimensions(pageSize as PageSize, orientation as Orientation);

  for (const imageId of order) {
    const meta = imagesById.get(imageId)!;
    const rotation = rotations[imageId] ?? meta.rotation ?? 0;

    // Rotate (if needed) via sharp, then re-encode as PNG for lossless embedding into the PDF.
    let pipeline = sharp(meta.storedPath);
    if (rotation !== 0) {
      pipeline = pipeline.rotate(rotation);
    }
    const pngBuffer = await pipeline.png().toBuffer();
    const embeddedImage = await pdfDoc.embedPng(pngBuffer);

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width: imgWidth, height: imgHeight } = embeddedImage;

    const drawn = computeDrawDimensions(
      imgWidth,
      imgHeight,
      pageWidth,
      pageHeight,
      fitMode as FitMode
    );

    page.drawImage(embeddedImage, {
      x: drawn.x,
      y: drawn.y,
      width: drawn.width,
      height: drawn.height,
    });
  }

  const pdfBytes = await pdfDoc.save();

  const downloadId = uuidv4();
  const downloadsDir = path.join(env.tempDir, "downloads");
  await ensureDir(downloadsDir);
  const filePath = path.join(downloadsDir, `${downloadId}.pdf`);
  await fs.writeFile(filePath, pdfBytes);

  return {
    downloadId,
    filePath,
    fileName: "converted-document.pdf",
  };
}

/** Computes where/how large to draw an image on a page for the given fit mode, preserving aspect ratio unless "fill" is chosen. */
function computeDrawDimensions(
  imgWidth: number,
  imgHeight: number,
  pageWidth: number,
  pageHeight: number,
  fitMode: FitMode
): { x: number; y: number; width: number; height: number } {
  const margin = 20; // small page margin in points, keeps content off the very edge
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  if (fitMode === "fill") {
    return { x: 0, y: 0, width: pageWidth, height: pageHeight };
  }

  const imageRatio = imgWidth / imgHeight;
  const availableRatio = availableWidth / availableHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (fitMode === "original") {
    // Use the image's natural size (in points, treating px as pt), capped to the page.
    drawWidth = Math.min(imgWidth, availableWidth);
    drawHeight = drawWidth / imageRatio;
    if (drawHeight > availableHeight) {
      drawHeight = availableHeight;
      drawWidth = drawHeight * imageRatio;
    }
  } else {
    // "fit" (default): scale to fit entirely within the page, preserving aspect ratio.
    if (imageRatio > availableRatio) {
      drawWidth = availableWidth;
      drawHeight = drawWidth / imageRatio;
    } else {
      drawHeight = availableHeight;
      drawWidth = drawHeight * imageRatio;
    }
  }

  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  return { x, y, width: drawWidth, height: drawHeight };
}
