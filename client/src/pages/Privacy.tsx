import type { ReactNode } from "react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

export default function Privacy(): JSX.Element {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How the Image to PDF Converter handles your uploaded files and data."
        path="/privacy"
      />
      <PageHeader title="Privacy Policy" subtitle="Last updated: July 2026" />

      <div className="container-page mx-auto max-w-2xl space-y-8 pb-24 text-slate-600 dark:text-slate-300">
        <Section title="What we collect">
          <p>
            We do not require an account and do not collect personal information to use the
            converter. The only data that passes through our servers is the image files you
            choose to upload, which are used solely to generate your PDF.
          </p>
        </Section>
        <Section title="How long files are kept">
          <p>
            Uploaded images and generated PDFs are temporary. They are deleted immediately after
            your PDF is downloaded, or automatically within five minutes of upload if you don't
            complete the conversion — whichever happens first. We do not maintain backups of user
            files.
          </p>
        </Section>
        <Section title="Third parties">
          <p>
            We do not sell, rent, or share your files with any third party. Standard hosting
            providers (used to run the frontend and backend) may log basic request metadata (such
            as IP address and timestamp) for security and abuse prevention, consistent with their
            own privacy policies.
          </p>
        </Section>
        <Section title="Cookies">
          <p>
            The site uses local storage only to remember your light/dark mode preference on your
            own device. No tracking or advertising cookies are used.
          </p>
        </Section>
        <Section title="Contact">
          <p>Questions about this policy can be sent to hello@your-domain.example.</p>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-brand-dark dark:text-white">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
