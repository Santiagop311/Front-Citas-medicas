import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon,
  ClockIcon,
  HeartIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";
import api from "../lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [stats, setStats] = useState({
    affiliates: 0,
    appointments: 0,
    doctors: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(storedUser || { name: "", email: "" });
    } catch (e) {
      console.warn("No se pudo parsear user en localStorage", e);
    }

    loadStats();
  }, []);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const [affiliatesRes, quotasRes, usersRes] = await Promise.all([
        api.get("/affiliates"),
        api.get("/quotas"),
        api.get("/users"),
      ]);

      const doctors = usersRes.data.filter((item) => {
        const role = item.role?.name?.toLowerCase();
        return role === "medico" || role === "médico" || item.role?.id === 2;
      });

      setStats({
        affiliates: affiliatesRes.data.length,
        appointments: quotasRes.data.length,
        doctors: doctors.length,
      });
    } catch (error) {
      console.error("Error cargando estadisticas del perfil:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) return setMessage("Ingresa la nueva contrasena.");
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id;

    if (!userId) {
      setMessage("No se encontro el usuario autenticado.");
      setLoading(false);
      return;
    }

    try {
      await api.patch(`/users/${userId}`, { password: newPassword });
      setMessage("Contrasena actualizada correctamente.");
      setNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al actualizar la contrasena.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const statCards = [
    {
      label: "Afiliados Gestionados",
      value: stats.affiliates,
      icon: HeartIcon,
      iconClass: "bg-blue-50 text-blue-500",
    },
    {
      label: "Citas Coordinadas",
      value: stats.appointments,
      icon: ClockIcon,
      iconClass: "bg-cyan-50 text-cyan-500",
    },
    {
      label: "Medicos en Red",
      value: stats.doctors,
      icon: ShieldCheckIcon,
      iconClass: "bg-indigo-50 text-indigo-500",
    },
  ];

  return (
    <ThemeProvider>
      <ComplexNavbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                  {getInitials(user.name)}
                </div>

                <div>
                  <Typography variant="h3" className="text-white font-bold mb-1">
                    {user.name || "Usuario"}
                  </Typography>
                  <Typography className="text-purple-100 mb-1">Superadmin</Typography>
                  <Typography className="text-purple-200 text-sm">Administracion</Typography>
                </div>
              </div>

              <Button variant="filled" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg">
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map(({ label, value, icon: Icon, iconClass }) => (
              <Card key={label} className="shadow-md hover:shadow-xl transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Typography color="gray" className="font-medium">
                      {label}
                    </Typography>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <Typography variant="h2" color="blue-gray" className="font-bold">
                    {statsLoading ? "..." : value}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <Tabs value={activeTab}>
              <TabsHeader
                className="bg-transparent border-b border-gray-200"
                indicatorProps={{
                  className: "bg-blue-500 shadow-none",
                }}
              >
                <Tab value="info" onClick={() => setActiveTab("info")} className={activeTab === "info" ? "text-blue-600" : "text-gray-600"}>
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    Informacion Personal
                  </div>
                </Tab>
                <Tab value="seguridad" onClick={() => setActiveTab("seguridad")} className={activeTab === "seguridad" ? "text-blue-600" : "text-gray-600"}>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    Seguridad
                  </div>
                </Tab>
                <Tab value="historial" onClick={() => setActiveTab("historial")} className={activeTab === "historial" ? "text-blue-600" : "text-gray-600"}>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Historial
                  </div>
                </Tab>
              </TabsHeader>

              <TabsBody>
                <TabPanel value="info" className="p-8">
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
                    Informacion Personal
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="small" color="gray" className="mb-2 font-medium">
                        Nombre Completo
                      </Typography>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <UserCircleIcon className="w-5 h-5 text-gray-600" />
                        <Typography variant="paragraph" color="blue-gray" className="font-medium">
                          {user.name || "No disponible"}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="gray" className="mb-2 font-medium">
                        Correo Electronico
                      </Typography>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                        <Typography variant="paragraph" color="blue-gray" className="font-medium">
                          {user.email || "No disponible"}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="seguridad" className="p-8">
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
                    Seguridad
                  </Typography>

                  <div className="max-w-md">
                    <Typography color="gray" className="mb-6">
                      Actualiza tu contrasena para mantener tu cuenta segura
                    </Typography>

                    {message && (
                      <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
                        {message}
                      </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div>
                        <Typography variant="small" color="gray" className="mb-2 font-medium">
                          Nueva Contrasena
                        </Typography>
                        <Input
                          color="blue"
                          type="password"
                          label="Ingresa tu nueva contrasena"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          icon={<KeyIcon className="w-5 h-5" />}
                        />
                      </div>

                      <Button color="blue" type="submit" fullWidth disabled={loading} className="flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5" />
                        {loading ? "Actualizando..." : "Actualizar contrasena"}
                      </Button>
                    </form>
                  </div>
                </TabPanel>

                <TabPanel value="historial" className="p-8">
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
                    Historial de Actividad
                  </Typography>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Perfil consultado
                        </Typography>
                        <Typography variant="small" color="gray">
                          Sesion actual
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Citas registradas en el sistema
                        </Typography>
                        <Typography variant="small" color="gray">
                          {statsLoading ? "Cargando..." : stats.appointments}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Afiliados registrados
                        </Typography>
                        <Typography variant="small" color="gray">
                          {statsLoading ? "Cargando..." : stats.affiliates}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}
