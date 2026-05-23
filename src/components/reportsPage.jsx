import React, { useEffect, useMemo, useState } from "react";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";
import api from "../lib/api";

export default function ReportsPage() {
  const [data, setData] = useState({
    users: [],
    appointments: [],
    medications: [],
    clinicalRecords: [],
    prescriptions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [users, appointments, medications, clinicalRecords, prescriptions] = await Promise.all([
        api.get("/users"),
        api.get("/quotas"),
        api.get("/medications"),
        api.get("/clinical-records"),
        api.get("/prescriptions"),
      ]);
      setData({
        users: users.data,
        appointments: appointments.data,
        medications: medications.data,
        clinicalRecords: clinicalRecords.data,
        prescriptions: prescriptions.data,
      });
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const doctors = data.users.filter((user) => {
      const role = user.role?.name?.toLowerCase();
      return role === "medico" || role === "médico" || user.role?.id === 2;
    });
    return [
      { label: "Usuarios", value: data.users.length, color: "text-blue-600", bg: "from-blue-50 to-blue-100 border-blue-200" },
      { label: "Medicos", value: doctors.length, color: "text-cyan-600", bg: "from-cyan-50 to-cyan-100 border-cyan-200" },
      { label: "Citas", value: data.appointments.length, color: "text-green-600", bg: "from-green-50 to-green-100 border-green-200" },
      { label: "Medicamentos", value: data.medications.length, color: "text-purple-600", bg: "from-purple-50 to-purple-100 border-purple-200" },
      { label: "Historias", value: data.clinicalRecords.length, color: "text-amber-600", bg: "from-amber-50 to-amber-100 border-amber-200" },
      { label: "Recetas", value: data.prescriptions.length, color: "text-red-600", bg: "from-red-50 to-red-100 border-red-200" },
    ];
  }, [data]);

  const confirmed = data.appointments.filter((appointment) => appointment.estado === 2).length;
  const pending = data.appointments.filter((appointment) => appointment.estado === 1).length;
  const canceled = data.appointments.filter((appointment) => appointment.estado === 3).length;

  return (
    <ThemeProvider>
      <ComplexNavbar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600 mt-1">Resumen operativo del sistema medico</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">Cargando reportes...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {metrics.map((metric) => (
                  <div key={metric.label} className={`bg-gradient-to-br ${metric.bg} p-6 rounded-2xl border shadow-md`}>
                    <p className="text-sm text-gray-600 mb-1 font-medium">{metric.label}</p>
                    <p className={`text-4xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Estado de citas</h2>
                  <div className="space-y-4">
                    {[
                      ["Confirmadas", confirmed, "bg-green-500"],
                      ["Pendientes", pending, "bg-amber-500"],
                      ["Canceladas", canceled, "bg-red-500"],
                    ].map(([label, value, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">{label}</span>
                          <span className="text-gray-500">{value}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`${color} h-full rounded-full`} style={{ width: `${data.appointments.length ? (value / data.appointments.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Actividad clinica</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm text-gray-500">Historias por cita</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.appointments.length ? (data.clinicalRecords.length / data.appointments.length).toFixed(1) : "0.0"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm text-gray-500">Recetas por historia</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.clinicalRecords.length ? (data.prescriptions.length / data.clinicalRecords.length).toFixed(1) : "0.0"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
