import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col text-slate-800 dark:text-slate-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
