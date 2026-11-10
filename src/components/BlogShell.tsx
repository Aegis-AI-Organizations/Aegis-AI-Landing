import { SiteFooter, SiteNav } from "./landing/Chrome";
import "./landing/landing.css";
import styles from "./Blog.module.css";

/** Cadre commun du journal : même header et même footer que la landing. */
export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lp ${styles.page}`}>
      <SiteNav page="blog" />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
