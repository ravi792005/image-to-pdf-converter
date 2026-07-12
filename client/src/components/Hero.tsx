import { motion } from "framer-motion";
import { ShieldCheck, Zap, Trash2 } from "lucide-react";

export default function Hero(): JSX.Element {
  return (
    <section className="container-page grid items-center gap-12 pb-20 pt-14 md:grid-cols-2 md:pt-20">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand-dark dark:text-brand-light"
        >
          <ShieldCheck size={14} /> No sign-up · Files auto-deleted
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 text-4xl font-bold leading-[1.1] text-brand-dark dark:text-white sm:text-5xl lg:text-6xl"
        >
          Turn scattered images into one clean PDF.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-md text-lg text-slate-600 dark:text-slate-300"
        >
          Drag in your JPGs, PNGs, or WEBPs, reorder and rotate them, and get back a single
          polished PDF — right in your browser, no account required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a href="#converter" className="btn-primary">
            <Zap size={18} /> Start Converting
          </a>
          <a href="/how-it-works" className="btn-secondary">
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Trash2 size={16} className="text-brand" />
          Every file is permanently deleted within 5 minutes.
        </motion.div>
      </div>

      {/* Signature visual: loose image stack folding into a single bound document */}
      <div className="relative mx-auto h-72 w-full max-w-sm sm:h-80">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-4 top-6 h-40 w-32 rotate-[-10deg] rounded-xl border border-white/60 bg-gradient-to-br from-brand-light to-brand shadow-glass sm:h-44 sm:w-36"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute left-16 top-2 h-40 w-32 rotate-[6deg] rounded-xl border border-white/60 bg-gradient-to-br from-white to-mist shadow-glass sm:h-44 sm:w-36"
        />
        <motion.div
          initial={{ rotate: -3 }}
          animate={{ rotate: [-3, 0, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-10 top-16 flex h-44 w-36 flex-col gap-2 rounded-xl border border-white/70 bg-white/90 p-4 shadow-glass dark:bg-surface-dark sm:h-48 sm:w-40"
        >
          <div className="h-2 w-3/4 rounded-full bg-brand/30" />
          <div className="h-2 w-full rounded-full bg-mist dark:bg-white/10" />
          <div className="h-2 w-full rounded-full bg-mist dark:bg-white/10" />
          <div className="h-2 w-2/3 rounded-full bg-mist dark:bg-white/10" />
          <div className="mt-auto self-end rounded-md bg-brand px-2 py-1 text-[10px] font-semibold text-white">
            PDF
          </div>
        </motion.div>
      </div>
    </section>
  );
}
