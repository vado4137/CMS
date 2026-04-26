import { Toaster } from "@/components/ui/sonner" 
import { Copyright } from "@/components/shared/Copyright"; // 1. Import hinzufügen
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        
        {/* 2. Copyright Komponente einfügen */}
        <Copyright /> 
        
        <Toaster />
      </body>
    </html>
  )
}