"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AdminContact() {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle>Problema de configuración detectado</CardTitle>
        </div>
        <CardDescription>Se ha detectado un problema con los permisos de registro en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          El sistema está configurado para requerir autenticación al registrar nuevos usuarios, lo cual es inusual y
          probablemente no sea lo deseado. Esto significa que solo los usuarios ya autenticados pueden registrar nuevos
          usuarios.
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Posibles soluciones:</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>
              Contactar al administrador del sistema para que modifique la configuración del backend y permita el
              registro público.
            </li>
            <li>
              Verificar si existe un endpoint alternativo para el registro de usuarios que no requiera autenticación.
            </li>
            <li>
              Solicitar al administrador que cree una cuenta inicial que pueda ser utilizada para registrar nuevos
              usuarios.
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLScRDr8GjEQltg9ttmHUM95C8qR4xgG6JszN37jMh7LplFkfhg/viewform?usp=sharing",
              "_blank",
            )
          }
        >
          Contactar al soporte técnico
        </Button>
      </CardFooter>
    </Card>
  )
}
