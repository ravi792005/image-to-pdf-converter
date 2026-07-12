export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }): JSX.Element {
  return (
    <div className="container-page pb-10 pt-16 text-center">
      <h1 className="text-4xl font-bold text-brand-dark dark:text-white">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
