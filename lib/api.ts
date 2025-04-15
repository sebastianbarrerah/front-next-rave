import axios from "axios"

// Asegurémonos de que la URL base es correcta
const api = axios.create({
  baseURL: "https://back-rave.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 segundos de timeout
})

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Mejorar el interceptor para mostrar más información sobre los errores

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    console.log("Error en la solicitud API:", error)

    if (error.response) {
      console.log("Respuesta de error del servidor:", {
        status: error.response.status,
        data: error.response.data,
        url: originalRequest.url,
        method: originalRequest.method,
        headers: originalRequest.headers,
      })
    }

    // Si el error es por timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("La solicitud ha tardado demasiado tiempo. Por favor, intenta nuevamente."))
    }

    // Si no hay conexión a internet
    if (!navigator.onLine) {
      return Promise.reject(
        new Error("No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente."),
      )
    }

    // Si el error es 401 (Unauthorized) y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si es una solicitud de registro, no intentamos refrescar el token
      if (originalRequest.url.includes("/auth/register")) {
        return Promise.reject(
          new Error("El registro requiere autenticación. Este podría ser un problema de configuración del servidor."),
        )
      }

      originalRequest._retry = true

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await axios.post("https://back-rave.onrender.com/api/auth/refresh", {
            refreshToken,
          })

          const { token } = response.data
          localStorage.setItem("token", token)

          // Reintentar la solicitud original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        // Si estamos en el cliente, redirigir al login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }

        return Promise.reject(new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente."))
      }
    }

    // Personalizar mensajes de error según el código de estado
    if (error.response) {
      const errorData = error.response.data
      const errorMessage = errorData?.message || errorData?.error || "Ha ocurrido un error."

      switch (error.response.status) {
        case 400:
          return Promise.reject(
            new Error(errorMessage || "Datos inválidos. Por favor, verifica la información proporcionada."),
          )
        case 401:
          return Promise.reject(new Error(errorMessage || "No autorizado. Por favor, inicia sesión."))
        case 403:
          return Promise.reject(new Error(errorMessage || "No tienes permisos para realizar esta acción."))
        case 404:
          return Promise.reject(new Error(errorMessage || "El recurso solicitado no existe."))
        case 409:
          return Promise.reject(new Error(errorMessage || "Conflicto con los datos existentes."))
        case 422:
          return Promise.reject(new Error(errorMessage || "Datos de entrada inválidos."))
        case 500:
          return Promise.reject(new Error("Error en el servidor. Por favor, intenta nuevamente más tarde."))
        default:
          return Promise.reject(new Error(errorMessage || "Ha ocurrido un error. Por favor, intenta nuevamente."))
      }
    }

    return Promise.reject(error)
  },
)

export default api
