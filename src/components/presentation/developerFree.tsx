import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import ThemeProvider from "../theme-provider";

const services = [
  {
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Consulta Médica General",
    description: "Acceso a médicos generales disponibles 24/7",
    bgColor: "bg-blue-100"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Especialistas",
    description: "Red de especialistas en diferentes áreas de la salud",
    bgColor: "bg-blue-100"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    title: "Urgencias",
    description: "Atención inmediata en casos de emergencia médica",
    bgColor: "bg-blue-100"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Telemedicina",
    description: "Consultas virtuales desde la comodidad de tu hogar",
    bgColor: "bg-blue-100"
  }
];

export function DevPresentation() {
 
  return (
    <ThemeProvider>
      <div className="w-screen bg-gradient-to-b from-gray-50 to-white py-20 px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Typography
              variant="h2"
              color="blue-gray"
              className="mb-4 font-bold text-4xl"
            >
              Nuestros Servicios
            </Typography>
            <Typography 
              variant="lead" 
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Una amplia variedad de opciones para cuidar tu salud
            </Typography>
          </div>

          {/* Grid de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 group"
              >
                {/* Icono */}
                <div className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Título */}
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-3 font-bold"
                >
                  {service.title}
                </Typography>

                {/* Descripción */}
                <Typography
                  variant="small"
                  className="text-gray-600 leading-relaxed"
                >
                  {service.description}
                </Typography>

                {/* Separador decorativo */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Más información
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* CTA adicional */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
              <Typography variant="h4" className="text-white mb-3 font-bold">
                ¿Necesitas atención médica ahora?
              </Typography>
              <Typography className="text-blue-100 mb-6">
                Agenda tu cita en línea o llama a nuestra línea de atención 24/7
              </Typography>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg">
                  Agendar Cita
                </button>
                <button className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition border-2 border-white">
                  Llamar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default DevPresentation;