"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, Filter, LayoutGrid, List, Edit, ArrowDown, ArrowUp } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Productos de ejemplo
const productosEjemplo = [
  {
    id: 1,
    codigo: "PRD-1001",
    nombre: "ESPONJA CUERPO SUAVE",
    categoria: "Baño",
    stock: 120,
    precio: 120,
    costo: 80,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Esponja suave para el cuerpo, ideal para la limpieza diaria.",
  },
  {
    id: 2,
    codigo: "PRD-1002",
    nombre: "PACK JABÓN AVENA",
    categoria: "Baño",
    stock: 85,
    precio: 250,
    costo: 180,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Pack de 3 jabones de avena, suaves para la piel sensible.",
  },
  {
    id: 3,
    codigo: "PRD-1003",
    nombre: "SANDALIAS FRANJAS",
    categoria: "Calzado",
    stock: 25,
    precio: 890,
    costo: 650,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Sandalias con diseño de franjas, disponibles en varios colores.",
  },
  {
    id: 4,
    codigo: "PRD-1004",
    nombre: "COSMETIQUERA FRANJAS",
    categoria: "Accesorios",
    stock: 40,
    precio: 350,
    costo: 220,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Cosmetiquera con diseño de franjas, espaciosa y resistente.",
  },
  {
    id: 5,
    codigo: "PRD-1005",
    nombre: "MONEDERO TEAL",
    categoria: "Accesorios",
    stock: 15,
    precio: 180,
    costo: 120,
    estado: "Bajo Stock",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Monedero pequeño color teal, con cierre y compartimentos.",
  },
  {
    id: 6,
    codigo: "PRD-1006",
    nombre: "BOLSO MIMBRE PEQUEÑO",
    categoria: "Accesorios",
    stock: 30,
    precio: 450,
    costo: 300,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Bolso pequeño de mimbre, ideal para ocasiones casuales.",
  },
  {
    id: 7,
    codigo: "PRD-1007",
    nombre: "ESTROPAJO PEQUEÑO",
    categoria: "Baño",
    stock: 8,
    precio: 75,
    costo: 45,
    estado: "Bajo Stock",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Estropajo pequeño para limpieza facial, suave y efectivo.",
  },
  {
    id: 8,
    codigo: "PRD-1008",
    nombre: "GORRA OLIVA",
    categoria: "Ropa",
    stock: 22,
    precio: 320,
    costo: 210,
    estado: "Disponible",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Gorra color oliva, ajustable y con protección UV.",
  },
  {
    id: 9,
    codigo: "PRD-1009",
    nombre: "SUÉTER CIELO",
    categoria: "Ropa",
    stock: 12,
    precio: 650,
    costo: 420,
    estado: "Bajo Stock",
    imagen: "/placeholder.svg?height=100&width=100",
    descripcion: "Suéter color cielo, tejido suave y cálido para temporada fría.",
  },
]

// Categorías de ejemplo
const categoriasEjemplo = ["Todos", "Baño", "Calzado", "Accesorios", "Ropa"]

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [vistaActual, setVistaActual] = useState("tabla")
  const [ordenarPor, setOrdenarPor] = useState("nombre")
  const [ordenDireccion, setOrdenDireccion] = useState("asc")
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)

  // Filtrar productos
  const productosFiltrados = productosEjemplo.filter((producto) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por categoría
    const matchesCategoria = filtroCategoria === "Todos" || producto.categoria === filtroCategoria

    // Filtro por estado
    const matchesEstado = filtroEstado === "Todos" || producto.estado === filtroEstado

    return matchesSearch && matchesCategoria && matchesEstado
  })

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    let valorA = a[ordenarPor]
    let valorB = b[ordenarPor]

    // Convertir a minúsculas si son strings
    if (typeof valorA === "string") valorA = valorA.toLowerCase()
    if (typeof valorB === "string") valorB = valorB.toLowerCase()

    if (valorA < valorB) return ordenDireccion === "asc" ? -1 : 1
    if (valorA > valorB) return ordenDireccion === "asc" ? 1 : -1
    return 0
  })

  // Cambiar orden
  const cambiarOrden = (campo) => {
    if (ordenarPor === campo) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc")
    } else {
      setOrdenarPor(campo)
      setOrdenDireccion("asc")
    }
  }

  // Calcular estadísticas
  const totalProductos = productosFiltrados.length
  const valorInventario = productosFiltrados.reduce((sum, producto) => sum + producto.precio * producto.stock, 0)
  const productosBajoStock = productosFiltrados.filter((p) => p.estado === "Bajo Stock").length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorInventario.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Bajo Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productosBajoStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriasEjemplo.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Gestiona tu inventario de productos</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setFiltrosVisibles(!filtrosVisibles)}>
                <Filter className="mr-2 h-4 w-4" />
                {filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}
              </Button>
              <div className="border rounded-md flex">
                <Button
                  variant={vistaActual === "tabla" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVistaActual("tabla")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={vistaActual === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVistaActual("grid")}
                  className="rounded-l-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {filtrosVisibles && (
            <div className="grid gap-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasEjemplo.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Bajo Stock">Bajo Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
            <Button type="submit">Buscar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" value={vistaActual} onValueChange={setVistaActual}>
            <TabsContent value="tabla" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => cambiarOrden("codigo")}>
                      <div className="flex items-center">
                        Código
                        {ordenarPor === "codigo" &&
                          (ordenDireccion === "asc" ? (
                            <ArrowUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => cambiarOrden("nombre")}>
                      <div className="flex items-center">
                        Nombre
                        {ordenarPor === "nombre" &&
                          (ordenDireccion === "asc" ? (
                            <ArrowUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => cambiarOrden("categoria")}>
                      <div className="flex items-center">
                        Categoría
                        {ordenarPor === "categoria" &&
                          (ordenDireccion === "asc" ? (
                            <ArrowUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => cambiarOrden("stock")}>
                      <div className="flex items-center">
                        Stock
                        {ordenarPor === "stock" &&
                          (ordenDireccion === "asc" ? (
                            <ArrowUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => cambiarOrden("precio")}>
                      <div className="flex items-center">
                        Precio
                        {ordenarPor === "precio" &&
                          (ordenDireccion === "asc" ? (
                            <ArrowUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosOrdenados.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="font-medium">{producto.codigo}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell>{producto.stock}</TableCell>
                      <TableCell>${producto.precio.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={producto.estado === "Bajo Stock" ? "secondary" : "default"}>
                          {producto.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {productosOrdenados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron productos con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productosOrdenados.map((producto) => (
                  <Card key={producto.id} className="overflow-hidden hover-scale">
                    <div className="aspect-square relative">
                      <Image
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant={producto.estado === "Bajo Stock" ? "secondary" : "default"} className="mb-2">
                        {producto.estado}
                      </Badge>
                      <h3 className="font-medium text-sm line-clamp-2">{producto.nombre}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{producto.codigo}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">${producto.precio.toFixed(2)}</span>
                        <span className="text-xs">Stock: {producto.stock}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{producto.descripcion}</p>
                      <div className="flex justify-between mt-3">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-3 w-3 mr-1" /> Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {productosOrdenados.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No se encontraron productos con los filtros aplicados
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
