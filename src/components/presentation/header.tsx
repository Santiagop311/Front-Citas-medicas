import React from "react";
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import ThemeProvider from "../theme-provider";
import Navbar from "../navbar";
import {
  ArrowSmallRightIcon,
} from "@heroicons/react/24/outline";

export function HeroPresentation() {
 
  return (
    <ThemeProvider>
      <Navbar />
      {/* QUITÉ lg:ml-20 para que el sidebar se superponga */}
      <header className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50 relative px-8 py-8">
        <div className="container mx-auto grid items-center lg:grid-cols-2 gap-12 pt-5">
          {/* Columna Izquierda - Contenido */}
          <div className="text-left">
            {/* Badge superior */}
            <div className="mb-8 inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <Typography
                variant="small"
                className="font-semibold text-blue-700"
              >
                Bienvenido a La Nueva EPS
              </Typography>
            </div>

            {/* Título Principal */}
            <Typography
              variant="h1"
              color="blue-gray"
              className="mb-6 leading-tight font-black text-5xl lg:text-6xl"
            >
              Tu salud es nuestra prioridad
            </Typography>

            {/* Descripción */}
            <Typography variant="lead" color="blue-gray" className="mb-8 text-lg lg:pr-12 text-gray-600">
              La Nueva EPS es tu aliado en el cuidado de la salud. Contamos con una red de más de 1,200 médicos especialistas, 156 centros médicos asociados y disponibilidad 24/7 para atender tus necesidades.
            </Typography>

            {/* Lista de características */}
            <div className="space-y-4 mb-10">
              {/* Característica 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                    Cobertura Integral
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Acceso a servicios médicos en todo el país
                  </Typography>
                </div>
              </div>

              {/* Característica 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                    Atención Personalizada
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Especialistas dedicados a tu bienestar
                  </Typography>
                </div>
              </div>

              {/* Característica 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                    Tecnología Avanzada
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Plataforma segura y fácil de usar
                  </Typography>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-wrap gap-4">
              <Button 
                color="blue" 
                size="lg"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition"
              >
                Explorar Servicios
                <ArrowSmallRightIcon className="w-5 h-5" />
              </Button>
              <Button 
                variant="outlined" 
                color="blue-gray"
                size="lg"
                className="border-2 hover:bg-gray-50 transition"
              >
                Contáctanos
              </Button>
            </div>
          </div>

          {/* Columna Derecha - Card con ilustración */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Card principal con gradiente */}
              <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-teal-400 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                {/* Icono de escudo en la esquina */}
                <div className="absolute top-6 right-6">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                {/* Contenido central */}
                <div className="flex flex-col items-center justify-center text-center h-full">
                  {/* Círculo con corazón */}
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
                    <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Texto */}
                  <Typography variant="small" className="text-white/90 mb-2">
                    Tu bienestar es
                  </Typography>
                  <Typography variant="h2" className="text-white font-bold">
                    Nuestra Misión
                  </Typography>
                </div>

                {/* Decoración - círculos de fondo */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Efecto de sombra adicional */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-300/30 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </header>
    </ThemeProvider>
  );
}

export default HeroPresentation;