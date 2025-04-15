import api from "@/lib/api"

export interface DetalleCotizacion {
  productoId: number
  cantidad: number
}

export interface Cotizacion {
  id: number
  clienteId: number
  vendedorId: number
  detalles: DetalleCotizacion[]
  fecha?: string
  total?: number
  estado: string
  validez?: string
}

const CotizacionesService = {
  async getAll(filters = {}): Promise<Cotizacion[]> {
    try {
      const response = await api.get("/cotizaciones", { params: filters })
      return response.data
    } catch (error) {
      console.error("Error al obtener cotizaciones:", error)
      throw error
    }
  },

  async getById(id: number): Promise<Cotizacion> {
    try {
      const response = await api.get(`/cotizaciones/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener cotización con ID ${id}:`, error)
      throw error
    }
  },

  async create(cotizacion: Omit<Cotizacion, "id">): Promise<Cotizacion> {
    try {
      const response = await api.post("/cotizaciones", cotizacion)
      return response.data
    } catch (error) {
      console.error("Error al crear cotización:", error)
      throw error
    }
  },

  async update(id: number, cotizacion: Partial<Cotizacion>): Promise<Cotizacion> {
    try {
      const response = await api.patch(`/cotizaciones/${id}`, cotizacion)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar cotización con ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/cotizaciones/${id}`)
    } catch (error) {
      console.error(`Error al eliminar cotización con ID ${id}:`, error)
      throw error
    }
  },
}

export default CotizacionesService
