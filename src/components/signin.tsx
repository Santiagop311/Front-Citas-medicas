import { useState } from "react";
import ThemeProvider from "./theme-provider";
import Navbar from "./defaultNavbar";
import { Typography, Input, Checkbox, Button } from "@material-tailwind/react";

export function SignIn() {
  // 🔹 Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔹 Guarda el token y la info del usuario
        localStorage.setItem("token", data.token);
        
        localStorage.setItem(
          "user",
          JSON.stringify({ name: data.name, email: data.email })
        );

        // 🔹 También guardamos el token en una cookie para el middleware de Astro
        document.cookie = `token=${data.token}; path=/;`;

        // 🔹 Redirige al inicio
        window.location.href = "/";
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <Navbar />
      <section className="grid h-screen items-center lg:grid-cols-2">
        <div className="my-auto p-8 text-center sm:p-10 md:p-20 xl:px-32 xl:py-24">
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Welcome back
          </Typography>
          <Typography className="font-normal mb-16 text-blue-gray-800">
            Welcome back, please enter your details.
          </Typography>

          {/* 👇 Formulario de inicio de sesión */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[24rem] text-left"
          >
            <div className="mb-4">
              <Input
                color="black"
                size="lg"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <Input
                color="black"
                size="lg"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="-ml-3">
                <Checkbox
                  color="blue-gray"
                  label="Remember me"
                  labelProps={{ className: "font-normal" }}
                />
              </div>
              <Typography
                as="a"
                href="#"
                color="blue-gray"
                className="font-medium"
              >
                Forgot password
              </Typography>
            </div>

            {/* 🔹 Botón con estado de carga */}
            <Button
              color="black"
              size="lg"
              className="mt-6"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </Button>
          </form>
        </div>

        <img
          src="https://images.unsplash.com/photo-1613125700782-8394bec3e89d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bmF0aW5zfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
          alt="background image"
          className="hidden h-screen w-full object-cover lg:block"
        />
      </section>
    </ThemeProvider>
  );
}

export default SignIn;
