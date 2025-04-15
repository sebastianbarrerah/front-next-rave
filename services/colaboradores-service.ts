import api from "@/lib/api"

export interface Colaborador {
  id: number
  nombre: string
  documento: string
  email: string
  telefono: string
  cargo: string
  direccion: string
  observaciones?: string
  fechaIngreso?: string
  fechaActual?: string
  sueldo?: number
  departamento?: string
}

const ColaboradoresService = {
  async getAll(): Promise<Colaborador[]> {
    try {
      const response = await api.get("/colaboradores")
      return response.data
    } catch (error) {
      console.error("Error al obtener colaboradores:", error)
      throw error
    }
  },

  async getById(id: number): Promise<Colaborador> {
    try {
      const response = await api.get(`/colaboradores/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener colaborador con ID ${id}:`, error)
      throw error
    }
  },

  async create(colaborador: Omit<Colaborador, "id">): Promise<Colaborador> {
    try {
      const response = await api.post("/colaboradores", colaborador)
      return response.data
    } catch (error) {
      console.error("Error al crear colaborador:", error)
      throw error
    }
  },

  async update(id: number, colaborador: Partial<Colaborador>): Promise<Colaborador> {
    try {
      const response = await api.patch(`/colaboradores/${id}`, colaborador)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar colaborador con ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/colaboradores/${id}`)
    } catch (error) {
      console.error(`Error al eliminar colaborador con ID ${id}:`, error)
      throw error
    }
  },
}

export default ColaboradoresService
