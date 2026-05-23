import React, { useEffect, useMemo, useState } from "react";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";
import api from "../lib/api";

function Toast({ toast }) {
  if (!toast.show) return null;
  return (
    <div className="fixed top-5 right-5 z-[80] animate-slideIn">
      <div className={`px-6 py-4 rounded-xl shadow-2xl text-white font-semibold ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
        {toast.message}
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error cargando medicos:", error);
      showToast("No se pudieron cargar los medicos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const doctors = useMemo(() => {
    return users.filter((user) => {
      const role = user.role?.name?.toLowerCase();
      return role === "medico" || role === "médico" || user.role?.id === 2;
    });
  }, [users]);

  const filteredDoctors = doctors.filter((doctor) =>
    [doctor.name, doctor.email].some((value) => String(value || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.role_id = 2;

    try {
      await api.post("/users", data);
      showToast("Medico creado correctamente.");
      setModalOpen(false);
      event.target.reset();
      await loadDoctors();
    } catch (error) {
      console.error("Error creando medico:", error);
      showToast(error.response?.data?.message || "No se pudo crear el medico.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider>
      <ComplexNavbar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestion de Medicos</h1>
              <p className="text-gray-600 mt-1">Consulta y registra profesionales medicos del sistema</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all">
              Nuevo Medico
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-md">
              <p className="text-sm text-gray-600 mb-1 font-medium">Medicos</p>
              <p className="text-4xl font-bold text-blue-600">{doctors.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-md">
              <p className="text-sm text-gray-600 mb-1 font-medium">Activos</p>
              <p className="text-4xl font-bold text-green-600">{doctors.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-md">
              <p className="text-sm text-gray-600 mb-1 font-medium">Usuarios totales</p>
              <p className="text-4xl font-bold text-purple-600">{users.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar medico por nombre o correo..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">Cargando medicos...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay medicos disponibles</h3>
              <p className="text-gray-500">Crea un usuario con rol medico para empezar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {doctor.name?.split(" ").map((word) => word[0]).join("").substring(0, 2).toUpperCase() || "M"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-500 text-sm">{doctor.email}</p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">Medico</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Nuevo Medico</h2>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 text-2xl leading-none">x</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input name="name" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contrasena</label>
                <input type="password" name="password" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={submitting} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50">
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </ThemeProvider>
  );
}
