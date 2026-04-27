"use client" // WICHTIG: Muss eine Client Component sein!

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wird verarbeitet...
        </>
      ) : (
        "Dienst antreten"
      )}
    </Button>
  )
}