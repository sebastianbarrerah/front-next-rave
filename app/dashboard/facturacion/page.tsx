"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Filter, Plus, Receipt, Search, Loader2 } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { format, subDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import FacturacionService, { type Factura } from "@/services/facturacion-service"
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

export default function FacturacionPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [facturasFiltradas, setFacturasFiltradas] = useState<Factura[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nuevaFactura, setNuevaFactura] = useState({
    clienteId: 0,
    fecha: new Date().toISOString(),
    total: 0,
    subtotal: 0,
    impuestos: 0,
    estado: "Emitida",
    items: [],
  })

  // Cargar facturas y clientes al montar el componente
  useEffect(() => {
    fetchFacturas()
    fetchClientes()
  }, [])

  // Función para obtener facturas
  const fetchFacturas = async () => {
    setIsLoading(true)
    try {
      const data = await FacturacionService.getAll()
      setFacturas(data)
      setFacturasFiltradas(data)
    } catch (error) {
      console.error("Error al cargar facturas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las facturas",
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

  // Filtrar facturas
  useEffect(() => {
    const filtradas = facturas.filter((factura) => {
      // Filtro por término de búsqueda
      const cliente = clientes.find((c) => c.id === factura.clienteId)
      const clienteNombre = cliente ? cliente.nombre : `Cliente ID: ${factura.clienteId}`
      const facturaId = `F-${factura.id}`

      const matchesSearch =
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facturaId.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por estado
      const matchesEstado = filtroEstado === "Todos" || factura.estado === filtroEstado

      // Filtro por fecha
      const facturaDate = new Date(factura.fecha)
      const matchesFecha = (!date.from || facturaDate >= date.from) && (!date.to || facturaDate <= date.to)

      return matchesSearch && matchesEstado && matchesFecha
    })

    setFacturasFiltradas(filtradas)
  }, [searchTerm, filtroEstado, date, facturas, clientes])

  // Crear nueva factura
  const handleCrearFactura = async () => {
    if (!nuevaFactura.clienteId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un cliente",
        variant: "destructive",
      })
      return
    }

    try {
      await FacturacionService.create(nuevaFactura)
      toast({
        title: "Factura creada",
        description: "La factura se ha creado correctamente",
      })
      fetchFacturas()
      setDialogOpen(false)
      setNuevaFactura({
        clienteId: 0,
        fecha: new Date().toISOString(),
        total: 0,
        subtotal: 0,
        impuestos: 0,
        estado: "Emitida",
        items: [],
      })
    } catch (error) {
      console.error("Error al crear factura:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la factura",
        variant: "destructive",
      })
    }
  }

  // Calcular totales
  const totalFacturado = facturasFiltradas.reduce((sum, factura) => sum + factura.total, 0)
  const totalPendiente = facturasFiltradas
    .filter((factura) => factura.estado === "Pendiente")
    .reduce((sum, factura) => sum + factura.total, 0)
  const totalImpuestos = facturasFiltradas.reduce((sum, factura) => sum + factura.impuestos, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Facturación Electrónica</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Factura</DialogTitle>
              <DialogDescription>Crea una nueva factura para un cliente</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cliente" className="text-right">
                  Cliente
                </Label>
                <Select
                  value={nuevaFactura.clienteId ? nuevaFactura.clienteId.toString() : ""}
                  onValueChange={(value) => setNuevaFactura({ ...nuevaFactura, clienteId: Number.parseInt(value) })}
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
                <Label htmlFor="subtotal" className="text-right">
                  Subtotal
                </Label>
                <Input
                  id="subtotal"
                  type="number"
                  value={nuevaFactura.subtotal}
                  onChange={(e) => {
                    const subtotal = Number.parseFloat(e.target.value)
                    const impuestos = subtotal * 0.16
                    setNuevaFactura({
                      ...nuevaFactura,
                      subtotal,
                      impuestos,
                      total: subtotal + impuestos,
                    })
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="impuestos" className="text-right">
                  Impuestos (16%)
                </Label>
                <Input id="impuestos" type="number" value={nuevaFactura.impuestos} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                  Total
                </Label>
                <Input id="total" type="number" value={nuevaFactura.total} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado" className="text-right">
                  Estado
                </Label>
                <Select
                  value={nuevaFactura.estado}
                  onValueChange={(value) => setNuevaFactura({ ...nuevaFactura, estado: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emitida">Emitida</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Pagada">Pagada</SelectItem>
                    <SelectItem value="Anulada">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCrearFactura}>Crear Factura</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Emitidas</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturasFiltradas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturasFiltradas.filter((f) => f.estado === "Pendiente").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFacturado.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impuestos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalImpuestos.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Facturas Recientes</CardTitle>
              <CardDescription>Gestiona tus facturas electrónicas</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setFiltrosVisibles(!filtrosVisibles)}>
              <Filter className="mr-2 h-4 w-4" />
              {filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
          </div>

          {filtrosVisibles && (
            <div className="grid gap-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Rango de fechas</label>
                  <DatePickerWithRange date={date} setDate={setDate} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Emitida">Emitida</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                      <SelectItem value="Anulada">Anulada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Buscar facturas..."
                  className="w-full max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Button type="submit">Buscar</Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Mostrando facturas del {format(date.from || new Date(), "dd/MM/yyyy")} al{" "}
                {format(date.to || new Date(), "dd/MM/yyyy")}
                {filtroEstado !== "Todos" && ` • Estado: ${filtroEstado}`}
                {searchTerm && ` • Búsqueda: "${searchTerm}"`}
              </div>
            </div>
          )}

          {!filtrosVisibles && (
            <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
              <Input
                type="search"
                placeholder="Buscar facturas..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
              <Button type="submit">Buscar</Button>
            </div>
          )}
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
                {facturasFiltradas.map((factura) => {
                  const cliente = clientes.find((c) => c.id === factura.clienteId)
                  return (
                    <TableRow key={factura.id}>
                      <TableCell className="font-medium">F-{factura.id}</TableCell>
                      <TableCell>{cliente?.nombre || `Cliente ID: ${factura.clienteId}`}</TableCell>
                      <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>${factura.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={factura.estado === "Pendiente" ? "secondary" : "default"}>
                          {factura.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {facturasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron facturas con los filtros aplicados
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
