interface ProgressBarProps {
  percent: number;
  label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps): JSX.Element {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      {label && <p className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-light to-brand transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
