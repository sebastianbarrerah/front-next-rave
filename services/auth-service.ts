import api from "@/lib/api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    role: {
      id: number
      nombre: string
      permisos: Record<string, boolean>
    }
  }
  token: string
  refreshToken: string
}

const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials)
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
      } else if (error.response?.status === 404) {
        throw new Error("El usuario no existe. Por favor, regístrate primero.")
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (!navigator.onLine) {
        throw new Error("No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.")
      } else {
        throw new Error("Error al iniciar sesión. Por favor, intenta nuevamente más tarde.")
      }
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Asegurarnos de que los datos están en el formato correcto
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      }

      console.log("Enviando datos de registro:", payload)

      // Intentar hacer la solicitud directamente con axios para evitar interceptores
      const axios = (await import("axios")).default
      const response = await axios.post("https://back-rave.onrender.com/api/auth/register", payload, {
        headers: {
          "Content-Type": "application/json",
          // Podemos intentar con un token de invitado o algún otro encabezado que el backend pueda requerir
          // 'X-API-Key': 'clave-especial-para-registro',
        },
      })

      console.log("Respuesta del servidor:", response.data)
      return response.data
    } catch (error) {
      console.error("Error completo de registro:", error)

      // Manejar específicamente el error 401
      if (error.response?.status === 401) {
        throw new Error(
          "El registro requiere autenticación. Este podría ser un problema de configuración del servidor o permisos insuficientes.",
        )
      } else if (error.response?.status === 409) {
        throw new Error("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.")
      } else if (error.response?.status === 400) {
        // Si el servidor devuelve un mensaje específico, lo usamos
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
        }
        throw new Error("Datos de registro inválidos. Por favor, verifica la información proporcionada.")
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (!navigator.onLine) {
        throw new Error("No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.")
      } else {
        throw new Error("Error al registrar usuario. Por favor, intenta nuevamente más tarde.")
      }
    }
  },

  async getProfile(): Promise<any> {
    try {
      const response = await api.get("/auth/profile")
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada o inválida. Por favor, inicia sesión nuevamente.")
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (!navigator.onLine) {
        throw new Error("No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.")
      } else {
        throw new Error("Error al obtener perfil. Por favor, intenta nuevamente más tarde.")
      }
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await api.post("/auth/refresh", { refreshToken })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Token de actualización inválido o expirado. Por favor, inicia sesión nuevamente.")
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error("Error al actualizar la sesión. Por favor, inicia sesión nuevamente.")
      }
    }
  },

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  },
}

export default AuthService
