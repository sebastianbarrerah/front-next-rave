"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Edit, Plus, Search, Shield, ShieldAlert, ShieldCheck, Trash2, UserCog } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Roles de ejemplo
const rolesEjemplo = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    usuarios: 3,
    activo: true,
    permisos: {
      dashboard: true,
      inventario: true,
      ventas: true,
      facturacion: true,
      cotizaciones: true,
      estadisticas: true,
      clientes: true,
      reportes: true,
      configuracion: true,
      documentos: true,
    },
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Acceso a ventas e inventario",
    usuarios: 8,
    activo: true,
    permisos: {
      dashboard: true,
      inventario: true,
      ventas: true,
      facturacion: false,
      cotizaciones: true,
      estadisticas: false,
      clientes: true,
      reportes: false,
      configuracion: false,
      documentos: true,
    },
  },
  {
    id: 3,
    nombre: "Contador",
    descripcion: "Acceso a facturación y reportes",
    usuarios: 2,
    activo: true,
    permisos: {
      dashboard: true,
      inventario: false,
      ventas: false,
      facturacion: true,
      cotizaciones: false,
      estadisticas: true,
      clientes: false,
      reportes: true,
      configuracion: false,
      documentos: true,
    },
  },
  {
    id: 4,
    nombre: "Almacenista",
    descripcion: "Gestión de inventario",
    usuarios: 4,
    activo: true,
    permisos: {
      dashboard: true,
      inventario: true,
      ventas: false,
      facturacion: false,
      cotizaciones: false,
      estadisticas: false,
      clientes: false,
      reportes: false,
      configuracion: false,
      documentos: false,
    },
  },
  {
    id: 5,
    nombre: "Gerente",
    descripcion: "Acceso a estadísticas y reportes",
    usuarios: 1,
    activo: true,
    permisos: {
      dashboard: true,
      inventario: true,
      ventas: true,
      facturacion: true,
      cotizaciones: true,
      estadisticas: true,
      clientes: true,
      reportes: true,
      configuracion: false,
      documentos: true,
    },
  },
  {
    id: 6,
    nombre: "Invitado",
    descripcion: "Acceso limitado de solo lectura",
    usuarios: 0,
    activo: false,
    permisos: {
      dashboard: true,
      inventario: false,
      ventas: false,
      facturacion: false,
      cotizaciones: false,
      estadisticas: false,
      clientes: false,
      reportes: false,
      configuracion: false,
      documentos: false,
    },
  },
]

// Módulos del sistema
const modulos = [
  { id: "dashboard", nombre: "Dashboard", descripcion: "Panel principal" },
  { id: "inventario", nombre: "Inventario", descripcion: "Gestión de productos" },
  { id: "ventas", nombre: "Ventas", descripcion: "Punto de venta" },
  { id: "facturacion", nombre: "Facturación", descripcion: "Facturación electrónica" },
  { id: "cotizaciones", nombre: "Cotizaciones", descripcion: "Gestión de cotizaciones" },
  { id: "estadisticas", nombre: "Estadísticas", descripcion: "Reportes y gráficos" },
  { id: "clientes", nombre: "Clientes", descripcion: "Gestión de clientes" },
  { id: "reportes", nombre: "Reportes", descripcion: "Generación de reportes" },
  { id: "configuracion", nombre: "Configuración", descripcion: "Ajustes del sistema" },
  { id: "documentos", nombre: "Documentos", descripcion: "Gestión de documentos" },
]

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rolSeleccionado, setRolSeleccionado] = useState(null)
  const [editandoRol, setEditandoRol] = useState(false)

  // Filtrar roles
  const rolesFiltrados = rolesEjemplo.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Seleccionar rol para editar
  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol)
    setEditandoRol(true)
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setRolSeleccionado(null)
    setEditandoRol(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Roles</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Rol
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rolesEjemplo.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rolesEjemplo.filter((r) => r.activo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Inactivos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rolesEjemplo.filter((r) => !r.activo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Asignados</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rolesEjemplo.reduce((sum, rol) => sum + rol.usuarios, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Lista de roles */}
        <div className={editandoRol ? "md:col-span-1" : "md:col-span-3"}>
          <Card>
            <CardHeader>
              <CardTitle>Roles del Sistema</CardTitle>
              <CardDescription>Administra los roles y permisos de usuarios</CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar roles..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Usuarios</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesFiltrados.map((rol) => (
                    <TableRow key={rol.id}>
                      <TableCell className="font-medium">{rol.nombre}</TableCell>
                      <TableCell>{rol.descripcion}</TableCell>
                      <TableCell>{rol.usuarios}</TableCell>
                      <TableCell>
                        <Badge variant={rol.activo ? "default" : "secondary"}>
                          {rol.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => seleccionarRol(rol)}>
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
        </div>

        {/* Editor de permisos */}
        {editandoRol && (
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Editar Rol: {rolSeleccionado.nombre}</CardTitle>
                    <CardDescription>{rolSeleccionado.descripcion}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Estado:</span>
                    <Switch checked={rolSeleccionado.activo} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nombre del Rol</label>
                      <Input value={rolSeleccionado.nombre} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descripción</label>
                      <Input value={rolSeleccionado.descripcion} className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Permisos del Rol</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Módulo</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-center">Acceso</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modulos.map((modulo) => (
                          <TableRow key={modulo.id}>
                            <TableCell className="font-medium">{modulo.nombre}</TableCell>
                            <TableCell>{modulo.descripcion}</TableCell>
                            <TableCell className="text-center">
                              <Checkbox checked={rolSeleccionado.permisos[modulo.id]} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={cancelarEdicion}>
                      Cancelar
                    </Button>
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
