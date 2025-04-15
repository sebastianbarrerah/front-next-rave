import api from "@/lib/api"

export interface Cliente {
  id: number
  nombre: string
  tipo: string
  documento: string
  email: string
  telefono: string
  direccion: string
  fechaRegistro: string
  estado: string
  compras?: number
  totalCompras?: number
}

const ClientesService = {
  async getAll(): Promise<Cliente[]> {
    const response = await api.get("/clientes")
    return response.data
  },

  async getById(id: number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  async getByDocumento(documento: string): Promise<Cliente> {
    const response = await api.get(`/clientes/documento/${documento}`)
    return response.data
  },

  async create(cliente: Omit<Cliente, "id">): Promise<Cliente> {
    const response = await api.post("/clientes", cliente)
    return response.data
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.patch(`/clientes/${id}`, cliente)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`)
  },
}

export default ClientesService
