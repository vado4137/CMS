import { Toaster } from "@/components/ui/sonner" // Import aus dem neuen UI-Ordner

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning verhindert, dass Extensions wie Dark Reader 
    // den Hydration-Error im Dev-Modus auslösen.
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}