"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  DollarSign,
  Download,
  LineChart,
  PieChart,
  Users,
  Package,
  Receipt,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { format, subDays, subMonths } from "date-fns"

// Datos de ejemplo para gráficos
const ventasPorMes = [
  { mes: "Ene", ventas: 12500 },
  { mes: "Feb", ventas: 15000 },
  { mes: "Mar", ventas: 18000 },
  { mes: "Abr", ventas: 16500 },
  { mes: "May", ventas: 21000 },
  { mes: "Jun", ventas: 19500 },
  { mes: "Jul", ventas: 22000 },
  { mes: "Ago", ventas: 25000 },
  { mes: "Sep", ventas: 23500 },
  { mes: "Oct", ventas: 27000 },
  { mes: "Nov", ventas: 29500 },
  { mes: "Dic", ventas: 32000 },
]

const ventasPorCategoria = [
  { categoria: "Electrónica", ventas: 35000 },
  { categoria: "Ropa", ventas: 25000 },
  { categoria: "Hogar", ventas: 18000 },
  { categoria: "Alimentos", ventas: 15000 },
  { categoria: "Juguetes", ventas: 12000 },
]

const clientesPorMes = [
  { mes: "Ene", nuevos: 25, recurrentes: 120 },
  { mes: "Feb", nuevos: 30, recurrentes: 125 },
  { mes: "Mar", nuevos: 35, recurrentes: 130 },
  { mes: "Abr", nuevos: 40, recurrentes: 135 },
  { mes: "May", nuevos: 45, recurrentes: 140 },
  { mes: "Jun", nuevos: 50, recurrentes: 145 },
]

export default function EstadisticasPage() {
  const [periodoFiltro, setPeriodoFiltro] = useState("30dias")
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Función para aplicar filtro de periodo
  const aplicarFiltroPeriodo = (periodo) => {
    setPeriodoFiltro(periodo)
    const hoy = new Date()

    switch (periodo) {
      case "hoy":
        setDate({ from: hoy, to: hoy })
        break
      case "7dias":
        setDate({ from: subDays(hoy, 7), to: hoy })
        break
      case "30dias":
        setDate({ from: subDays(hoy, 30), to: hoy })
        break
      case "2meses":
        setDate({ from: subMonths(hoy, 2), to: hoy })
        break
      case "6meses":
        setDate({ from: subMonths(hoy, 6), to: hoy })
        break
      default:
        setDate({ from: subDays(hoy, 30), to: hoy })
    }
  }

  // Función para formatear fechas en el título
  const formatearRangoFechas = () => {
    if (!date.from || !date.to) return "Periodo actual"

    return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
  }

  // Filtrar datos según el periodo seleccionado
  // En un caso real, estos datos vendrían de una API con los filtros aplicados
  const filtrarDatos = (datos) => {
    // Simulamos que filtramos los datos según el periodo
    // En una implementación real, esto se haría con una llamada a la API
    return datos
  }

  const ventasFiltradas = filtrarDatos(ventasPorMes)
  const categoriasFiltradas = filtrarDatos(ventasPorCategoria)
  const clientesFiltrados = filtrarDatos(clientesPorMes)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Datos
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-lg font-medium">
          Periodo: <span className="text-muted-foreground">{formatearRangoFechas()}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={periodoFiltro} onValueChange={aplicarFiltroPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="7dias">Últimos 7 días</SelectItem>
              <SelectItem value="30dias">Últimos 30 días</SelectItem>
              <SelectItem value="2meses">Últimos 2 meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 meses</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          {periodoFiltro === "personalizado" && <DatePickerWithRange date={date} setDate={setDate} />}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +20.1% vs periodo anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Emitidas</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +12.3% vs periodo anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +18.7% vs periodo anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              -5.2% vs periodo anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Periodo</CardTitle>
                <CardDescription>Evolución de ventas en el tiempo</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <LineChart className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas por periodo</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por categoría de producto</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <PieChart className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas por categoría</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ventas Diarias</CardTitle>
              <CardDescription>Comparativa de ventas diarias en el periodo seleccionado</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                <BarChart3 className="h-16 w-16 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas diarias</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 10 productos por volumen de ventas</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de productos más vendidos</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Productos por Rentabilidad</CardTitle>
                <CardDescription>Top 10 productos por margen de ganancia</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de productos por rentabilidad</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución de Inventario</CardTitle>
              <CardDescription>Cambios en el inventario durante el periodo seleccionado</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                <LineChart className="h-16 w-16 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Gráfico de evolución de inventario</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Nuevos vs Recurrentes</CardTitle>
                <CardDescription>Comparativa de clientes nuevos y recurrentes</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de clientes nuevos vs recurrentes</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Volumen de Compra</CardTitle>
                <CardDescription>Top 10 clientes por volumen de compra</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de clientes por volumen de compra</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retención de Clientes</CardTitle>
              <CardDescription>Tasa de retención de clientes en el tiempo</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                <LineChart className="h-16 w-16 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Gráfico de retención de clientes</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
