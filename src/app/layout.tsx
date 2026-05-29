import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis AI",
  description: "Le site Aegis AI est en cours de construction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
