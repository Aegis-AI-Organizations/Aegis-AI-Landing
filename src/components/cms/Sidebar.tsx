"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth, useNav } from "@payloadcms/ui";
import {
  FileText,
  ImageIcon,
  Users,
  UserRound,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { navOpen, setNavOpen } = useNav();
  const items = [
    { href: "/admin/collections/posts", label: "Articles", Icon: FileText },
    {
      href: "/admin/media",
      label: "Médias",
      Icon: ImageIcon,
    },
    ...(user?.role === "admin"
      ? [{ href: "/admin/collections/users", label: "Équipe", Icon: Users }]
      : []),
  ];
  const close = () => setNavOpen(false);
  return (
    <>
      {navOpen && (
        <button
          className="cms-backdrop"
          aria-label="Fermer la navigation"
          onClick={close}
        />
      )}
      <aside
        className="cms-sidebar"
        data-open={navOpen}
        aria-label="Navigation du backoffice"
      >
        <div className="cms-sidebar-brand">
          <Link href="/admin/collections/posts" onClick={close}>
            <Image src="/logo.png" alt="" width={30} height={30} />
            <span>
              AEGIS <b>AI</b>
              <small>Administration</small>
            </span>
          </Link>
          <button
            className="cms-sidebar-close"
            onClick={close}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav aria-label="Gestion du contenu">
          <span className="cms-nav-label">Contenu</span>
          {items.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname.startsWith(href) ||
                (href === "/admin/media" &&
                  pathname.startsWith("/admin/collections/media"))
                  ? "page"
                  : undefined
              }
              onClick={close}
            >
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="cms-sidebar-bottom">
          <a href="/fr/blog" target="_blank" rel="noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            Voir le site
          </a>
          <Link
            href="/admin/account"
            aria-current={pathname === "/admin/account" ? "page" : undefined}
            onClick={close}
          >
            <UserRound size={17} aria-hidden="true" />
            Mon compte
          </Link>
          <Link href="/admin/logout">
            <LogOut size={17} aria-hidden="true" />
            Déconnexion
          </Link>
        </div>
      </aside>
    </>
  );
}
