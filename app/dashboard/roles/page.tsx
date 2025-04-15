"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Edit, Plus, Search, Shield, ShieldAlert, ShieldCheck, Trash2, UserCog, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import RolesService, { type Rol } from "@/services/roles-service"

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
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null)
  const [editandoRol, setEditandoRol] = useState(false)
  const [roles, setRoles] = useState<Rol[]>([])
  const [rolesFiltrados, setRolesFiltrados] = useState<Rol[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nuevoRol, setNuevoRol] = useState<Omit<Rol, "id">>({
    nombre: "",
    descripcion: "",
    permisos: modulos.reduce((acc, modulo) => ({ ...acc, [modulo.id]: false }), {}),
    activo: true,
    usuarios: 0,
  })

  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles()
  }, [])

  // Función para obtener roles
  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const data = await RolesService.getAll()
      setRoles(data)
      setRolesFiltrados(data)
    } catch (error) {
      console.error("Error al cargar roles:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar roles
  useEffect(() => {
    const filtrados = roles.filter(
      (rol) =>
        rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setRolesFiltrados(filtrados)
  }, [searchTerm, roles])

  // Seleccionar rol para editar
  const seleccionarRol = (rol: Rol) => {
    setRolSeleccionado(rol)
    setEditandoRol(true)
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setRolSeleccionado(null)
    setEditandoRol(false)
  }

  // Guardar rol
  const handleGuardarRol = async () => {
    try {
      if (rolSeleccionado) {
        // Actualizar rol existente
        await RolesService.update(rolSeleccionado.id, rolSeleccionado)
        toast({
          title: "Rol actualizado",
          description: `Rol ${rolSeleccionado.nombre} actualizado correctamente`,
        })
      } else {
        // Crear nuevo rol
        await RolesService.create(nuevoRol)
        toast({
          title: "Rol creado",
          description: `Rol ${nuevoRol.nombre} creado correctamente`,
        })
        setNuevoRol({
          nombre: "",
          descripcion: "",
          permisos: modulos.reduce((acc, modulo) => ({ ...acc, [modulo.id]: false }), {}),
          activo: true,
          usuarios: 0,
        })
      }

      // Actualizar la lista de roles
      fetchRoles()
      setEditandoRol(false)
      setRolSeleccionado(null)
    } catch (error) {
      console.error("Error al guardar rol:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el rol",
        variant: "destructive",
      })
    }
  }

  // Eliminar rol
  const handleEliminarRol = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este rol?")) {
      try {
        await RolesService.delete(id)
        toast({
          title: "Rol eliminado",
          description: "Rol eliminado correctamente",
        })

        // Actualizar la lista de roles
        fetchRoles()
      } catch (error) {
        console.error("Error al eliminar rol:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el rol",
          variant: "destructive",
        })
      }
    }
  }

  // Cambiar permiso
  const togglePermiso = (moduloId: string) => {
    if (rolSeleccionado) {
      setRolSeleccionado({
        ...rolSeleccionado,
        permisos: {
          ...rolSeleccionado.permisos,
          [moduloId]: !rolSeleccionado.permisos[moduloId],
        },
      })
    } else {
      setNuevoRol({
        ...nuevoRol,
        permisos: {
          ...nuevoRol.permisos,
          [moduloId]: !nuevoRol.permisos[moduloId],
        },
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Roles</h1>
        <Button
          onClick={() => {
            setRolSeleccionado(null)
            setEditandoRol(true)
          }}
        >
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
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.filter((r) => r.activo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Inactivos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.filter((r) => !r.activo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Asignados</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.reduce((sum, rol) => sum + (rol.usuarios || 0), 0)}</div>
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleEliminarRol(rol.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rolesFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No se encontraron roles con los filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
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
                    <CardTitle>{rolSeleccionado ? `Editar Rol: ${rolSeleccionado.nombre}` : "Nuevo Rol"}</CardTitle>
                    <CardDescription>
                      {rolSeleccionado ? rolSeleccionado.descripcion : "Crea un nuevo rol y asigna permisos"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Estado:</span>
                    <Switch
                      checked={rolSeleccionado ? rolSeleccionado.activo : nuevoRol.activo}
                      onCheckedChange={(checked) => {
                        if (rolSeleccionado) {
                          setRolSeleccionado({ ...rolSeleccionado, activo: checked })
                        } else {
                          setNuevoRol({ ...nuevoRol, activo: checked })
                        }
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nombre del Rol</label>
                      <Input
                        value={rolSeleccionado ? rolSeleccionado.nombre : nuevoRol.nombre}
                        className="mt-1"
                        onChange={(e) => {
                          if (rolSeleccionado) {
                            setRolSeleccionado({ ...rolSeleccionado, nombre: e.target.value })
                          } else {
                            setNuevoRol({ ...nuevoRol, nombre: e.target.value })
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descripción</label>
                      <Input
                        value={rolSeleccionado ? rolSeleccionado.descripcion : nuevoRol.descripcion}
                        className="mt-1"
                        onChange={(e) => {
                          if (rolSeleccionado) {
                            setRolSeleccionado({ ...rolSeleccionado, descripcion: e.target.value })
                          } else {
                            setNuevoRol({ ...nuevoRol, descripcion: e.target.value })
                          }
                        }}
                      />
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
                              <Checkbox
                                checked={
                                  rolSeleccionado
                                    ? !!rolSeleccionado.permisos[modulo.id]
                                    : !!nuevoRol.permisos[modulo.id]
                                }
                                onCheckedChange={() => togglePermiso(modulo.id)}
                              />
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
                    <Button onClick={handleGuardarRol}>
                      <Check className="mr-2 h-4 w-4" />
                      {rolSeleccionado ? "Guardar Cambios" : "Crear Rol"}
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
