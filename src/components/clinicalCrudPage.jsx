import React, { useEffect, useMemo, useState } from "react";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";
import api from "../lib/api";

const moduleConfig = {
  medications: {
    title: "Gestion de Medicamentos",
    description: "Administra el catalogo de medicamentos disponibles para recetas.",
    endpoint: "/medications",
    createLabel: "Nuevo Medicamento",
    searchPlaceholder: "Buscar por nombre, presentacion o descripcion...",
    accent: "from-cyan-500 to-blue-500",
    avatar: "M",
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "presentation", label: "Presentacion", type: "text" },
      { name: "price", label: "Precio", type: "number", step: "0.01" },
      { name: "description", label: "Descripcion", type: "textarea" },
    ],
    stats: (items) => [
      { label: "Medicamentos", value: items.length, tone: "blue" },
      { label: "Con precio", value: items.filter((item) => Number(item.price) > 0).length, tone: "green" },
      { label: "Sin descripcion", value: items.filter((item) => !item.description).length, tone: "amber" },
    ],
    card: (item) => ({
      title: item.name,
      subtitle: item.presentation || "Sin presentacion",
      meta: [
        { label: "Precio", value: `$${Number(item.price || 0).toFixed(2)}` },
        { label: "Descripcion", value: item.description || "Sin descripcion" },
      ],
      badge: item.presentation || "Medicamento",
    }),
    matches: (item, query) =>
      [item.name, item.presentation, item.description].some((value) =>
        String(value || "").toLowerCase().includes(query)
      ),
  },
  clinicalRecords: {
    title: "Historias Clinicas",
    description: "Registra diagnosticos, tratamientos y observaciones por paciente.",
    endpoint: "/clinical-records",
    createLabel: "Nueva Historia",
    searchPlaceholder: "Buscar por paciente, medico o diagnostico...",
    accent: "from-emerald-500 to-teal-500",
    avatar: "H",
    fields: [
      { name: "patient_id", label: "Paciente", type: "select", source: "affiliates", required: true },
      { name: "doctor_id", label: "Medico", type: "select", source: "doctors" },
      { name: "appointment_id", label: "Cita relacionada", type: "select", source: "appointments" },
      { name: "date", label: "Fecha", type: "date", required: true },
      { name: "diagnosis", label: "Diagnostico", type: "textarea", required: true },
      { name: "treatment", label: "Tratamiento", type: "textarea" },
      { name: "notes", label: "Observaciones", type: "textarea" },
    ],
    stats: (items) => [
      { label: "Historias", value: items.length, tone: "blue" },
      { label: "Con medico", value: items.filter((item) => item.doctor).length, tone: "green" },
      { label: "Con recetas", value: items.filter((item) => item.prescriptions?.length > 0).length, tone: "purple" },
    ],
    card: (item) => ({
      title: item.patient?.name || "Sin paciente",
      subtitle: `Fecha: ${formatDate(item.date)}`,
      meta: [
        { label: "Medico", value: item.doctor?.name || "Sin medico" },
        { label: "Diagnostico", value: item.diagnosis || "Sin diagnostico" },
        { label: "Tratamiento", value: item.treatment || "Sin tratamiento" },
      ],
      badge: `${item.prescriptions?.length || 0} recetas`,
    }),
    matches: (item, query) =>
      [item.patient?.name, item.doctor?.name, item.diagnosis, item.treatment].some((value) =>
        String(value || "").toLowerCase().includes(query)
      ),
  },
  prescriptions: {
    title: "Recetas Medicas",
    description: "Gestiona medicamentos formulados desde las historias clinicas.",
    endpoint: "/prescriptions",
    createLabel: "Nueva Receta",
    searchPlaceholder: "Buscar por paciente, medicamento o frecuencia...",
    accent: "from-violet-500 to-blue-500",
    avatar: "R",
    fields: [
      { name: "clinical_record_id", label: "Historia clinica", type: "select", source: "clinicalRecords", required: true },
      { name: "medication_id", label: "Medicamento", type: "select", source: "medications", required: true },
      { name: "dose", label: "Dosis", type: "number", required: true },
      { name: "frequency", label: "Frecuencia", type: "text", required: true },
      { name: "duration_days", label: "Duracion en dias", type: "number", required: true },
    ],
    stats: (items) => [
      { label: "Recetas", value: items.length, tone: "blue" },
      { label: "Tratamientos largos", value: items.filter((item) => Number(item.duration_days) >= 7).length, tone: "purple" },
      { label: "Medicamentos", value: new Set(items.map((item) => item.medication_id)).size, tone: "green" },
    ],
    card: (item) => ({
      title: item.medication?.name || "Sin medicamento",
      subtitle: item.clinical_record?.patient?.name || item.clinicalRecord?.patient?.name || "Sin paciente",
      meta: [
        { label: "Dosis", value: item.dose },
        { label: "Frecuencia", value: item.frequency },
        { label: "Duracion", value: `${item.duration_days} dias` },
      ],
      badge: "Receta activa",
    }),
    matches: (item, query) =>
      [item.clinical_record?.patient?.name, item.clinicalRecord?.patient?.name, item.medication?.name, item.frequency].some((value) =>
        String(value || "").toLowerCase().includes(query)
      ),
  },
};

const statStyles = {
  blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
  green: "from-green-50 to-green-100 border-green-200 text-green-600",
  amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-600",
  purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
};

function formatDate(value) {
  if (!value) return "Sin fecha";
  return String(value).split("T")[0];
}

function optionLabel(source, item) {
  if (source === "affiliates") return `${item.name} - ${item.identification_number || "sin documento"}`;
  if (source === "doctors") return `${item.name} - ${item.email}`;
  if (source === "appointments") return `${formatDate(item.fecha_cita)} - ${item.affiliate?.name || "sin paciente"}`;
  if (source === "clinicalRecords") return `#${item.id} - ${item.patient?.name || "sin paciente"} - ${formatDate(item.date)}`;
  if (source === "medications") return `${item.name} - ${item.presentation || "sin presentacion"}`;
  return item.name || `Registro ${item.id}`;
}

function Toast({ toast }) {
  if (!toast.show) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="fixed top-5 right-5 z-[80] animate-slideIn">
      <div className={`px-6 py-4 rounded-xl shadow-2xl font-semibold ${isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
        {toast.message}
      </div>
    </div>
  );
}

export default function ClinicalCrudPage({ module = "medications" }) {
  const config = moduleConfig[module] || moduleConfig.medications;
  const [items, setItems] = useState([]);
  const [lookups, setLookups] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  useEffect(() => {
    loadData();
  }, [module]);

  const loadData = async () => {
    setLoading(true);
    try {
      const sources = new Set(config.fields.map((field) => field.source).filter(Boolean));
      const requests = [api.get(config.endpoint)];
      const sourceEndpoints = {
        affiliates: "/affiliates",
        doctors: "/users",
        appointments: "/quotas",
        clinicalRecords: "/clinical-records",
        medications: "/medications",
      };
      const sourceNames = Array.from(sources);
      sourceNames.forEach((source) => requests.push(api.get(sourceEndpoints[source])));
      const responses = await Promise.all(requests);
      setItems(responses[0].data);
      const nextLookups = {};
      sourceNames.forEach((source, index) => {
        let data = responses[index + 1].data;
        if (source === "doctors") {
          data = data.filter((user) => {
            const role = user.role?.name?.toLowerCase();
            return role === "medico" || role === "médico" || user.role?.id === 2;
          });
        }
        nextLookups[source] = data;
      });
      setLookups(nextLookups);
    } catch (error) {
      console.error("Error cargando modulo clinico:", error);
      showToast("No se pudieron cargar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return items;
    return items.filter((item) => config.matches(item, query));
  }, [items, searchTerm, config]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    config.fields.forEach((field) => {
      if (data[field.name] === "") data[field.name] = null;
      if (field.type === "number" && data[field.name] !== null) data[field.name] = Number(data[field.name]);
      if (field.type === "select" && data[field.name] !== null) data[field.name] = Number(data[field.name]);
    });

    try {
      if (editingItem) {
        await api.put(`${config.endpoint}/${editingItem.id}`, data);
        showToast("Registro actualizado correctamente.");
      } else {
        await api.post(config.endpoint, data);
        showToast("Registro creado correctamente.");
      }
      setModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch (error) {
      console.error("Error guardando:", error);
      showToast(error.response?.data?.message || "No se pudo guardar el registro.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm("Seguro que deseas eliminar este registro?")) return;
    try {
      await api.delete(`${config.endpoint}/${item.id}`);
      showToast("Registro eliminado correctamente.");
      await loadData();
    } catch (error) {
      console.error("Error eliminando:", error);
      showToast(error.response?.data?.message || "No se pudo eliminar el registro.", "error");
    }
  };

  return (
    <ThemeProvider>
      <ComplexNavbar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600 mt-1">{config.description}</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className={`flex items-center gap-2 bg-gradient-to-r ${config.accent} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all`}
            >
              <span className="text-xl leading-none">+</span>
              {config.createLabel}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {config.stats(items).map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-br ${statStyles[stat.tone]} p-6 rounded-2xl border shadow-md`}>
                <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={config.searchPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">Cargando datos...</div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay registros</h3>
              <p className="text-gray-500 mb-6">Crea el primer registro para este modulo.</p>
              <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg">
                {config.createLabel}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const card = config.card(item);
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-14 h-14 bg-gradient-to-br ${config.accent} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                          {config.avatar}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{card.title}</h3>
                          <p className="text-gray-500 text-sm">{card.subtitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                        {card.meta.map((meta) => (
                          <div key={meta.label}>
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">{meta.label}</p>
                            <p className="text-gray-900 font-semibold text-sm line-clamp-2">{meta.value || "Sin registrar"}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {card.badge}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? "Editar Registro" : config.createLabel}</h2>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 text-2xl leading-none">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {config.fields.map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea name={field.name} defaultValue={editingItem?.[field.name] || ""} required={field.required} rows="3" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  ) : field.type === "select" ? (
                    <select name={field.name} defaultValue={editingItem?.[field.name] || ""} required={field.required} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleccione una opcion</option>
                      {(lookups[field.source] || []).map((option) => (
                        <option key={option.id} value={option.id}>{optionLabel(field.source, option)}</option>
                      ))}
                    </select>
                  ) : (
                    <input type={field.type} name={field.name} step={field.step} defaultValue={editingItem?.[field.name] || ""} required={field.required} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  )}
                </div>
              ))}

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={submitting} className={`px-5 py-3 bg-gradient-to-r ${config.accent} text-white rounded-xl disabled:opacity-50`}>
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
