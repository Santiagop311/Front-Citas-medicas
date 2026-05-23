import React, { useState, useEffect } from "react";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";
import api from "../lib/api";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // ===================================
  // FUNCIONES HELPER
  // ===================================

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  const getRoleBadgeColor = (roleName) => {
    const colors = {
      'admin': 'bg-red-100 text-red-700',
      'superadmin': 'bg-red-100 text-red-700',
      'médico': 'bg-blue-100 text-blue-700',
      'medico': 'bg-blue-100 text-blue-700',
      'secretario': 'bg-green-100 text-green-700',
      'cliente': 'bg-gray-100 text-gray-700',
      'usuario': 'bg-green-100 text-green-700'
    };
    const key = roleName?.toLowerCase() || '';
    return colors[key] || 'bg-gray-100 text-gray-700';
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // ===================================
  // CARGAR DATOS
  // ===================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setAllUsers(res.data);
    } catch (error: any) {
      console.error("Error cargando usuarios:", error);
      showToast("Error al cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // CREAR USUARIO
  // ===================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Si estamos editando, NO enviar el campo password
    if (editingUser && !data.password) {
      delete data.password;
    }

    try {
      if (editingUser) {
        // Editar usuario existente
        await api.put(`/users/${editingUser.id}`, data);
        showToast("Usuario actualizado correctamente");
      } else {
        // Crear nuevo usuario
        await api.post("/users", data);
        showToast("Usuario creado correctamente");
      }
      
      setModalOpen(false);
      setEditingUser(null);
      e.target.reset();
      loadUsers();
    } catch (error: any) {
      console.error("Error:", error);
      showToast(error.response?.data?.message || "No se pudo guardar el usuario", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================
  // EDITAR USUARIO
  // ===================================

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // ===================================
  // ELIMINAR USUARIO
  // ===================================

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/users/${userToDelete.id}`);
      showToast("Usuario eliminado correctamente");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      console.error("Error:", error);
      showToast(error.response?.data?.message || "No se pudo eliminar el usuario", "error");
    }
  };

  // ===================================
  // CERRAR MODAL Y LIMPIAR
  // ===================================

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  // ===================================
  // FILTRAR USUARIOS
  // ===================================

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===================================
  // ESTADÍSTICAS
  // ===================================

  const totalUsers = allUsers.length;
  const medicos = allUsers.filter(u => 
    u.role?.name?.toLowerCase() === 'médico' || 
    u.role?.name?.toLowerCase() === 'medico'
  ).length;
  const admins = allUsers.filter(u => 
    u.role?.name?.toLowerCase() === 'admin' || 
    u.role?.name?.toLowerCase() === 'superadmin'
  ).length;

  // ===================================
  // RENDER
  // ===================================

  return (
    <ThemeProvider>
      <ComplexNavbar />
      
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
              <p className="text-gray-500 mt-1">La Nueva EPS</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Crear Usuario
            </button>
          </div>

          {/* Buscador */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Médicos</p>
              <p className="text-3xl font-bold text-blue-600">{medicos}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Administradores</p>
              <p className="text-3xl font-bold text-purple-600">{admins}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
            </div>
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">
              Cargando usuarios...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 bg-white shadow-md p-6 rounded-lg">
              No hay usuarios disponibles.
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`${getAvatarColor(index)} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}>
                            {getInitials(user.name)}
                          </div>
                          <span className="text-gray-900 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.name || 'Usuario')}`}>
                          {user.role?.name || 'Usuario'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Editar usuario"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Eliminar usuario"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingUser ? "Editar Usuario" : "Crear Usuario"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Nombre</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser?.name || ""}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser?.email || ""}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Solo mostrar campo de contraseña al CREAR usuario */}
              {!editingUser && (
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Rol</label>
                <select
                  name="role_id"
                  defaultValue={editingUser?.role_id || ""}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="1">Admin</option>
                  <option value="2">Médico</option>
                  <option value="3">Secretario</option>
                  <option value="4">Cliente</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Guardando..." : (editingUser ? "Actualizar" : "Guardar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              ¿Eliminar usuario?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar a <span className="font-semibold">{userToDelete?.name}</span>? Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed top-5 right-5 z-[80] animate-slideIn">
          <div className={`px-6 py-4 rounded-xl shadow-2xl text-white font-semibold ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

    </ThemeProvider>
  );
}
