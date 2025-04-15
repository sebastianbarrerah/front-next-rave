"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Receipt, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AuthService from "@/services/auth-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AdminContact from "@/components/admin-contact"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
    general: "",
  })
  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  })

  // Verificar si hay un parámetro de tab en la URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  // Validar formulario de login
  const validateLoginForm = () => {
    const errors = {
      email: "",
      password: "",
      general: "",
    }
    let isValid = true

    // Validar email
    if (!loginData.email) {
      errors.email = "El correo electrónico es obligatorio"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "El correo electrónico no es válido"
      isValid = false
    }

    // Validar contraseña
    if (!loginData.password) {
      errors.password = "La contraseña es obligatoria"
      isValid = false
    }

    setLoginErrors(errors)
    return isValid
  }

  // Validar formulario de registro
  const validateRegisterForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    }
    let isValid = true

    // Validar nombre
    if (!registerData.name) {
      errors.name = "El nombre es obligatorio"
      isValid = false
    } else if (registerData.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres"
      isValid = false
    }

    // Validar email
    if (!registerData.email) {
      errors.email = "El correo electrónico es obligatorio"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = "El correo electrónico no es válido"
      isValid = false
    }

    // Validar contraseña
    if (!registerData.password) {
      errors.password = "La contraseña es obligatoria"
      isValid = false
    } else if (registerData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
      isValid = false
    }

    // Validar confirmación de contraseña
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "La confirmación de contraseña es obligatoria"
      isValid = false
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
      isValid = false
    }

    setRegisterErrors(errors)
    return isValid
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validateLoginForm()) {
      return
    }

    setIsLoading(true)
    setLoginErrors({ ...loginErrors, general: "" })

    try {
      const response = await AuthService.login(loginData)

      // Guardar token y datos de usuario
      localStorage.setItem("token", response.token)
      localStorage.setItem("refreshToken", response.refreshToken)
      localStorage.setItem("user", JSON.stringify(response.user))

      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión correctamente. Bienvenido, ${response.user.name}.`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      setLoginErrors({
        ...loginErrors,
        general: error.message || "Credenciales incorrectas. Por favor, verifica tus datos.",
      })

      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Credenciales incorrectas. Por favor, verifica tus datos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validateRegisterForm()) {
      return
    }

    setIsLoading(true)
    setRegisterErrors({ ...registerErrors, general: "" })

    try {
      const { confirmPassword, ...registerPayload } = registerData

      // Mostrar los datos que se enviarán para depuración
      console.log("Enviando datos de registro:", registerPayload)

      const response = await AuthService.register(registerPayload)
      console.log("Registro exitoso:", response)

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
      })

      // Limpiar formulario y cambiar a la pestaña de login
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      // Cambiar a la pestaña de login
      setActiveTab("login")
    } catch (error) {
      console.error("Error detallado de registro:", error)

      // Mostrar mensaje de error más específico si está disponible
      const errorMessage = error.message || "Error al registrar usuario. Por favor, intenta nuevamente."

      setRegisterErrors({
        ...registerErrors,
        general: errorMessage,
      })

      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Receipt className="h-6 w-6 mr-2 text-primary" />
          <span className="text-lg font-bold">RAVE</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    {loginErrors.general && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginErrors.general}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        disabled={isLoading}
                        className={loginErrors.email ? "border-red-500" : ""}
                      />
                      {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                          disabled={isLoading}
                          className={loginErrors.password ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      <Link href="#" className="underline underline-offset-4 hover:text-primary">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>Regístrate para acceder al sistema</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegisterSubmit}>
                  <CardContent className="space-y-4">
                    {registerErrors.general && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{registerErrors.general}</AlertDescription>
                      </Alert>
                    )}

                    {/* Mostrar el componente AdminContact si el error es de autenticación */}
                    {registerErrors.general && registerErrors.general.includes("requiere autenticación") && (
                      <AdminContact />
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        placeholder="Juan Pérez"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                        disabled={isLoading}
                        className={registerErrors.name ? "border-red-500" : ""}
                      />
                      {registerErrors.name && <p className="text-sm text-red-500">{registerErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Correo Electrónico</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        disabled={isLoading}
                        className={registerErrors.email ? "border-red-500" : ""}
                      />
                      {registerErrors.email && <p className="text-sm text-red-500">{registerErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                          disabled={isLoading}
                          className={registerErrors.password ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {registerErrors.password && <p className="text-sm text-red-500">{registerErrors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        disabled={isLoading}
                        className={registerErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {registerErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{registerErrors.confirmPassword}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-4 px-4 lg:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2024 Acabados y estilos en madera. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Términos de Servicio
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
