import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ErrorHandler from "@/components/error-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Facturación Electrónica",
  description: "Sistema completo de facturación electrónica con inventario, ventas y más",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="factura-next-theme">
          <ErrorHandler>
            {children}
            <Toaster />
          </ErrorHandler>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"


import './globals.css'