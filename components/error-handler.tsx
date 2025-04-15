"use client"

import type React from "react"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface ErrorHandlerProps {
  children: React.ReactNode
}

export default function ErrorHandler({ children }: ErrorHandlerProps) {
  const { toast } = useToast()

  useEffect(() => {
    // Manejador de errores no capturados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Error no manejado:", event.reason)

      toast({
        title: "Error",
        description: event.reason?.message || "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
        variant: "destructive",
      })

      // Prevenir que el error se muestre en la consola del navegador
      event.preventDefault()
    }

    // Manejador de errores de red
    const handleOffline = () => {
      toast({
        title: "Sin conexión",
        description: "No hay conexión a internet. Algunas funciones pueden no estar disponibles.",
        variant: "destructive",
      })
    }

    // Manejador de recuperación de conexión
    const handleOnline = () => {
      toast({
        title: "Conexión restaurada",
        description: "La conexión a internet ha sido restaurada.",
      })
    }

    // Registrar manejadores de eventos
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    // Limpiar manejadores al desmontar
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [toast])

  return <>{children}</>
}
