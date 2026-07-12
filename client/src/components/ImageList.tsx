import { useRef } from "react";
import { UploadedImage } from "../types";
import ImageCard from "./ImageCard";

interface ImageListProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function ImageList({ images, onRemove, onRotate, onReorder }: ImageListProps): JSX.Element {
  const dragIndex = useRef<number | null>(null);

  const handleDragStart = (index: number): void => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number): void => {
    if (dragIndex.current === null || dragIndex.current === index) return;
    onReorder(dragIndex.current, index);
    dragIndex.current = index;
  };

  const handleDragEnd = (): void => {
    dragIndex.current = null;
  };

  if (images.length === 0) return <></>;

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        Drag cards to reorder · {images.length} image{images.length > 1 ? "s" : ""} selected
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            onRemove={onRemove}
            onRotate={onRotate}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
