import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

function StatCard({ icon, title, value, color }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow ">
      <CardBody className="p-6">
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <Typography
          variant="small"
          className="text-gray-600 mb-2 font-medium"
        >
          {title}
        </Typography>
        <Typography
          variant="h2"
          color="blue-gray"
          className="font-bold"
        >
          {value}
        </Typography>
      </CardBody>
    </Card>
  );
}

const stats = [
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Afiliados Activos",
    value: "45,320",
    color: "bg-blue-500"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Médicos en Red",
    value: "1,240",
    color: "bg-green-500"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    title: "Citas Programadas",
    value: "8,540",
    color: "bg-red-500"
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Centros Médicos",
    value: "156",
    color: "bg-purple-500"
  }
];

export function FeatureLanding() {
  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="container mx-auto">
        {/* Header opcional - puedes comentarlo si no lo necesitas */}
        <div className="text-center mb-12">
          <Typography variant="h2" color="blue-gray" className="mb-3 font-bold">
            Números que nos respaldan
          </Typography>
          <Typography variant="lead" className="text-gray-600">
            Estamos comprometidos con tu bienestar y el de tu familia
          </Typography>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon, title, value, color }) => (
            <StatCard 
              key={title} 
              icon={icon} 
              title={title} 
              value={value}
              color={color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureLanding;