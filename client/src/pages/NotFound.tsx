import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import SEO from "../components/SEO";

export default function NotFound(): JSX.Element {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" />
      <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
          <FileQuestion size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-dark dark:text-white">
          404 — Page not found
        </h1>
        <p className="max-w-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="btn-primary mt-2">
          Back to home
        </Link>
      </div>
    </>
  );
}
