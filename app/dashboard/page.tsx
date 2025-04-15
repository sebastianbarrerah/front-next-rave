"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpIcon,
  BarChart3,
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ProductosService from "@/services/productos-service"
import VentasService from "@/services/ventas-service"
import ClientesService from "@/services/clientes-service"
import FacturacionService from "@/services/facturacion-service"

export default function DashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProductos: 0,
    productosVendidos: 0,
    totalVentas: 0,
    totalClientes: 0,
    productosConBajoStock: [],
    ventasPorMes: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Cargar datos de productos
      const productos = await ProductosService.getAll()

      // Cargar datos de ventas
      const ventas = await VentasService.getAll()

      // Cargar datos de clientes
      const clientes = await ClientesService.getAll()

      // Cargar datos de facturación
      const facturas = await FacturacionService.getAll()

      // Calcular estadísticas
      const totalProductos = productos.length

      // Productos vendidos (suma de cantidades en todas las ventas)
      const productosVendidos = ventas.reduce(
        (sum, venta) => sum + venta.items.reduce((itemSum, item) => itemSum + item.cantidad, 0),
        0,
      )

      // Total de ventas (suma de totales)
      const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0)

      // Total de clientes
      const totalClientes = clientes.length

      // Productos con bajo stock
      const productosConBajoStock = productos
        .filter((p) => p.estado === "Bajo Stock")
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)

      // Ventas del mes actual
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const ventasMes = ventas
        .filter((v) => new Date(v.fecha) >= inicioMes)
        .reduce((sum, venta) => sum + venta.total, 0)

      setStats({
        totalProductos,
        productosVendidos,
        totalVentas,
        totalClientes,
        productosConBajoStock,
        ventasPorMes: ventasMes,
      })
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control de facturación electrónica.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantidad de productos</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductos}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productosConBajoStock.length}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productosVendidos}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-1">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
          </TabsList>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
            <Sparkles className="mr-1 h-3 w-3" /> Actualizado el:{" "}
            <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()} </time>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover-scale">
              <CardHeader>
                <CardTitle>Ventas</CardTitle>
                <CardDescription>Ventas del mes: ${stats.ventasPorMes.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas mensuales</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 hover-scale">
              <CardHeader>
                <CardTitle>Inventario</CardTitle>
                <CardDescription>Productos con bajo stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.productosConBajoStock.length > 0 ? (
                    stats.productosConBajoStock.map((producto) => (
                      <div key={producto.id} className="flex items-center">
                        <div className="rounded-full bg-primary/10 p-1 mr-2">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-2 space-y-1">
                          <p className="text-sm font-medium leading-none">{producto.nombre}</p>
                          <p className="text-sm text-muted-foreground">Stock: {producto.stock}</p>
                        </div>
                        <div className="ml-auto font-medium text-sm text-red-500">Bajo</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No hay productos con bajo stock</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
