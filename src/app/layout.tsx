import { Toaster } from "@/components/ui/sonner" // Import aus dem neuen UI-Ordner

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <main>{children}</main>
        {/* Der Toaster muss hier stehen, damit er über allen Seiten liegt */}
        <Toaster /> 
      </body>
    </html>
  )
}