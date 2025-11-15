import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { UserCircleIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import ThemeProvider from "./theme-provider";
import ComplexNavbar from "./defaultNavbar";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(user);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.warn("No se pudo parsear user en localStorage", e);
    }
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Ingresa la nueva contraseña.");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("  user"));
      const userId = user?.id
      console.log(user);

      if (!user) {
        alert("No se encontró el usuario autenticado.");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      alert("Ocurrió un error inesperado.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <ComplexNavbar />
      <section className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl border border-gray-200">
          <div className="flex flex-col items-center text-center mb-6">
            <UserCircleIcon className="h-16 w-16 text-gray-700 mb-2" />
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Mi Perfil
            </Typography>
            <Typography color="gray" className="text-sm mt-1">
              Información personal y actualización de contraseña
            </Typography>
          </div>

          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <Typography variant="small" color="gray">Nombre</Typography>
                <Typography variant="paragraph" color="blue-gray" className="font-medium">
                  {user.name || "No disponible"}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <Typography variant="small" color="gray">Correo</Typography>
                <Typography variant="paragraph" color="blue-gray" className="font-medium">
                  {user.email || "No disponible"}
                </Typography>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="flex items-center gap-3">
                <KeyIcon className="h-5 w-5 text-gray-600" />
                <Input
                  color="black"
                  type="password"
                  label="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                color="black"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </ThemeProvider>
  );
}
