import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>LSPD Portal Setup</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Phase 0 erfolgreich abgeschlossen. Die UI-Komponenten sind einsatzbereit.
          </p>
          <Button className="w-full">Dienst antreten</Button>
        </CardContent>
      </Card>
    </div>
  )
}