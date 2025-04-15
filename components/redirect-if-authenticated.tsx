"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import AuthService from "@/services/auth-service"

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function RedirectIfAuthenticated({ children, redirectTo = "/dashboard" }: RedirectIfAuthenticatedProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem("token")
        if (token) {
          // Verificar que el token sea válido obteniendo el perfil
          await AuthService.getProfile()
          setIsAuthenticated(true)
          router.push(redirectTo)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Si hay un error, el token no es válido
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return !isAuthenticated ? children : null
}
