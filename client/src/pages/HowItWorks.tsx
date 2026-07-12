import { Upload, ListOrdered, FileOutput, Download } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

const STEPS = [
  {
    icon: Upload,
    title: "Upload your images",
    description: "Drag and drop or browse for JPG, PNG, or WEBP files. Add as many as you need.",
  },
  {
    icon: ListOrdered,
    title: "Arrange them",
    description: "Drag cards to set the page order, rotate any image, and remove ones you don't want.",
  },
  {
    icon: FileOutput,
    title: "Choose your PDF settings",
    description: "Pick a page size, orientation, and how images should fit on the page.",
  },
  {
    icon: Download,
    title: "Download your PDF",
    description: "Your PDF is generated in seconds. Download it once — the file is then deleted.",
  },
];

export default function HowItWorks(): JSX.Element {
  return (
    <>
      <SEO
        title="How It Works"
        description="A simple four-step process: upload, arrange, configure, and download your PDF."
        path="/how-it-works"
      />
      <PageHeader
        title="From images to PDF in four steps"
        subtitle="No learning curve, no account required — just a straightforward path from upload to download."
      />

      <div className="container-page grid gap-6 pb-24 md:grid-cols-2">
        {STEPS.map((step, index) => (
          <div key={step.title} className="glass-card flex gap-4 p-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-white font-display font-bold">
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <step.icon size={18} className="text-brand" />
                <h3 className="font-display text-lg font-semibold text-brand-dark dark:text-white">
                  {step.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
