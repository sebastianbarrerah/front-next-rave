"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList, Download, Plus, Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import CotizacionesService, { type Cotizacion } from "@/services/cotizaciones-service"
import ClientesService, { type Cliente } from "@/services/clientes-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CotizacionesPage() {
  const { toast } = useToast()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState<Cotizacion[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevaCotizacion, setNuevaCotizacion] = useState({
    clienteId: 0,
    fecha: new Date().toISOString(),
    total: 0,
    estado: "Pendiente",
    validez: "30 días",
    items: [],
  })

  // Cargar cotizaciones y clientes al montar el componente
  useEffect(() => {
    fetchCotizaciones()
    fetchClientes()
  }, [])

  // Función para obtener cotizaciones
  const fetchCotizaciones = async () => {
    setIsLoading(true)
    try {
      const data = await CotizacionesService.getAll()
      setCotizaciones(data)
      setCotizacionesFiltradas(data)
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las cotizaciones",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const data = await ClientesService.getAll()
      setClientes(data)
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    }
  }

  // Filtrar cotizaciones por término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setCotizacionesFiltradas(cotizaciones)
      return
    }

    const filtradas = cotizaciones.filter((cotizacion) => {
      const cliente = clientes.find((c) => c.id === cotizacion.clienteId)
      const clienteNombre = cliente ? cliente.nombre : `Cliente ID: ${cotizacion.clienteId}`
      const cotizacionId = `COT-${cotizacion.id}`

      return (
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacionId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setCotizacionesFiltradas(filtradas)
  }, [searchTerm, cotizaciones, clientes])

  // Crear nueva cotización
  const handleCrearCotizacion = async () => {
    if (!nuevaCotizacion.clienteId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un cliente",
        variant: "destructive",
      })
      return
    }

    try {
      await CotizacionesService.create(nuevaCotizacion)
      toast({
        title: "Cotización creada",
        description: "La cotización se ha creado correctamente",
      })
      fetchCotizaciones()
      setDialogOpen(false)
      setNuevaCotizacion({
        clienteId: 0,
        fecha: new Date().toISOString(),
        total: 0,
        estado: "Pendiente",
        validez: "30 días",
        items: [],
      })
    } catch (error) {
      console.error("Error al crear cotización:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la cotización",
        variant: "destructive",
      })
    }
  }

  // Calcular estadísticas
  const totalCotizaciones = cotizaciones.length
  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === "Pendiente").length
  const cotizacionesAprobadas = cotizaciones.filter((c) => c.estado === "Aprobada").length
  const tasaConversion = totalCotizaciones > 0 ? ((cotizacionesAprobadas / totalCotizaciones) * 100).toFixed(1) : "0.0"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Cotización</DialogTitle>
              <DialogDescription>Crea una nueva cotización para un cliente</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cliente" className="text-right">
                  Cliente
                </Label>
                <Select
                  value={nuevaCotizacion.clienteId ? nuevaCotizacion.clienteId.toString() : ""}
                  onValueChange={(value) =>
                    setNuevaCotizacion({ ...nuevaCotizacion, clienteId: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                  Total
                </Label>
                <Input
                  id="total"
                  type="number"
                  value={nuevaCotizacion.total}
                  onChange={(e) => setNuevaCotizacion({ ...nuevaCotizacion, total: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="validez" className="text-right">
                  Validez
                </Label>
                <Select
                  value={nuevaCotizacion.validez}
                  onValueChange={(value) => setNuevaCotizacion({ ...nuevaCotizacion, validez: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar validez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 días">15 días</SelectItem>
                    <SelectItem value="30 días">30 días</SelectItem>
                    <SelectItem value="60 días">60 días</SelectItem>
                    <SelectItem value="90 días">90 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado" className="text-right">
                  Estado
                </Label>
                <Select
                  value={nuevaCotizacion.estado}
                  onValueChange={(value) => setNuevaCotizacion({ ...nuevaCotizacion, estado: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCrearCotizacion}>Crear Cotización</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Totales</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCotizaciones}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cotizacionesPendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Aprobadas</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cotizacionesAprobadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasaConversion}%</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones Recientes</CardTitle>
          <CardDescription>Gestiona tus cotizaciones para clientes</CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
            <Input
              type="search"
              placeholder="Buscar cotizaciones..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
            <Button type="submit">Buscar</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizacionesFiltradas.map((cotizacion) => {
                  const cliente = clientes.find((c) => c.id === cotizacion.clienteId)
                  return (
                    <TableRow key={cotizacion.id}>
                      <TableCell className="font-medium">COT-{cotizacion.id}</TableCell>
                      <TableCell>{cliente?.nombre || `Cliente ID: ${cotizacion.clienteId}`}</TableCell>
                      <TableCell>{new Date(cotizacion.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>${cotizacion.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            cotizacion.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : cotizacion.estado === "Aprobada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cotizacion.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {cotizacionesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron cotizaciones
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
