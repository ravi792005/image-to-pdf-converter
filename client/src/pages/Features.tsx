import { Layers, RotateCw, ShieldCheck, Moon, Smartphone, Gauge } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

const FEATURES = [
  {
    icon: Layers,
    title: "Multi-image upload",
    description: "Drop in dozens of images at once and watch them queue up instantly for arranging.",
  },
  {
    icon: RotateCw,
    title: "Reorder & rotate",
    description: "Drag cards into place and rotate any image 90° at a time before you convert.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "No account, no database. Every file is deleted automatically within minutes.",
  },
  {
    icon: Gauge,
    title: "Fast conversion",
    description: "Images are processed server-side with an optimized pipeline for quick turnaround.",
  },
  {
    icon: Moon,
    title: "Light & dark mode",
    description: "A comfortable reading experience whichever theme you prefer, day or night.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "A fully responsive layout that works on desktop, tablet, and mobile alike.",
  },
];

export default function Features(): JSX.Element {
  return (
    <>
      <SEO
        title="Features"
        description="See everything the Secure Image to PDF Converter can do: multi-upload, reordering, rotation, dark mode, and more."
        path="/features"
      />
      <PageHeader
        title="Everything you need, nothing you don't"
        subtitle="A focused toolset for turning images into a polished PDF, without the clutter."
      />

      <div className="container-page grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="glass-card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
              <feature.icon size={22} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-dark dark:text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
