import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import styles from "./Blog.module.css";
export function BlogShell({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  return (
    <div className={styles.page}>
      <SiteHeader blog />
      <main id="main-content">{children}</main>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Aegis AI</span>
        <Link href={`/${language}`}>
          {language === "fr"
            ? "Retour à la plateforme"
            : "Back to the platform"}{" "}
          ↗
        </Link>
      </footer>
    </div>
  );
}
