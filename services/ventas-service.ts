import api from "@/lib/api"

export interface ItemVenta {
  productoId: number
  cantidad: number
}

export interface Venta {
  id: number
  clienteId: number
  vendedorId: number
  detalles: ItemVenta[]
  fecha?: string
  total?: number
  estado: string
}

const VentasService = {
  async getAll(filters = {}): Promise<Venta[]> {
    try {
      const response = await api.get("/ventas", { params: filters })
      return response.data
    } catch (error) {
      console.error("Error al obtener ventas:", error)
      throw error
    }
  },

  async getById(id: number): Promise<Venta> {
    try {
      const response = await api.get(`/ventas/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener venta con ID ${id}:`, error)
      throw error
    }
  },

  async create(venta: Omit<Venta, "id">): Promise<Venta> {
    try {
      const response = await api.post("/ventas", venta)
      return response.data
    } catch (error) {
      console.error("Error al crear venta:", error)
      throw error
    }
  },

  async update(id: number, venta: Partial<Venta>): Promise<Venta> {
    try {
      const response = await api.patch(`/ventas/${id}`, venta)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar venta con ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/ventas/${id}`)
    } catch (error) {
      console.error(`Error al eliminar venta con ID ${id}:`, error)
      throw error
    }
  },
}

export default VentasService
