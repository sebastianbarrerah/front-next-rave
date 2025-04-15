"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Package,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit,
  ArrowDown,
  ArrowUp,
  Loader2,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import ProductosService, { type Producto, type Categoria } from "@/services/productos-service"
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
import { Textarea } from "@/components/ui/textarea"

export default function InventarioPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [vistaActual, setVistaActual] = useState("tabla")
  const [ordenarPor, setOrdenarPor] = useState("nombre")
  const [ordenDireccion, setOrdenDireccion] = useState("asc")
  const [filtrosVisibles, setFiltrosVisibles] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [nuevoProducto, setNuevoProducto] = useState<Omit<Producto, "id">>({
    codigo: "",
    nombre: "",
    categoria: "",
    stock: 0,
    precio: 0,
    costo: 0,
    estado: "Disponible",
    descripcion: "",
    imagen: "/placeholder.svg?height=100&width=100",
  })

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  // Función para obtener productos
  const fetchProductos = async () => {
    setIsLoading(true)
    try {
      const data = await ProductosService.getAll()
      setProductos(data)
      setProductosFiltrados(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener categorías
  const fetchCategorias = async () => {
    try {
      const data = await ProductosService.getAllCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    }
  }

  // Filtrar productos
  const filtrarProductos = () => {
    const filtrados = productos.filter((producto) => {
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
    const ordenados = [...filtrados].sort((a, b) => {
      let valorA = a[ordenarPor]
      let valorB = b[ordenarPor]

      // Convertir a minúsculas si son strings
      if (typeof valorA === "string") valorA = valorA.toLowerCase()
      if (typeof valorB === "string") valorB = valorB.toLowerCase()

      if (valorA < valorB) return ordenDireccion === "asc" ? -1 : 1
      if (valorA > valorB) return ordenDireccion === "asc" ? 1 : -1
      return 0
    })

    setProductosFiltrados(ordenados)
  }

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    filtrarProductos()
  }, [searchTerm, filtroCategoria, filtroEstado, ordenarPor, ordenDireccion, productos])

  // Cambiar orden
  const cambiarOrden = (campo) => {
    if (ordenarPor === campo) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc")
    } else {
      setOrdenarPor(campo)
      setOrdenDireccion("asc")
    }
  }

  // Seleccionar producto para editar
  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setDialogOpen(true)
  }

  // Guardar producto
  const handleGuardarProducto = async () => {
    try {
      if (productoSeleccionado) {
        // Actualizar producto existente
        await ProductosService.update(productoSeleccionado.id, productoSeleccionado)
        toast({
          title: "Producto actualizado",
          description: `Producto ${productoSeleccionado.nombre} actualizado correctamente`,
        })

        // Actualizar la lista de productos
        fetchProductos()
      } else {
        // Crear nuevo producto
        await ProductosService.create(nuevoProducto)
        toast({
          title: "Producto guardado",
          description: `Producto ${nuevoProducto.nombre} guardado correctamente`,
        })

        // Actualizar la lista de productos
        fetchProductos()
      }

      setDialogOpen(false)
      setProductoSeleccionado(null)
      setNuevoProducto({
        codigo: "",
        nombre: "",
        categoria: "",
        stock: 0,
        precio: 0,
        costo: 0,
        estado: "Disponible",
        descripcion: "",
        imagen: "/placeholder.svg?height=100&width=100",
      })
    } catch (error) {
      console.error("Error al guardar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      })
    }
  }

  // Eliminar producto
  const handleEliminarProducto = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este producto?")) {
      try {
        await ProductosService.delete(id)
        toast({
          title: "Producto eliminado",
          description: "Producto eliminado correctamente",
        })

        // Actualizar la lista de productos
        fetchProductos()
      } catch (error) {
        console.error("Error al eliminar producto:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setProductoSeleccionado(null)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{productoSeleccionado ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
              <DialogDescription>
                {productoSeleccionado
                  ? "Actualiza los datos del producto seleccionado."
                  : "Completa los datos para registrar un nuevo producto."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={productoSeleccionado ? productoSeleccionado.codigo : nuevoProducto.codigo}
                    onChange={(e) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, codigo: e.target.value })
                        : setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={productoSeleccionado ? productoSeleccionado.nombre : nuevoProducto.nombre}
                    onChange={(e) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })
                        : setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={productoSeleccionado ? productoSeleccionado.categoria : nuevoProducto.categoria}
                    onValueChange={(value) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, categoria: value })
                        : setNuevoProducto({ ...nuevoProducto, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.nombre}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={productoSeleccionado ? productoSeleccionado.estado : nuevoProducto.estado}
                    onValueChange={(value) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, estado: value })
                        : setNuevoProducto({ ...nuevoProducto, estado: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Bajo Stock">Bajo Stock</SelectItem>
                      <SelectItem value="Agotado">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productoSeleccionado ? productoSeleccionado.stock : nuevoProducto.stock}
                    onChange={(e) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, stock: Number(e.target.value) })
                        : setNuevoProducto({ ...nuevoProducto, stock: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={productoSeleccionado ? productoSeleccionado.precio : nuevoProducto.precio}
                    onChange={(e) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, precio: Number(e.target.value) })
                        : setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo">Costo</Label>
                  <Input
                    id="costo"
                    type="number"
                    value={productoSeleccionado ? productoSeleccionado.costo : nuevoProducto.costo}
                    onChange={(e) =>
                      productoSeleccionado
                        ? setProductoSeleccionado({ ...productoSeleccionado, costo: Number(e.target.value) })
                        : setNuevoProducto({ ...nuevoProducto, costo: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={productoSeleccionado ? productoSeleccionado.descripcion : nuevoProducto.descripcion}
                  onChange={(e) =>
                    productoSeleccionado
                      ? setProductoSeleccionado({ ...productoSeleccionado, descripcion: e.target.value })
                      : setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imagen">URL de Imagen</Label>
                <Input
                  id="imagen"
                  value={productoSeleccionado ? productoSeleccionado.imagen : nuevoProducto.imagen}
                  onChange={(e) =>
                    productoSeleccionado
                      ? setProductoSeleccionado({ ...productoSeleccionado, imagen: e.target.value })
                      : setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })
                  }
                  placeholder="/placeholder.svg?height=100&width=100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarProducto}>{productoSeleccionado ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <div className="text-2xl font-bold">{categorias.length}</div>
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
                      <SelectItem value="Todos">Todos</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.nombre}>
                          {categoria.nombre}
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
                      <SelectItem value="Agotado">Agotado</SelectItem>
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
            <Button type="submit" onClick={filtrarProductos}>
              Buscar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                    {productosFiltrados.map((producto) => (
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
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => seleccionarProducto(producto)}>
                              <Edit className="h-4 w-4 mr-1" /> Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleEliminarProducto(producto.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {productosFiltrados.length === 0 && (
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
                  {productosFiltrados.map((producto) => (
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
                        <div className="flex justify-between mt-3 gap-2">
                          <Button variant="outline" size="sm" onClick={() => seleccionarProducto(producto)}>
                            <Edit className="h-3 w-3 mr-1" /> Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleEliminarProducto(producto.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No se encontraron productos con los filtros aplicados
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
