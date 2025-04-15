import api from "@/lib/api"

export interface DetalleFactura {
  productoId: number
  cantidad: number
  precioUnitario: number
}

export interface Factura {
  id: number
  clienteId: number
  ventaId?: number
  detalles: DetalleFactura[]
  fecha?: string
  total?: number
  subtotal?: number
  impuestos?: number
  estado: string
}

const FacturacionService = {
  async getAll(filters = {}): Promise<Factura[]> {
    try {
      const response = await api.get("/facturacion", { params: filters })
      return response.data
    } catch (error) {
      console.error("Error al obtener facturas:", error)
      throw error
    }
  },

  async getById(id: number): Promise<Factura> {
    try {
      const response = await api.get(`/facturacion/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener factura con ID ${id}:`, error)
      throw error
    }
  },

  async create(factura: Omit<Factura, "id">): Promise<Factura> {
    try {
      const response = await api.post("/facturacion", factura)
      return response.data
    } catch (error) {
      console.error("Error al crear factura:", error)
      throw error
    }
  },

  async update(id: number, factura: Partial<Factura>): Promise<Factura> {
    try {
      const response = await api.patch(`/facturacion/${id}`, factura)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar factura con ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/facturacion/${id}`)
    } catch (error) {
      console.error(`Error al eliminar factura con ID ${id}:`, error)
      throw error
    }
  },
}

export default FacturacionService
