import React, { useState, useEffect } from "react";
import axios from "axios";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";

export default function QuotasPage() {
  const [allCitas, setAllCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [typesAppointments, setTypesAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ===================================
  // FUNCIONES HELPER
  // ===================================

  const getInitials = (name) => {
    if (!name) return "P";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const getEstadoTexto = (estado) => {
    const estados = {
      1: 'Pendiente',
      2: 'Confirmada',
      3: 'Cancelada'
    };
    return estados[estado] || 'Pendiente';
  };

  const getEstadoClase = (estado) => {
    const clases = {
      1: 'bg-amber-100 text-amber-700',
      2: 'bg-green-100 text-green-700',
      3: 'bg-red-100 text-red-700'
    };
    return clases[estado] || 'bg-gray-100 text-gray-700';
  };

  const mapearEstado = (estadoString) => {
    const estados = {
      'Pendiente': 1,
      'Confirmada': 2,
      'Cancelada': 3
    };
    return estados[estadoString] || 1;
  };

  // ===================================
  // CARGAR DATOS
  // ===================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const citasRes = await axios.get("http://localhost:8000/api/quotas");
      setAllCitas(citasRes.data);

      const usersRes = await axios.get("http://localhost:8000/api/users");
      const allUsers = usersRes.data;
      const medicosFiltered = allUsers.filter(u => 
        u.role?.name?.toLowerCase() === "médico" || 
        u.role?.name?.toLowerCase() === "medico" ||
        u.role?.id === 2
      );
      setMedicos(medicosFiltered);

      const affiliatesRes = await axios.get("http://localhost:8000/api/affiliates");
      setAffiliates(affiliatesRes.data);

      const typesRes = await axios.get("http://localhost:8000/api/appointments");
      setTypesAppointments(typesRes.data);

      console.log("Datos cargados:", { citasRes: citasRes.data, medicosFiltered, affiliates: affiliatesRes.data, types: typesRes.data });

    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // CREAR CITA
  // ===================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      types_appointments_id: parseInt(formData.get('types_appointments_id')),
      paciente_id: parseInt(formData.get('paciente_id')),
      medico_id: parseInt(formData.get('medico_id')),
      fecha_cita: formData.get('fecha_cita'),
      descripcion: formData.get('descripcion') || '',
      estado: mapearEstado(formData.get('estado'))
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:8000/api/quotas", data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert("✅ Cita creada correctamente");
      setModalOpen(false);
      e.target.reset();
      loadData();

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al crear la cita: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================
  // FILTRAR CITAS
  // ===================================

  const filteredCitas = allCitas.filter(cita => {
    const matchesSearch = 
      (cita.affiliate?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (cita.affiliate?.identification_number || '').includes(searchTerm);
    
    const estadoMap = {
      'Confirmada': 2,
      'Pendiente': 1,
      'Cancelada': 3
    };
    
    const matchesStatus = !statusFilter || cita.estado === estadoMap[statusFilter];

    return matchesSearch && matchesStatus;
  });

  // ===================================
  // ESTADÍSTICAS
  // ===================================

  const totalCitas = allCitas.length;
  const confirmadas = allCitas.filter(c => c.estado === 2).length;
  const pendientes = allCitas.filter(c => c.estado === 1).length;
  const percentConfirmadas = totalCitas > 0 ? Math.round((confirmadas / totalCitas) * 100) : 0;

  // ===================================
  // RENDER
  // ===================================

  return (
    <ThemeProvider>
      <ComplexNavbar />
      
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ENCABEZADO */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestión de Citas</h1>
              <p className="text-gray-600 mt-1">Administra y programa citas médicas de forma eficiente</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agendar Cita
            </button>
          </div>

          {/* TARJETAS DE ESTADÍSTICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Citas Programadas</p>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-blue-600">{totalCitas}</p>
              <p className="text-sm text-gray-500 mt-1">Esta semana</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Confirmadas</p>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-green-600">{confirmadas}</p>
              <p className="text-sm text-gray-500 mt-1">{percentConfirmadas}% del total</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Pendientes</p>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-amber-600">{pendientes}</p>
              <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Médicos Disponibles</p>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-purple-600">{medicos.length}</p>
              <p className="text-sm text-gray-500 mt-1">En el sistema</p>
            </div>

          </div>

          {/* FILTROS Y BÚSQUEDA */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              
              <div className="flex gap-3">
                <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition">
                  Próximas Citas
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
                  Todas las Citas
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
                  Historial
                </button>
              </div>

              <div className="flex-grow flex items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por paciente o cédula..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                >
                  <option value="">Todos los estados</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

            </div>
          </div>

          {/* LISTA DE CITAS */}
          {loading ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">
              Cargando citas...
            </div>
          ) : filteredCitas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay citas programadas</h3>
              <p className="text-gray-500 mb-6">Comienza agendando una nueva cita médica</p>
              <button 
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition"
              >
                Agendar Primera Cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCitas.map(cita => (
                <div key={cita.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {getInitials(cita.affiliate?.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{cita.affiliate?.name || "Sin nombre"}</h3>
                        <p className="text-gray-500 text-sm">Cédula: {cita.affiliate?.identification_number || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Tipo de cita</p>
                        <p className="text-gray-900 font-semibold">{cita.type_appointment?.name || "Consulta General"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Médico</p>
                        <p className="text-gray-900 font-semibold">{cita.medico?.name || "Sin asignar"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Fecha</p>
                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{cita.fecha_cita?.split('T')[0] || "N/A"}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Descripción</p>
                        <p className="text-gray-900 font-semibold text-sm">{cita.descripcion || "—"}</p>
                      </div>

                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getEstadoClase(cita.estado)}`}>
                        {getEstadoTexto(cita.estado)}
                      </span>

                      <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all transform hover:scale-105">
                        Ver Detalles
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* MODAL CREAR CITA */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h2>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de cita <span className="text-red-500">*</span>
                  </label>
                  <select name="types_appointments_id" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    <option value="">Seleccione el tipo</option>
                    {typesAppointments.map(type => (
                      <option key={type.id} value={type.id}>{type.nombre || type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Paciente (Afiliado) <span className="text-red-500">*</span>
                  </label>
                  <select name="paciente_id" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    <option value="">Seleccione un afiliado</option>
                    {affiliates.map(aff => (
                      <option key={aff.id} value={aff.id}>
                        {aff.nombre || aff.name} - {aff.identification_number || aff.document || ''}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Médico <span className="text-red-500">*</span>
                </label>
                <select name="medico_id" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option value="">Seleccione un médico</option>
                  {medicos.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.name} - {med.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de la cita <span className="text-red-500">*</span>
                </label>
                <input type="date" name="fecha_cita" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción / Notas
                </label>
                <textarea name="descripcion" rows="3" placeholder="Información adicional sobre la cita..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado inicial
                </label>
                <select name="estado" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? "Guardando..." : "Guardar Cita"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </ThemeProvider>
  );
}