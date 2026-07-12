import { FormEvent, useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

export default function Contact(): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // NOTE: this demo form only simulates submission client-side. Wire this up
  // to a real endpoint (e.g. a serverless function or form service like
  // Formspree) before going to production.
  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with questions, feedback, or bug reports about the Image to PDF Converter."
        path="/contact"
      />
      <PageHeader title="Get in touch" subtitle="Questions, feedback, or bugs — we'd like to hear about it." />

      <div className="container-page mx-auto max-w-xl pb-24">
        <div className="glass-card p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={40} className="text-green-500" />
              <h2 className="font-display text-xl font-semibold text-brand-dark dark:text-white">
                Message sent
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Thanks for reaching out — we'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                label="Name"
                type="text"
                required
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Message
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-mist bg-white/80 px-3 py-2.5 text-sm text-slate-700
                    focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                />
              </label>
              <button type="submit" className="btn-primary w-full">
                <Send size={16} /> Send message
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Mail size={12} /> Or email us directly at hello@your-domain.example
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  type,
  value,
  required,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-mist bg-white/80 px-3 py-2.5 text-sm text-slate-700
          focus:border-brand focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
      />
    </label>
  );
}
