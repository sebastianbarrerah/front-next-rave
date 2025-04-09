"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Users, UserCheck, Building, Edit, Trash2, Mail, Phone, FileText, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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

// Clientes de ejemplo
const clientesEjemplo = [
  {
    id: 1,
    nombre: "Juan Pérez",
    tipo: "Persona",
    documento: "12345678",
    email: "juan@ejemplo.com",
    telefono: "555-1234",
    direccion: "Calle 123, Ciudad",
    fechaRegistro: "15/01/2023",
    estado: "Activo",
    compras: 12,
    totalCompras: 2500,
  },
  {
    id: 2,
    nombre: "María López",
    tipo: "Persona",
    documento: "87654321",
    email: "maria@ejemplo.com",
    telefono: "555-5678",
    direccion: "Avenida 456, Ciudad",
    fechaRegistro: "03/03/2023",
    estado: "Activo",
    compras: 8,
    totalCompras: 1800,
  },
  {
    id: 3,
    nombre: "Distribuidora XYZ",
    tipo: "Empresa",
    documento: "J-12345678-9",
    email: "contacto@xyz.com",
    telefono: "555-9012",
    direccion: "Zona Industrial, Ciudad",
    fechaRegistro: "10/06/2023",
    estado: "Activo",
    compras: 25,
    totalCompras: 12500,
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez",
    tipo: "Persona",
    documento: "23456789",
    email: "carlos@ejemplo.com",
    telefono: "555-3456",
    direccion: "Plaza 789, Ciudad",
    fechaRegistro: "22/08/2023",
    estado: "Inactivo",
    compras: 3,
    totalCompras: 750,
  },
  {
    id: 5,
    nombre: "Empresa ABC",
    tipo: "Empresa",
    documento: "J-98765432-1",
    email: "info@abc.com",
    telefono: "555-7890",
    direccion: "Centro Comercial, Ciudad",
    fechaRegistro: "05/10/2023",
    estado: "Activo",
    compras: 18,
    totalCompras: 8900,
  },
  {
    id: 6,
    nombre: "Ana Martínez",
    tipo: "Persona",
    documento: "34567890",
    email: "ana@ejemplo.com",
    telefono: "555-2345",
    direccion: "Boulevard 012, Ciudad",
    fechaRegistro: "17/11/2023",
    estado: "Activo",
    compras: 6,
    totalCompras: 1200,
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    tipo: "Persona",
    documento: "",
    email: "",
    telefono: "",
    direccion: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)
  const [clientesFiltrados, setClientesFiltrados] = useState(clientesEjemplo)

  // Función para filtrar clientes
  const filtrarClientes = () => {
    const filtrados = clientesEjemplo.filter((cliente) => {
      // Filtro por término de búsqueda
      const matchesSearch =
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por tipo
      const matchesTipo = filtroTipo === "Todos" || cliente.tipo === filtroTipo

      // Filtro por estado
      const matchesEstado = filtroEstado === "Todos" || cliente.estado === filtroEstado

      return matchesSearch && matchesTipo && matchesEstado
    })

    setClientesFiltrados(filtrados)
  }

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    filtrarClientes()
  }, [searchTerm, filtroTipo, filtroEstado])

  // Seleccionar cliente para editar
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente)
    setDialogOpen(true)
  }

  // Guardar cliente
  const handleGuardarCliente = () => {
    if (clienteSeleccionado) {
      // Lógica para actualizar cliente existente
      alert(`Cliente ${clienteSeleccionado.nombre} actualizado correctamente`)
    } else {
      // Lógica para guardar nuevo cliente
      alert(`Cliente ${nuevoCliente.nombre} guardado correctamente`)
    }
    setDialogOpen(false)
    setClienteSeleccionado(null)
    setNuevoCliente({
      nombre: "",
      tipo: "Persona",
      documento: "",
      email: "",
      telefono: "",
      direccion: "",
    })
  }

  // Calcular estadísticas
  const totalClientes = clientesFiltrados.length
  const clientesActivos = clientesFiltrados.filter((c) => c.estado === "Activo").length
  const clientesInactivos = clientesFiltrados.filter((c) => c.estado === "Inactivo").length
  const totalCompras = clientesFiltrados.reduce((sum, cliente) => sum + cliente.totalCompras, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setClienteSeleccionado(null)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{clienteSeleccionado ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
              <DialogDescription>
                {clienteSeleccionado
                  ? "Actualiza los datos del cliente seleccionado."
                  : "Completa los datos para registrar un nuevo cliente."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={clienteSeleccionado ? clienteSeleccionado.nombre : nuevoCliente.nombre}
                  onChange={(e) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, nombre: e.target.value })
                      : setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={clienteSeleccionado ? clienteSeleccionado.tipo : nuevoCliente.tipo}
                  onValueChange={(value) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, tipo: value })
                      : setNuevoCliente({ ...nuevoCliente, tipo: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Persona">Persona</SelectItem>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="documento" className="text-right">
                  Documento
                </Label>
                <Input
                  id="documento"
                  value={clienteSeleccionado ? clienteSeleccionado.documento : nuevoCliente.documento}
                  onChange={(e) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, documento: e.target.value })
                      : setNuevoCliente({ ...nuevoCliente, documento: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={clienteSeleccionado ? clienteSeleccionado.email : nuevoCliente.email}
                  onChange={(e) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, email: e.target.value })
                      : setNuevoCliente({ ...nuevoCliente, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={clienteSeleccionado ? clienteSeleccionado.telefono : nuevoCliente.telefono}
                  onChange={(e) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, telefono: e.target.value })
                      : setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={clienteSeleccionado ? clienteSeleccionado.direccion : nuevoCliente.direccion}
                  onChange={(e) =>
                    clienteSeleccionado
                      ? setClienteSeleccionado({ ...clienteSeleccionado, direccion: e.target.value })
                      : setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarCliente}>{clienteSeleccionado ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesActivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesFiltrados.filter((c) => c.tipo === "Empresa").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompras.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos los Clientes</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Clientes</CardTitle>
                  <CardDescription>Gestiona tu base de datos de clientes</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFiltrosVisibles(!filtrosVisibles)}>
                  <Filter className="mr-2 h-4 w-4" />
                  {filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}
                </Button>
              </div>

              {filtrosVisibles && (
                <div className="grid gap-4 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de Cliente</label>
                      <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="Persona">Personas</SelectItem>
                          <SelectItem value="Empresa">Empresas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estado</label>
                      <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todos">Todos</SelectItem>
                          <SelectItem value="Activo">Activos</SelectItem>
                          <SelectItem value="Inactivo">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar clientes..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Button type="submit" onClick={filtrarClientes}>
                  Buscar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cliente.tipo === "Empresa" ? (
                            <Building className="h-3 w-3 mr-1" />
                          ) : (
                            <Users className="h-3 w-3 mr-1" />
                          )}
                          {cliente.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{cliente.documento}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {cliente.email}
                          </span>
                          <span className="text-xs flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {cliente.telefono}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{cliente.compras} compras</span>
                          <span className="text-xs text-muted-foreground">${cliente.totalCompras.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>{cliente.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => seleccionarCliente(cliente)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron clientes con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas">
          <Card>
            <CardHeader>
              <CardTitle>Personas</CardTitle>
              <CardDescription>Clientes registrados como personas físicas</CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar personas..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Button type="submit" onClick={filtrarClientes}>
                  Buscar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados
                    .filter((cliente) => cliente.tipo === "Persona")
                    .map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                        <TableCell>{cliente.documento}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {cliente.email}
                            </span>
                            <span className="text-xs flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {cliente.telefono}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{cliente.compras} compras</span>
                            <span className="text-xs text-muted-foreground">${cliente.totalCompras.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>
                            {cliente.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => seleccionarCliente(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empresas">
          <Card>
            <CardHeader>
              <CardTitle>Empresas</CardTitle>
              <CardDescription>Clientes registrados como personas jurídicas</CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar empresas..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Button type="submit" onClick={filtrarClientes}>
                  Buscar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RIF/NIT</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Compras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados
                    .filter((cliente) => cliente.tipo === "Empresa")
                    .map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                        <TableCell>{cliente.documento}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {cliente.email}
                            </span>
                            <span className="text-xs flex items-center">
                              <Phone className="h-3 w-3 mr-1" /> {cliente.telefono}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{cliente.compras} compras</span>
                            <span className="text-xs text-muted-foreground">${cliente.totalCompras.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>
                            {cliente.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => seleccionarCliente(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
