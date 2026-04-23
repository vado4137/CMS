import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      {/* Öffentlicher Header (Optional) */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">LOS SANTOS PORTAL</div>
          <nav className="flex gap-6">
            {/* Hier könnten Links zu "Jobs", "News" etc. stehen */}
          </nav>
        </div>
      </header>

      {/* Hier wird der Inhalt der jeweiligen Seite (Landingpage oder [slug]) gerendert */}
      <main className="flex-1">
        {children}
      </main>

      {/* Öffentlicher Footer */}
      <footer className="border-t py-8 bg-slate-50">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} State of San Andreas. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}