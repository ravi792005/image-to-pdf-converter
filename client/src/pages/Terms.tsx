import type { ReactNode } from "react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

export default function Terms(): JSX.Element {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="The terms governing use of the Image to PDF Converter."
        path="/terms"
      />
      <PageHeader title="Terms of Service" subtitle="Last updated: July 2026" />

      <div className="container-page mx-auto max-w-2xl space-y-8 pb-24 text-slate-600 dark:text-slate-300">
        <Section title="Acceptable use">
          <p>
            You agree to use this service only to convert images that you own or have the right
            to use. You may not upload illegal content, malware, or files intended to abuse or
            disrupt the service.
          </p>
        </Section>
        <Section title="Service availability">
          <p>
            This is a free service running on free-tier infrastructure. We aim for high
            availability but do not guarantee uninterrupted access, and reserve the right to apply
            rate limits or temporarily suspend the service for maintenance.
          </p>
        </Section>
        <Section title="No warranty">
          <p>
            The service is provided "as is" without warranties of any kind. We are not liable for
            any loss of data, since files are intentionally temporary and not recoverable once
            deleted.
          </p>
        </Section>
        <Section title="Limits">
          <p>
            Uploads are limited to 20MB per image and 100MB total per conversion. Requests
            exceeding fair-use rate limits may be throttled or rejected.
          </p>
        </Section>
        <Section title="Changes to these terms">
          <p>We may update these terms from time to time. Continued use of the service constitutes acceptance of the current terms.</p>
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
