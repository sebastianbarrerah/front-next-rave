import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  FileText,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pendientes</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +180.1% desde el mes pasado
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
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +19% desde el mes pasado
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
            <div className="text-2xl font-bold">+573
              {/* Aqui van la cantidad de usuario */}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              -2% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-1">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analíticas</TabsTrigger> */}
            {/* <TabsTrigger value="reports">Reportes</TabsTrigger> */}
          </TabsList>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
            <Sparkles className="mr-1 h-3 w-3" /> Actualizado el: <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()} </time>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover-scale">
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Productos con mayor cantidad</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas mensuales</span>
                </div>
                {/* Aqui va el gráfico de la cantidad de productos */}
              </CardContent>
            </Card>
            <Card className="col-span-3 hover-scale">
              <CardHeader>
                <CardTitle>Inventario</CardTitle>
                <CardDescription>Productos con bajo stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-1 mr-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-2 space-y-1">
                        <p className="text-sm font-medium leading-none">Producto {i}</p>
                        <p className="text-sm text-muted-foreground">Stock: {i * 2}</p>
                      </div>
                      <div className="ml-auto font-medium text-sm text-red-500">Bajo</div>
                    </div>
                  ))}
                </div>
                {/* Aqui va el gráfico de la cantidad de productos con mas bajo stocks*/}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1 hover-scale">
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por categoría de producto</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas por categoría</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 hover-scale">
              <CardHeader>
                <CardTitle>Ventas por Cliente</CardTitle>
                <CardDescription>Top 10 clientes por volumen de compra</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                  <span className="ml-2 text-sm text-muted-foreground">Gráfico de ventas por cliente</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* <TabsContent value="reports" className="space-y-6">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
              <CardDescription>Descarga reportes detallados de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Ventas Mensuales", "Inventario", "Clientes", "Facturas", "Impuestos"].map((report) => (
                <div key={report} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="rounded-full bg-primary/10 p-1 mr-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>{report}</span>
                  </div>
                  <Button variant="outline" size="sm" className="hover-scale">
                    Descargar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
