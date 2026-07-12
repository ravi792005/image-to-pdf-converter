import { Link } from "react-router-dom";
import { FileStack } from "lucide-react";

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist/70 dark:border-white/10 bg-white/50 dark:bg-surface-dark/40 mt-24">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-dark dark:text-white">
            <FileStack size={20} className="text-brand" aria-hidden="true" />
            Image2PDF
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Convert images to PDF entirely in a private, ephemeral session. Nothing you upload is stored longer than a few minutes.
          </p>
        </div>

        <FooterColumn
          title="Product"
          links={[
            { to: "/features", label: "Features" },
            { to: "/how-it-works", label: "How It Works" },
            { to: "/faq", label: "FAQ" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]}
        />
      </div>

      <div className="border-t border-mist/70 dark:border-white/10 py-6">
        <p className="container-page text-center text-xs text-slate-400">
          © {year} Image2PDF. Built with privacy in mind — files are deleted automatically.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}): JSX.Element {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand-light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
