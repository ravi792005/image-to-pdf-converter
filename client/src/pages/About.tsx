import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";

export default function About(): JSX.Element {
  return (
    <>
      <SEO
        title="About"
        description="Learn why this Image to PDF Converter was built with privacy and simplicity as the top priorities."
        path="/about"
      />
      <PageHeader title="About this project" />

      <div className="container-page mx-auto max-w-2xl pb-24">
        <div className="glass-card space-y-4 p-8 text-slate-600 dark:text-slate-300">
          <p>
            Secure Image to PDF Converter started from a simple frustration: most free converters
            online bury a straightforward task under intrusive ads, forced sign-ups, or vague
            promises about what happens to your files after you upload them.
          </p>
          <p>
            This project takes the opposite approach. There's no account system and no database —
            your images exist only long enough to become a PDF, and are then deleted automatically.
            Nothing is kept longer than a few minutes.
          </p>
          <p>
            It's built with a modern, security-conscious stack (React, TypeScript, Node.js, and
            Express) and deployed entirely on free-tier infrastructure, so it can stay free to use
            without compromising on speed or reliability.
          </p>
        </div>
      </div>
    </>
  );
}
