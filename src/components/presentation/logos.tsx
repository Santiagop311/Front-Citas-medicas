import { Typography } from "@material-tailwind/react";

// Certificaciones y aliados del sector salud
const healthPartners = [
  {
    name: "Ministerio de Salud",
    type: "certification",
    description: "Certificación oficial"
  },
  {
    name: "OMS",
    type: "partnership",
    description: "Organización Mundial de la Salud"
  },
  {
    name: "ICONTEC",
    type: "certification",
    description: "ISO 9001:2015"
  },
  {
    name: "Supersalud",
    type: "certification",
    description: "Superintendencia de Salud"
  },
  {
    name: "Cruz Roja",
    type: "partnership",
    description: "Aliado estratégico"
  },
  {
    name: "Invima",
    type: "certification",
    description: "Certificación sanitaria"
  }
];

export function LogoSectionOne() {
  return (
    <section className="py-12 px-8 lg:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto text-center">
        <Typography
          color="blue-gray"
          className="text-2xl font-bold mb-3"
        >
          Respaldados por las principales entidades de salud
        </Typography>
        <Typography
          variant="lead"
          className="text-gray-600 mb-12"
        >
          Certificaciones y alianzas que garantizan la mejor atención
        </Typography>
        
        {/* Carrusel infinito automático */}
        <div className="relative overflow-hidden">
          {/* Gradientes laterales para efecto fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Track del carrusel */}
          <div className="flex gap-8 py-4">
            {/* Primer set */}
            <div className="flex gap-8 animate-scroll-left">
              {healthPartners.concat(healthPartners).map((partner, index) => (
                <div
                  key={`set1-${index}`}
                  className="flex-shrink-0 group"
                >
                  <div className="w-48 h-32 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-6 border border-gray-100 hover:border-blue-300">
                    {/* Icono según el tipo */}
                    <div className="mb-3">
                      {partner.type === 'certification' ? (
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      ) : (
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </div>
                    <Typography className="font-bold text-gray-800 text-center mb-1">
                      {partner.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 text-center text-xs">
                      {partner.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Segundo set para continuidad */}
            <div className="flex gap-8 animate-scroll-left">
              {healthPartners.concat(healthPartners).map((partner, index) => (
                <div
                  key={`set2-${index}`}
                  className="flex-shrink-0 group"
                >
                  <div className="w-48 h-32 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-6 border border-gray-100 hover:border-blue-300">
                    {/* Icono según el tipo */}
                    <div className="mb-3">
                      {partner.type === 'certification' ? (
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      ) : (
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </div>
                    <Typography className="font-bold text-gray-800 text-center mb-1">
                      {partner.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 text-center text-xs">
                      {partner.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estadística adicional */}
        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
          <div className="text-center">
            <Typography variant="h3" className="text-blue-600 font-bold">
              100%
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Certificado
            </Typography>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="text-center">
            <Typography variant="h3" className="text-green-600 font-bold">
              24/7
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Disponibilidad
            </Typography>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="text-center">
            <Typography variant="h3" className="text-purple-600 font-bold">
              15+
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Años de experiencia
            </Typography>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 45s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default LogoSectionOne;