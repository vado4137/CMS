import { verifySettingsAccess } from "@/lib/dal";
import Link from "next/link";
import { Settings, Users, ShieldAlert, MapPin, Building2 } from "lucide-react";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await verifySettingsAccess(slug);

  const navItems = [
    { name: "Allgemein", href: "settings", icon: Settings },
    { name: "Ränge & Rechte", href: "settings/ranks", icon: ShieldAlert },
    { name: "Abteilungen", href: "settings/departments", icon: Building2 },
    { name: "Standorte", href: "settings/locations", icon: MapPin },
  ];

  return (
    <div className="flex flex-col space-y-6 p-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">Fraktions-Einstellungen</h1>
        <p className="text-muted-foreground">Konfiguriere die Struktur von {member.faction.name}.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/management/${slug}/${item.href}`}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-xl border p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}