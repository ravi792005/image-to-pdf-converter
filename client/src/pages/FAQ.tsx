import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

const FAQS = [
  {
    question: "Do you store my images?",
    answer:
      "No. Images are held only for the duration of your session and are deleted automatically after conversion, after download, or within five minutes — whichever comes first.",
  },
  {
    question: "What file types are supported?",
    answer: "JPG, JPEG, PNG, and WEBP. Any other file type is rejected before it's ever saved to disk.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes — 20MB per image and 100MB total per conversion, to keep the service fast and fair for everyone.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account or sign-up is required. Just upload, arrange, and download.",
  },
  {
    question: "Can I reorder or rotate images before converting?",
    answer: "Yes — drag any image card to reorder it, and use the rotate button to turn it 90° at a time.",
  },
  {
    question: "Is the service free?",
    answer: "Yes, the converter is free to use and runs entirely on free-tier hosting infrastructure.",
  },
];

export default function FAQ(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Answers to common questions about privacy, file limits, supported formats, and pricing."
        path="/faq"
      />
      <PageHeader title="Frequently asked questions" />

      <div className="container-page mx-auto max-w-3xl space-y-3 pb-24">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="glass-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-display font-medium text-brand-dark dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
