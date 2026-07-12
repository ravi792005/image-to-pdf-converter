import { Download, FileOutput, Loader2 } from "lucide-react";
import { ConvertOptions, FitMode, Orientation, PageSize } from "../types";

interface ConvertPanelProps {
  options: ConvertOptions;
  onOptionsChange: (options: ConvertOptions) => void;
  onConvert: () => void;
  isConverting: boolean;
  downloadUrl: string | null;
  disabled: boolean;
}

const PAGE_SIZES: PageSize[] = ["A4", "Letter"];
const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];
const FIT_MODES: { value: FitMode; label: string }[] = [
  { value: "fit", label: "Fit to page" },
  { value: "fill", label: "Fill page" },
  { value: "original", label: "Original size" },
];

export default function ConvertPanel({
  options,
  onOptionsChange,
  onConvert,
  isConverting,
  downloadUrl,
  disabled,
}: ConvertPanelProps): JSX.Element {
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-lg font-semibold text-brand-dark dark:text-white">
        PDF Settings
      </h3>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Page Size"
          value={options.pageSize}
          onChange={(value) => onOptionsChange({ ...options, pageSize: value as PageSize })}
          items={PAGE_SIZES.map((size) => ({ value: size, label: size }))}
        />
        <SelectField
          label="Orientation"
          value={options.orientation}
          onChange={(value) => onOptionsChange({ ...options, orientation: value as Orientation })}
          items={ORIENTATIONS}
        />
        <SelectField
          label="Image Fit"
          value={options.fitMode}
          onChange={(value) => onOptionsChange({ ...options, fitMode: value as FitMode })}
          items={FIT_MODES}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        {downloadUrl ? (
          <a href={downloadUrl} className="btn-primary" download>
            <Download size={18} /> Download PDF
          </a>
        ) : (
          <button type="button" onClick={onConvert} disabled={disabled || isConverting} className="btn-primary">
            {isConverting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Converting…
              </>
            ) : (
              <>
                <FileOutput size={18} /> Convert to PDF
              </>
            )}
          </button>
        )}
        {downloadUrl && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This link expires shortly and can only be used once — download it now.
          </p>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string }[];
}): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-mist bg-white/80 px-3 py-2.5 text-sm text-slate-700
          focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
