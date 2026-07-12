import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, FileStack } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const NAV_LINKS = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist/70 dark:border-white/10 bg-paper/80 dark:bg-ink/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-dark dark:text-white">
          <FileStack size={22} className="text-brand" aria-hidden="true" />
          Image<span className="text-brand">2</span>PDF
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand dark:text-brand-light"
                    : "text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand-light"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <DarkModeToggle />
          <Link to="/#converter" className="btn-primary !px-4 !py-2 text-sm">
            Convert Now
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <DarkModeToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-full border border-mist dark:border-white/10"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-mist/70 dark:border-white/10 bg-paper dark:bg-ink px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand/10"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/#converter"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 text-sm"
            >
              Convert Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
