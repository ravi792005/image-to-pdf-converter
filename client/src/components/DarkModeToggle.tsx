import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useDarkMode";

export default function DarkModeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 place-items-center rounded-full border border-mist dark:border-white/10
        bg-white/60 dark:bg-white/5 text-brand-dark dark:text-brand-light transition-colors hover:bg-brand/10"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
