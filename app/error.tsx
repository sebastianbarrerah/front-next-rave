"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error en un servicio de análisis de errores
    console.error("Error no manejado:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Receipt className="h-6 w-6 mr-2 text-primary" />
          <span className="text-lg font-bold">RAVE</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-5">
          <h1 className="text-9xl font-bold text-primary">500</h1>
          <h2 className="text-3xl font-semibold">Error del servidor</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para
            solucionarlo.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar nuevamente
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2024 Acabados y estilos en madera. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Términos de Servicio
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
