"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ClipboardList,
  Home,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  X,
  Bell,
  Search,
  FileEdit,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Inventario",
    href: "/dashboard/inventario",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Ventas",
    href: "/dashboard/ventas",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Facturación",
    href: "/dashboard/facturacion",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Cotizaciones",
    href: "/dashboard/cotizaciones",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Documentos",
    href: "/dashboard/documentos",
    icon: <FileEdit className="h-5 w-5" />,
  },
  {
    title: "Estadísticas",
    href: "/dashboard/estadisticas",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Clientes",
    href: "/dashboard/clientes",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const pathname = usePathname()

  // Evitar problemas de hidratación con el tema
  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para manejar la búsqueda global
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      alert(`Buscando: ${searchTerm}`)
      // Aquí iría la lógica de búsqueda global
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col pr-0">
            <div className="flex items-center justify-between pr-4">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                <Receipt className="h-6 w-6 text-primary" />
                <span className="font-bold">RAVE</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2 text-lg font-medium">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-colors",
                    pathname === item.href && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Receipt className="h-6 w-6 text-primary" />
          <span className="font-bold hidden md:inline-block">RAVE</span>
        </Link>

        <form onSubmit={handleSearch} className="relative ml-4 flex-1 md:grow-0 md:w-80 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-8 md:w-80 lg:w-96 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/10 md:block">
          <div className="flex h-full flex-col gap-2">
            <nav className="grid gap-1 px-2 py-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors",
                    pathname === item.href && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium text-primary">¿Necesitas ayuda?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Nuestro equipo de soporte está disponible 24/7</p>
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLScRDr8GjEQltg9ttmHUM95C8qR4xgG6JszN37jMh7LplFkfhg/viewform?usp=sharing">
                <Button className="mt-3 w-full" size="sm">
                  Contactar Soporte
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 md:py-8 px-4 md:px-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

function User(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LogOut(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}
