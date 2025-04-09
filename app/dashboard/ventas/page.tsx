"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowDownIcon,
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

// Productos de ejemplo
const productosEjemplo = [
  { id: 1, nombre: "ESPONJA CUERPO SUAVE", precio: 120, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 2, nombre: "PACK JABÓN AVENA", precio: 250, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 3, nombre: "SANDALIAS FRANJEAS", precio: 890, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 4, nombre: "COSMETIQUERA FRANJAS", precio: 350, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 5, nombre: "MONEDERO TEAL", precio: 180, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 6, nombre: "BOLSO MIMBRE PEQUEÑO", precio: 450, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 7, nombre: "ESTROPAJO PEQUEÑO", precio: 75, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 8, nombre: "GORRA OLIVA", precio: 320, imagen: "/placeholder.svg?height=100&width=100" },
  { id: 9, nombre: "SUÉTER CIELO", precio: 650, imagen: "/placeholder.svg?height=100&width=100" },
]

// Clientes de ejemplo
const clientesEjemplo = [
  { id: 1, nombre: "Cliente General", documento: "N/A", telefono: "N/A", email: "N/A", direccion: "N/A" },
  {
    id: 2,
    nombre: "Juan Pérez",
    documento: "12345678",
    telefono: "555-1234",
    email: "juan@ejemplo.com",
    direccion: "Calle 123",
  },
  {
    id: 3,
    nombre: "María López",
    documento: "87654321",
    telefono: "555-5678",
    email: "maria@ejemplo.com",
    direccion: "Avenida 456",
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez",
    documento: "23456789",
    telefono: "555-9012",
    email: "carlos@ejemplo.com",
    direccion: "Plaza 789",
  },
  {
    id: 5,
    nombre: "Ana Martínez",
    documento: "98765432",
    telefono: "555-3456",
    email: "ana@ejemplo.com",
    direccion: "Boulevard 012",
  },
  {
    id: 6,
    nombre: "Distribuidora XYZ",
    documento: "J-12345678-9",
    telefono: "555-7890",
    email: "contacto@xyz.com",
    direccion: "Zona Industrial",
  },
]

// Tipo para los items del carrito
type CartItem = {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

// Tipo para cliente
type Cliente = {
  id: number
  nombre: string
  documento: string
  telefono: string
  email: string
  direccion: string
}

export default function VentasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [clienteActual, setClienteActual] = useState<Cliente>(clientesEjemplo[0])
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filtrar productos por término de búsqueda
  const productosFiltrados = productosEjemplo.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Añadir producto al carrito
  const addToCart = (producto) => {
    const existingItem = cartItems.find((item) => item.id === producto.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...producto, cantidad: 1 }])
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
    const cliente = clientesEjemplo.find((c) => c.id.toString() === clienteId)
    if (cliente) {
      setClienteActual(cliente)
    }
  }

  // Guardar nuevo cliente
  const handleGuardarCliente = () => {
    // Aquí normalmente harías una llamada a la API para guardar el cliente
    // Por ahora solo simulamos que se guardó correctamente
    alert(`Cliente ${nuevoCliente.nombre} guardado correctamente`)
    setDialogOpen(false)
    // Limpiar el formulario
    setNuevoCliente({
      nombre: "",
      documento: "",
      telefono: "",
      email: "",
      direccion: "",
    })
  }

  // Completar venta
  const completarVenta = () => {
    alert(`Venta completada para ${clienteActual.nombre} por $${total.toFixed(2)}`)
    setCartItems([])
  }

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
            <div className="text-2xl font-bold">$12,234.56</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +15% desde ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +8% desde ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +12% desde ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              -3% desde ayer
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => addToCart(producto)}
                  >
                    <Image
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      width={80}
                      height={80}
                      className="object-cover mb-2"
                    />
                    <p className="text-xs font-medium text-center">{producto.nombre}</p>
                    <p className="text-sm font-bold">${producto.precio.toFixed(2)}</p>
                  </div>
                ))}
              </div>
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
                <Select defaultValue={clienteActual.id.toString()} onValueChange={handleClienteChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientesEjemplo.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {clienteActual.id !== 1 && (
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
                  disabled={cartItems.length === 0}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">T-{1000 + i}</TableCell>
                  <TableCell>{clientesEjemplo[i % clientesEjemplo.length].nombre}</TableCell>
                  <TableCell>{`${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 10) + 1}</TableCell>
                  <TableCell>${((i + 1) * 199.99).toFixed(2)}</TableCell>
                  <TableCell>Vendedor {(i % 3) + 1}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
