"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Filter, Plus, Receipt, Search } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { format, subDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Facturas de ejemplo
const facturasEjemplo = [
  { id: "F-2023", cliente: "Cliente 1", fecha: "10/04/2024", total: 199.99, estado: "Emitida" },
  { id: "F-2024", cliente: "Cliente 2", fecha: "11/04/2024", total: 399.98, estado: "Emitida" },
  { id: "F-2025", cliente: "Cliente 3", fecha: "12/04/2024", total: 599.97, estado: "Emitida" },
  { id: "F-2026", cliente: "Cliente 4", fecha: "13/04/2024", total: 799.96, estado: "Pendiente" },
  { id: "F-2027", cliente: "Cliente 5", fecha: "14/04/2024", total: 999.95, estado: "Emitida" },
  { id: "F-2028", cliente: "Cliente 6", fecha: "15/04/2024", total: 1199.94, estado: "Emitida" },
  { id: "F-2029", cliente: "Cliente 7", fecha: "16/04/2024", total: 1399.93, estado: "Pendiente" },
  { id: "F-2030", cliente: "Cliente 8", fecha: "17/04/2024", total: 1599.92, estado: "Emitida" },
  { id: "F-2031", cliente: "Cliente 9", fecha: "18/04/2024", total: 1799.91, estado: "Emitida" },
  { id: "F-2032", cliente: "Cliente 10", fecha: "19/04/2024", total: 1999.9, estado: "Pendiente" },
]

export default function FacturacionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)

  // Filtrar facturas
  const facturasFiltradas = facturasEjemplo.filter((factura) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por estado
    const matchesEstado = filtroEstado === "Todos" || factura.estado === filtroEstado

    // Filtro por fecha (simulado - en un caso real se convertiría la fecha a Date)
    // Aquí asumimos que todas las facturas están dentro del rango de fechas seleccionado

    return matchesSearch && matchesEstado
  })

  // Calcular totales
  const totalFacturado = facturasFiltradas.reduce((sum, factura) => sum + factura.total, 0)
  const totalPendiente = facturasFiltradas
    .filter((factura) => factura.estado === "Pendiente")
    .reduce((sum, factura) => sum + factura.total, 0)
  const totalImpuestos = totalFacturado * 0.16

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Facturación Electrónica</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nueva Factura
        </Button>
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
                Mostrando facturas del {format(date.from, "dd/MM/yyyy")} al {format(date.to, "dd/MM/yyyy")}
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
              {facturasFiltradas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.id}</TableCell>
                  <TableCell>{factura.cliente}</TableCell>
                  <TableCell>{factura.fecha}</TableCell>
                  <TableCell>${factura.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={factura.estado === "Pendiente" ? "secondary" : "default"}>{factura.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {facturasFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron facturas con los filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
