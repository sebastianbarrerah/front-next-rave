import api from "@/lib/api"

export interface Rol {
  id: number
  nombre: string
  descripcion: string
  permisos: Record<string, boolean>
  activo: boolean
  usuarios?: number
}

const RolesService = {
  async getAll(): Promise<Rol[]> {
    const response = await api.get("/roles")
    return response.data
  },

  async getById(id: number): Promise<Rol> {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  async create(rol: Omit<Rol, "id">): Promise<Rol> {
    const response = await api.post("/roles", rol)
    return response.data
  },

  async update(id: number, rol: Partial<Rol>): Promise<Rol> {
    const response = await api.patch(`/roles/${id}`, rol)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/roles/${id}`)
  },
}

export default RolesService
