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
  UserGroupIcon
} from "@heroicons/react/24/outline";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [message, setMessage] = useState("");


  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.warn("No se pudo parsear user en localStorage", e);
    }
  }, []);

const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  if (!newPassword) return setMessage("Ingresa la nueva contraseña.");
  setLoading(true);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  if (!storedUser) {
    setMessage("No se encontró el usuario autenticado.");
    return;
  }

  const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: newPassword,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setMessage("✔️ Contraseña actualizada correctamente.");
    setNewPassword("");
  } else {
    setMessage(data.message || "❌ Error al actualizar la contraseña.");
  }

  setLoading(false);

  setTimeout(() => setMessage(""), 3000); 
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

  return (
    <ThemeProvider>
      <ComplexNavbar />
      
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {/* Header con degradado */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                  {getInitials(user.name)}
                </div>
                
                {/* Info del usuario */}
                <div>
                  <Typography variant="h3" className="text-white font-bold mb-1">
                    {user.name || "Usuario"}
                  </Typography>
                  <Typography className="text-purple-100 mb-1">
                    Superadmin
                  </Typography>
                  <Typography className="text-purple-200 text-sm">
                    Administración
                  </Typography>
                </div>
              </div>

              {/* Botón Editar Perfil */}
              <Button 
                variant="filled"
                className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg"
              >
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography color="gray" className="font-medium">
                    Afiliados Gestionados
                  </Typography>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <Typography variant="h2" color="blue-gray" className="font-bold">
                  2,450
                </Typography>
              </CardBody>
            </Card>

            {/* Card 2 */}
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography color="gray" className="font-medium">
                    Citas Coordinadas
                  </Typography>
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-cyan-500" />
                  </div>
                </div>
                <Typography variant="h2" color="blue-gray" className="font-bold">
                  458
                </Typography>
              </CardBody>
            </Card>

            {/* Card 3 */}
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography color="gray" className="font-medium">
                    Médicos en Red
                  </Typography>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-indigo-500" />
                  </div>
                </div>
                <Typography variant="h2" color="blue-gray" className="font-bold">
                  1,240
                </Typography>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Tabs de Información */}
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <Tabs value={activeTab}>
              <TabsHeader
                className="bg-transparent border-b border-gray-200"
                indicatorProps={{
                  className: "bg-blue-500 shadow-none",
                }}
              >
                <Tab
                  value="info"
                  onClick={() => setActiveTab("info")}
                  className={activeTab === "info" ? "text-blue-600" : "text-gray-600"}
                >
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    Información Personal
                  </div>
                </Tab>
                <Tab
                  value="seguridad"
                  onClick={() => setActiveTab("seguridad")}
                  className={activeTab === "seguridad" ? "text-blue-600" : "text-gray-600"}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    Seguridad
                  </div>
                </Tab>
                <Tab
                  value="historial"
                  onClick={() => setActiveTab("historial")}
                  className={activeTab === "historial" ? "text-blue-600" : "text-gray-600"}
                >
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Historial
                  </div>
                </Tab>
              </TabsHeader>

              <TabsBody>
                {/* Tab Información Personal */}
                <TabPanel value="info" className="p-8">
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
                    Información Personal
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre Completo */}
                    <div>
                      <Typography variant="small" color="gray" className="mb-2 font-medium">
                        Nombre Completo
                      </Typography>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                        <Typography variant="paragraph" color="blue-gray" className="font-medium">
                          {user.name || "No disponible"}
                        </Typography>
                      </div>
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                      <Typography variant="small" color="gray" className="mb-2 font-medium">
                        Correo Electrónico
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

                {/* Tab Seguridad */}
                <TabPanel value="seguridad" className="p-8">
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
                    Seguridad
                  </Typography>

                  <div className="max-w-md">
                    <Typography color="gray" className="mb-6">
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </Typography>

                    {/* <-- Aquí ponemos el mensaje */}
                    {message && (
                      <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
                        {message}
                      </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div>
                        <Typography variant="small" color="gray" className="mb-2 font-medium">
                          Nueva Contraseña
                        </Typography>
                        <Input
                          color="blue"
                          type="password"
                          label="Ingresa tu nueva contraseña"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          icon={<KeyIcon className="w-5 h-5" />}
                        />
                      </div>

                      <Button
                        color="blue"
                        type="submit"
                        fullWidth
                        disabled={loading}
                        className="flex items-center justify-center gap-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        {loading ? "Actualizando..." : "Actualizar contraseña"}
                      </Button>
                    </form>
                  </div>
                </TabPanel>


                {/* Tab Historial */}
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
                          Última sesión
                        </Typography>
                        <Typography variant="small" color="gray">
                          Hoy a las 10:30 AM
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Cita coordinada
                        </Typography>
                        <Typography variant="small" color="gray">
                          Ayer a las 3:45 PM
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Afiliado registrado
                        </Typography>
                        <Typography variant="small" color="gray">
                          Hace 2 días
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