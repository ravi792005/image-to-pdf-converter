import { RotateCw, X, GripVertical } from "lucide-react";
import { UploadedImage } from "../types";

interface ImageCardProps {
  image: UploadedImage;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

export default function ImageCard({
  image,
  index,
  onRemove,
  onRotate,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: ImageCardProps): JSX.Element {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="glass-card group relative flex flex-col overflow-hidden p-2 animate-fade-up"
    >
      <div className="absolute left-2 top-2 z-10 grid h-7 w-7 cursor-grab place-items-center rounded-full bg-black/40 text-white active:cursor-grabbing">
        <GripVertical size={14} />
      </div>

      <div className="absolute right-2 top-2 z-10 flex gap-1.5">
        <button
          type="button"
          onClick={() => onRotate(image.id)}
          aria-label={`Rotate ${image.originalName}`}
          className="grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white transition hover:bg-brand"
        >
          <RotateCw size={14} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(image.id)}
          aria-label={`Remove ${image.originalName}`}
          className="grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white transition hover:bg-red-500"
        >
          <X size={14} />
        </button>
      </div>

      <div className="aspect-square w-full overflow-hidden rounded-xl bg-mist dark:bg-white/5">
        <img
          src={image.preview}
          alt={image.originalName}
          style={{ transform: `rotate(${image.rotation}deg)` }}
          className="h-full w-full object-cover transition-transform duration-300"
        />
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
          {index + 1}. {image.originalName}
        </span>
      </div>
    </div>
  );
}
