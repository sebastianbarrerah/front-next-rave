"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Search, Edit, Copy, Plus, FileEdit, FilePlus2, FileCheck, FileX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Documentos de ejemplo
const documentosEjemplo = [
  { id: 1, nombre: "Factura Estándar", tipo: "Factura", formato: "PDF", fechaCreacion: "10/04/2024", estado: "Activo" },
  {
    id: 2,
    nombre: "Cotización Detallada",
    tipo: "Cotización",
    formato: "DOCX",
    fechaCreacion: "12/04/2024",
    estado: "Activo",
  },
  { id: 3, nombre: "Nota de Crédito", tipo: "Nota", formato: "PDF", fechaCreacion: "15/04/2024", estado: "Activo" },
  { id: 4, nombre: "Recibo de Pago", tipo: "Recibo", formato: "PDF", fechaCreacion: "18/04/2024", estado: "Activo" },
  { id: 5, nombre: "Orden de Compra", tipo: "Orden", formato: "XLSX", fechaCreacion: "20/04/2024", estado: "Activo" },
  {
    id: 6,
    nombre: "Comprobante de Entrega",
    tipo: "Comprobante",
    formato: "PDF",
    fechaCreacion: "22/04/2024",
    estado: "Inactivo",
  },
  {
    id: 7,
    nombre: "Factura Simplificada",
    tipo: "Factura",
    formato: "PDF",
    fechaCreacion: "25/04/2024",
    estado: "Activo",
  },
  {
    id: 8,
    nombre: "Cotización Básica",
    tipo: "Cotización",
    formato: "DOCX",
    fechaCreacion: "28/04/2024",
    estado: "Inactivo",
  },
  {
    id: 9,
    nombre: "Certificado Laboral",
    tipo: "Certificado",
    formato: "PDF",
    fechaCreacion: "30/04/2024",
    estado: "Activo",
  },
]

// Plantillas de ejemplo
const plantillasEjemplo = [
  {
    id: 1,
    nombre: "Factura Comercial",
    descripcion: "Plantilla estándar para facturas comerciales",
    descargas: 245,
    categoria: "Facturas",
  },
  {
    id: 2,
    nombre: "Cotización Profesional",
    descripcion: "Formato profesional para cotizaciones",
    descargas: 187,
    categoria: "Cotizaciones",
  },
  {
    id: 3,
    nombre: "Recibo de Pago",
    descripcion: "Recibo simple para pagos en efectivo",
    descargas: 156,
    categoria: "Recibos",
  },
  { id: 4, nombre: "Nota de Crédito", descripcion: "Formato para notas de crédito", descargas: 98, categoria: "Notas" },
  {
    id: 5,
    nombre: "Orden de Compra",
    descripcion: "Plantilla para órdenes de compra",
    descargas: 132,
    categoria: "Órdenes",
  },
  {
    id: 6,
    nombre: "Comprobante de Entrega",
    descripcion: "Formato para comprobantes de entrega",
    descargas: 76,
    categoria: "Comprobantes",
  },
  {
    id: 7,
    nombre: "Certificado Laboral",
    descripcion: "Certificado de trabajo para empleados",
    descargas: 210,
    categoria: "Certificados",
  },
]

// Colaboradores de ejemplo
const colaboradoresEjemplo = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "12345678",
    cargo: "Desarrollador Senior",
    fechaIngreso: "15/01/2020",
    fechaActual: "30/04/2024",
    sueldo: 3500,
    departamento: "Tecnología",
  },
  {
    id: 2,
    nombre: "María López",
    cedula: "87654321",
    cargo: "Diseñadora UX/UI",
    fechaIngreso: "03/05/2021",
    fechaActual: "30/04/2024",
    sueldo: 3200,
    departamento: "Diseño",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    cedula: "23456789",
    cargo: "Gerente de Proyectos",
    fechaIngreso: "10/08/2019",
    fechaActual: "30/04/2024",
    sueldo: 4500,
    departamento: "Administración",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    cedula: "98765432",
    cargo: "Contadora",
    fechaIngreso: "22/03/2022",
    fechaActual: "30/04/2024",
    sueldo: 3000,
    departamento: "Finanzas",
  },
  {
    id: 5,
    nombre: "Roberto Sánchez",
    cedula: "34567890",
    cargo: "Desarrollador Frontend",
    fechaIngreso: "05/11/2021",
    fechaActual: "30/04/2024",
    sueldo: 3100,
    departamento: "Tecnología",
  },
]

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("Todos")
  const [tabActiva, setTabActiva] = useState("documentos")
  const [certificadoDialogOpen, setCertificadoDialogOpen] = useState(false)
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState(null)
  const [certificadoData, setCertificadoData] = useState({
    fechaInicio: "",
    fechaFin: "",
    sueldo: "",
  })

  // Filtrar documentos
  const documentosFiltrados = documentosEjemplo.filter(
    (doc) =>
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filtroTipo === "Todos" || doc.tipo === filtroTipo),
  )

  // Filtrar plantillas
  const plantillasFiltradas = plantillasEjemplo.filter((plantilla) =>
    plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Seleccionar colaborador para certificado
  const handleSeleccionarColaborador = (colaboradorId: string) => {
    const colaborador = colaboradoresEjemplo.find((c) => c.id.toString() === colaboradorId)
    if (colaborador) {
      setColaboradorSeleccionado(colaborador)
      setCertificadoData({
        fechaInicio: colaborador.fechaIngreso,
        fechaFin: colaborador.fechaActual,
        sueldo: colaborador.sueldo.toString(),
      })
    }
  }

  // Generar certificado
  const handleGenerarCertificado = () => {
    if (!colaboradorSeleccionado) return

    alert(`Certificado laboral generado para ${colaboradorSeleccionado.nombre}`)
    setCertificadoDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Documento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Activos</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Inactivos</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plantillas Disponibles</CardTitle>
            <FilePlus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documentos" className="space-y-4" onValueChange={setTabActiva}>
        <TabsList>
          <TabsTrigger value="documentos">Mis Documentos</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="personalizados">Documentos Personalizados</TabsTrigger>
          <TabsTrigger value="certificados">Certificados Laborales</TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Gestiona tus documentos personalizados</CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Buscar documentos..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos los tipos</SelectItem>
                      <SelectItem value="Factura">Facturas</SelectItem>
                      <SelectItem value="Cotización">Cotizaciones</SelectItem>
                      <SelectItem value="Nota">Notas</SelectItem>
                      <SelectItem value="Recibo">Recibos</SelectItem>
                      <SelectItem value="Orden">Órdenes</SelectItem>
                      <SelectItem value="Comprobante">Comprobantes</SelectItem>
                      <SelectItem value="Certificado">Certificados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosFiltrados.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.nombre}</TableCell>
                      <TableCell>{doc.tipo}</TableCell>
                      <TableCell>{doc.formato}</TableCell>
                      <TableCell>{doc.fechaCreacion}</TableCell>
                      <TableCell>
                        <Badge variant={doc.estado === "Activo" ? "default" : "secondary"}>{doc.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plantillas">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Disponibles</CardTitle>
              <CardDescription>Plantillas predefinidas que puedes personalizar</CardDescription>
              <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
                <Input
                  type="search"
                  placeholder="Buscar plantillas..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plantillasFiltradas.map((plantilla) => (
                  <Card key={plantilla.id} className="hover-scale">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plantilla.nombre}</CardTitle>
                      <Badge className="w-fit">{plantilla.categoria}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{plantilla.descripcion}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{plantilla.descargas} descargas</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button variant="outline" size="sm">
                        <FileEdit className="h-4 w-4 mr-2" />
                        Personalizar
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizados">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Personalizados</CardTitle>
              <CardDescription>Crea y personaliza documentos según tus necesidades</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">Crea tu documento personalizado</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Diseña documentos a medida para tu negocio. Añade tu logo, personaliza campos y adapta el formato a tus
                necesidades.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Documento Personalizado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificados">
          <Card>
            <CardHeader>
              <CardTitle>Certificados Laborales</CardTitle>
              <CardDescription>Genera certificados laborales para tus colaboradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Selecciona un colaborador y personaliza los datos del certificado laboral.
                  </p>
                  <Dialog open={certificadoDialogOpen} onOpenChange={setCertificadoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Generar Certificado
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Generar Certificado Laboral</DialogTitle>
                        <DialogDescription>
                          Selecciona un colaborador y personaliza la información del certificado.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="colaborador" className="text-right">
                            Colaborador
                          </Label>
                          <Select onValueChange={handleSeleccionarColaborador} className="col-span-3">
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar colaborador" />
                            </SelectTrigger>
                            <SelectContent>
                              {colaboradoresEjemplo.map((colaborador) => (
                                <SelectItem key={colaborador.id} value={colaborador.id.toString()}>
                                  {colaborador.nombre} - {colaborador.cargo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {colaboradorSeleccionado && (
                          <>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Cédula</Label>
                              <div className="col-span-3">
                                <Input value={colaboradorSeleccionado.cedula} readOnly />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Cargo</Label>
                              <div className="col-span-3">
                                <Input value={colaboradorSeleccionado.cargo} readOnly />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="fechaInicio" className="text-right">
                                Fecha Inicio
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  id="fechaInicio"
                                  value={certificadoData.fechaInicio}
                                  onChange={(e) =>
                                    setCertificadoData({ ...certificadoData, fechaInicio: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="fechaFin" className="text-right">
                                Fecha Fin
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  id="fechaFin"
                                  value={certificadoData.fechaFin}
                                  onChange={(e) => setCertificadoData({ ...certificadoData, fechaFin: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="sueldo" className="text-right">
                                Sueldo
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  id="sueldo"
                                  value={certificadoData.sueldo}
                                  onChange={(e) => setCertificadoData({ ...certificadoData, sueldo: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="border p-4 rounded-lg">
                              <h3 className="text-lg font-bold mb-4 text-center">Vista Previa del Certificado</h3>
                              <div className="space-y-4 text-sm">
                                <p className="text-center">CERTIFICADO LABORAL</p>
                                <p>
                                  Por medio de la presente, certificamos que el/la Sr./Sra.{" "}
                                  <span className="font-bold">{colaboradorSeleccionado.nombre}</span>, identificado(a)
                                  con cédula de ciudadanía No.{" "}
                                  <span className="font-bold">{colaboradorSeleccionado.cedula}</span>, labora en nuestra
                                  empresa desempeñando el cargo de{" "}
                                  <span className="font-bold">{colaboradorSeleccionado.cargo}</span>
                                  desde el <span className="font-bold">{certificadoData.fechaInicio}</span> hasta el{" "}
                                  <span className="font-bold">{certificadoData.fechaFin}</span>.
                                </p>
                                <p>
                                  El/La empleado(a) tiene un salario mensual de{" "}
                                  <span className="font-bold">${certificadoData.sueldo}</span>.
                                </p>
                                <p>
                                  Se expide la presente certificación a solicitud del interesado(a) a los{" "}
                                  {new Date().getDate()} días del mes de{" "}
                                  {new Date().toLocaleString("es-ES", { month: "long" })} de {new Date().getFullYear()}.
                                </p>
                                <p className="mt-8">Atentamente,</p>
                                <p className="mt-4">
                                  ____________________________
                                  <br />
                                  Director de Recursos Humanos
                                  <br />
                                  FacturaNext S.A.
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCertificadoDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleGenerarCertificado} disabled={!colaboradorSeleccionado}>
                          <Download className="h-4 w-4 mr-2" />
                          Generar PDF
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Fecha Ingreso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresEjemplo.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell className="font-medium">{colaborador.nombre}</TableCell>
                        <TableCell>{colaborador.cedula}</TableCell>
                        <TableCell>{colaborador.cargo}</TableCell>
                        <TableCell>{colaborador.departamento}</TableCell>
                        <TableCell>{colaborador.fechaIngreso}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setColaboradorSeleccionado(colaborador)
                              setCertificadoData({
                                fechaInicio: colaborador.fechaIngreso,
                                fechaFin: colaborador.fechaActual,
                                sueldo: colaborador.sueldo.toString(),
                              })
                              setCertificadoDialogOpen(true)
                            }}
                          >
                            <FileEdit className="h-4 w-4 mr-2" />
                            Certificado
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
