"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowUpIcon,
  MinusCircle,
  PlusCircle,
  Search,
  ShoppingCart,
  Trash2,
  Receipt,
  Package,
  User,
  UserPlus,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useToast } from "@/components/ui/use-toast"
import VentasService, { type Venta, type ItemVenta } from "@/services/ventas-service"
import ProductosService, { type Producto } from "@/services/productos-service"
import ClientesService, { type Cliente } from "@/services/clientes-service"

// Tipo para los items del carrito
type CartItem = {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

export default function VentasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [clienteActual, setClienteActual] = useState<Cliente | null>(null)
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    tipo: "Persona",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    fechaRegistro: new Date().toISOString().split("T")[0],
    estado: "Activo",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingVentas, setIsLoadingVentas] = useState(true)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProductos()
    fetchClientes()
    fetchVentas()
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

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const data = await ClientesService.getAll()
      setClientes(data)

      // Establecer cliente por defecto (Cliente General)
      const clienteGeneral = data.find((c) => c.nombre === "Cliente General") || data[0]
      if (clienteGeneral) {
        setClienteActual(clienteGeneral)
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    }
  }

  // Función para obtener ventas
  const fetchVentas = async () => {
    setIsLoadingVentas(true)
    try {
      const data = await VentasService.getAll()
      setVentas(data)
    } catch (error) {
      console.error("Error al cargar ventas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      })
    } finally {
      setIsLoadingVentas(false)
    }
  }

  // Filtrar productos por término de búsqueda
  useEffect(() => {
    const filtrados = productos.filter((producto) => producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    setProductosFiltrados(filtrados)
  }, [searchTerm, productos])

  // Añadir producto al carrito
  const addToCart = (producto: Producto) => {
    const existingItem = cartItems.find((item) => item.id === producto.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setCartItems([...cartItems, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }])
    }
  }

  // Incrementar cantidad de un producto en el carrito
  const incrementQuantity = (id: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item)))
  }

  // Decrementar cantidad de un producto en el carrito
  const decrementQuantity = (id: number) => {
    setCartItems(
      cartItems
        .map((item) => (item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => !(item.id === id && item.cantidad === 1)),
    )
  }

  // Eliminar producto del carrito
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Calcular total
  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  // Cambiar cliente
  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id.toString() === clienteId)
    if (cliente) {
      setClienteActual(cliente)
    }
  }

  // Guardar nuevo cliente
  const handleGuardarCliente = async () => {
    try {
      const nuevoClienteGuardado = await ClientesService.create(nuevoCliente)
      toast({
        title: "Cliente guardado",
        description: `Cliente ${nuevoClienteGuardado.nombre} guardado correctamente`,
      })

      // Actualizar la lista de clientes y seleccionar el nuevo cliente
      await fetchClientes()
      setClienteActual(nuevoClienteGuardado)
      setDialogOpen(false)

      // Limpiar el formulario
      setNuevoCliente({
        nombre: "",
        tipo: "Persona",
        documento: "",
        telefono: "",
        email: "",
        direccion: "",
        fechaRegistro: new Date().toISOString().split("T")[0],
        estado: "Activo",
      })
    } catch (error) {
      console.error("Error al guardar cliente:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive",
      })
    }
  }

  // Completar venta
  const completarVenta = async () => {
    if (!clienteActual) {
      toast({
        title: "Error",
        description: "Debe seleccionar un cliente para la venta",
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "El carrito está vacío",
        variant: "destructive",
      })
      return
    }

    try {
      // Preparar los items de la venta
      const items: ItemVenta[] = cartItems.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
      }))

      // Crear la venta
      const nuevaVenta = {
        clienteId: clienteActual.id,
        fecha: new Date().toISOString(),
        total: total,
        items: items,
        estado: "Completada",
        vendedorId: 1, // ID del usuario actual (debería venir del contexto de autenticación)
      }

      await VentasService.create(nuevaVenta)

      toast({
        title: "Venta completada",
        description: `Venta completada para ${clienteActual.nombre} por $${total.toFixed(2)}`,
      })

      // Actualizar la lista de ventas y limpiar el carrito
      fetchVentas()
      setCartItems([])
    } catch (error) {
      console.error("Error al completar la venta:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la venta",
        variant: "destructive",
      })
    }
  }

  // Calcular estadísticas
  const ventasDelDia = ventas
    .filter((v) => new Date(v.fecha).toDateString() === new Date().toDateString())
    .reduce((sum, v) => sum + v.total, 0)

  const transaccionesDelDia = ventas.filter(
    (v) => new Date(v.fecha).toDateString() === new Date().toDateString(),
  ).length

  const productosVendidosHoy = ventas
    .filter((v) => new Date(v.fecha).toDateString() === new Date().toDateString())
    .flatMap((v) => v.items)
    .reduce((sum, item) => sum + item.cantidad, 0)

  const clientesAtendidosHoy = new Set(
    ventas.filter((v) => new Date(v.fecha).toDateString() === new Date().toDateString()).map((v) => v.clienteId),
  ).size

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Punto de Venta</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ventasDelDia.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transaccionesDelDia}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productosVendidosHoy}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtendidosHoy}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Panel de productos */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Selecciona productos para añadir a la venta</CardDescription>
              <div className="flex w-full items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productosFiltrados.map((producto) => (
                    <div
                      key={producto.id}
                      className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => addToCart(producto)}
                    >
                      <Image
                        src={producto.imagen || "/placeholder.svg?height=80&width=80"}
                        alt={producto.nombre}
                        width={80}
                        height={80}
                        className="object-cover mb-2"
                      />
                      <p className="text-xs font-medium text-center">{producto.nombre}</p>
                      <p className="text-sm font-bold">${producto.precio.toFixed(2)}</p>
                    </div>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No se encontraron productos con el término de búsqueda
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de venta */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Ticket de venta</CardTitle>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cliente">Cliente:</Label>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-2">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Nuevo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                        <DialogDescription>
                          Ingresa los datos del nuevo cliente para registrarlo en el sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nombre" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="nombre"
                            value={nuevoCliente.nombre}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="tipo" className="text-right">
                            Tipo
                          </Label>
                          <Select
                            value={nuevoCliente.tipo}
                            onValueChange={(value) => setNuevoCliente({ ...nuevoCliente, tipo: value })}
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
                            value={nuevoCliente.documento}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, documento: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="telefono" className="text-right">
                            Teléfono
                          </Label>
                          <Input
                            id="telefono"
                            value={nuevoCliente.telefono}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            value={nuevoCliente.email}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="direccion" className="text-right">
                            Dirección
                          </Label>
                          <Input
                            id="direccion"
                            value={nuevoCliente.direccion}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleGuardarCliente}>Guardar Cliente</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select
                  value={clienteActual?.id.toString()}
                  onValueChange={handleClienteChange}
                  disabled={clientes.length === 0}
                >
                  <SelectTrigger className="w-full">
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
                {clienteActual && clienteActual.documento !== "N/A" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>Documento: {clienteActual.documento}</div>
                    <div>Teléfono: {clienteActual.telefono}</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                    <p>No hay productos en el carrito</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.nombre}</p>
                          <p className="text-xs text-muted-foreground">${item.precio.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => decrementQuantity(item.id)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{item.cantidad}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t mt-auto">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">IVA (16%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setCartItems([])}>
                  Cancelar
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={completarVenta}
                  disabled={cartItems.length === 0 || !clienteActual}
                >
                  Vender
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ventas Recientes</CardTitle>
          <CardDescription>Últimas transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingVentas ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.slice(0, 5).map((venta) => {
                  const cliente = clientes.find((c) => c.id === venta.clienteId)
                  const cantidadProductos = venta.items.reduce((sum, item) => sum + item.cantidad, 0)

                  return (
                    <TableRow key={venta.id}>
                      <TableCell className="font-medium">V-{venta.id}</TableCell>
                      <TableCell>{cliente?.nombre || `Cliente ID: ${venta.clienteId}`}</TableCell>
                      <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
                      <TableCell>{cantidadProductos}</TableCell>
                      <TableCell>${venta.total.toFixed(2)}</TableCell>
                      <TableCell>{venta.estado}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {ventas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay ventas registradas
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
