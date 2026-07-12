import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps): JSX.Element {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button type="button" onClick={onDismiss} aria-label="Dismiss error" className="shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}
