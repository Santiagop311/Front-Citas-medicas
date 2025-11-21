

import React from "react";
import {
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { label: "Inicio", icon: HomeIcon, href: "/" },
  { label: "Usuarios", icon: UserGroupIcon, href: "/users" },
  { label: "Reportes", icon: ChartBarIcon, href: "/reportes" },
  { label: "Citas", icon: HeartIcon, href: "/quotas" },
  { label: "Médicos", icon: UserIcon, href: "/medicos" },
];

export default function ComplexNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({ name: "", email: "" });

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.name) {
      setUserInfo(user);
    }
  }, []);

  React.useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }, [isExpanded]);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setTimeout(() => (window.location.href = "/astro-launch-ui/login"), 500);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <IconButton
          variant="filled"
          className="bg-blue-600 hover:bg-blue-700 shadow-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </IconButton>
      </div>

      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - AHORA NO ES FIXED, SINO STICKY */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden lg:flex fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-50 flex-col shadow-2xl
          ${isExpanded ? "w-64" : "w-20"}`}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`${isExpanded ? "w-12 h-12" : "w-10 h-10"} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300`}>
              E
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
              <Typography variant="h6" className="text-white font-bold whitespace-nowrap">
                La Nueva EPS
              </Typography>
              <Typography variant="small" className="text-gray-400 whitespace-nowrap text-xs">
                Platform de Gestión
              </Typography>
            </div>
          </div>
          
          {isExpanded && (
            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition shadow-lg animate-fadeIn">
              Bienvenido
            </button>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map(({ label, icon: Icon, href }) => {
            const isActive =
              typeof window !== "undefined" && window.location.pathname === href;
            return (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title={!isExpanded ? label : ""}
              >
                <Icon className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"} transition-all flex-shrink-0`} />
                <Typography 
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
                  }`}
                >
                  {label}
                </Typography>
              </a>
            );
          })}
        </nav>

        {/* Usuario */}
        <div className="p-3 border-t border-gray-700">
          <div className={`bg-gray-800 rounded-xl p-3 border border-gray-700 transition-all ${isExpanded ? "" : "flex flex-col items-center"}`}>
            <div className={`flex items-center gap-3 mb-3 ${isExpanded ? "" : "flex-col"}`}>
              <div className={`${isExpanded ? "w-10 h-10" : "w-12 h-12"} bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all flex-shrink-0`}>
                <span className={isExpanded ? "text-sm" : "text-base"}>
                  {getInitials(userInfo.name)}
                </span>
              </div>
              
              <div className={`flex-1 min-w-0 transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"
              }`}>
                <Typography className="text-white font-semibold truncate text-sm">
                  {userInfo.name || "Usuario"}
                </Typography>
                <Typography variant="small" className="text-gray-400 truncate text-xs">
                  {userInfo.email || "email@example.com"}
                </Typography>
              </div>
            </div>

            {isExpanded && (
              <div className="mb-3 animate-fadeIn">
                <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                  Superadmin
                </span>
              </div>
            )}

            <div className={`flex gap-2 ${isExpanded ? "flex-row" : "flex-col"}`}>
              <button
                onClick={() => (window.location.href = "/profile")}
                className={`flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition ${
                  isExpanded ? "flex-1 py-2" : "p-3"
                }`}
                title={!isExpanded ? "Perfil" : ""}
              >
                <Cog6ToothIcon className="w-4 h-4" />
                {isExpanded && <span className="text-xs font-medium">Perfil</span>}
              </button>
              
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className={`flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 ${
                  isExpanded ? "flex-1 py-2" : "p-3"
                }`}
                title={!isExpanded ? "Salir" : ""}
              >
                {loadingLogout ? (
                  <span className="text-xs">...</span>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    {isExpanded && <span className="text-xs font-medium">Salir</span>}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar móvil */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 z-50 flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mismo contenido que arriba pero sin hover */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              E
            </div>
            <div>
              <Typography variant="h5" className="text-white font-bold">
                La Nueva EPS
              </Typography>
              <Typography variant="small" className="text-gray-400">
                Platform de Gestión
              </Typography>
            </div>
          </div>
          <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition shadow-lg">
            Bienvenido
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ label, icon: Icon, href }) => {
            const isActive =
              typeof window !== "undefined" && window.location.pathname === href;
            return (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <Typography className="font-medium">{label}</Typography>
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials(userInfo.name)}
              </div>
              <div className="flex-1 min-w-0">
                <Typography className="text-white font-semibold truncate text-sm">
                  {userInfo.name || "Usuario"}
                </Typography>
                <Typography variant="small" className="text-gray-400 truncate text-xs">
                  {userInfo.email || "email@example.com"}
                </Typography>
              </div>
            </div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                Superadmin
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex-1 flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg transition"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {loadingLogout ? (
                  <span className="text-xs">...</span>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Salir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}