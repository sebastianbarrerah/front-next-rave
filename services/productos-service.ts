import api from "@/lib/api"

export interface Producto {
  id: number
  codigo: string
  nombre: string
  categoriaId: number
  categoria?: string
  stock: number
  precio: number
  costo: number
  estado: string
  imagen?: string
  descripcion?: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

const ProductosService = {
  async getAll(filters = {}): Promise<Producto[]> {
    try {
      const response = await api.get("/productos", { params: filters })
      return response.data
    } catch (error) {
      console.error("Error al obtener productos:", error)
      throw error
    }
  },

  async getById(id: number): Promise<Producto> {
    try {
      const response = await api.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error)
      throw error
    }
  },

  async create(producto: Omit<Producto, "id">): Promise<Producto> {
    try {
      const response = await api.post("/productos", producto)
      return response.data
    } catch (error) {
      console.error("Error al crear producto:", error)
      throw error
    }
  },

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    try {
      const response = await api.patch(`/productos/${id}`, producto)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}`)
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error)
      throw error
    }
  },

  // Categorías
  async getAllCategorias(): Promise<Categoria[]> {
    try {
      const response = await api.get("/productos/categorias")
      return response.data
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      throw error
    }
  },

  async getCategoriaById(id: number): Promise<Categoria> {
    try {
      const response = await api.get(`/productos/categorias/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error)
      throw error
    }
  },

  async createCategoria(categoria: Omit<Categoria, "id">): Promise<Categoria> {
    try {
      const response = await api.post("/productos/categorias", categoria)
      return response.data
    } catch (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }
  },

  async updateCategoria(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await api.patch(`/productos/categorias/${id}`, categoria)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error)
      throw error
    }
  },

  async deleteCategoria(id: number): Promise<void> {
    try {
      await api.delete(`/productos/categorias/${id}`)
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error)
      throw error
    }
  },
}

export default ProductosService
