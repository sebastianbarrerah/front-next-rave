"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import AuthService from "@/services/auth-service"
import { useToast } from "@/components/ui/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No hay sesión activa")
        }

        // Verificar que el token sea válido obteniendo el perfil
        await AuthService.getProfile()
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error de autenticación:", error)

        // Limpiar tokens
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        // Mostrar mensaje y redirigir
        toast({
          title: "Acceso denegado",
          description: "Debes iniciar sesión para acceder a esta página",
          variant: "destructive",
        })

        // Redirigir al login
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : null
}
