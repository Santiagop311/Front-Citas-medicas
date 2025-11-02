import React from "react";
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import ThemeProvider from "../theme-provider";
import Navbar from "../navbar";
import {
  ArrowSmallRightIcon,
} from "@heroicons/react/24/outline";

export function HeroPresentation() {
 
  return (
    <ThemeProvider>
      <Navbar />
        {/* 🔽 Menú de navegación principal */}
      <nav className="bg-gray-100 shadow-md py-3 px-8 flex justify-center lg:justify-start gap-6 border-b border-gray-200">
        <a
          href="users"
          className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
        >
          Usuarios
        </a>
        <a
          href="#citas"
          className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
        >
          Citas
        </a>
        <a
          href="#roles"
          className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
        >
          Roles
        </a>
        <a
          href="#configuracion"
          className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
        >
          Configuración
        </a>
      </nav>
      <header className="h-full w-screen place-items-center bg-white relative px-8 py-8 lg:mb-36">
        <div className="container mx-auto grid items-center lg:grid-cols-2">
          <div className="text-center lg:text-left pt-32">
            <div className="mb-8 inline-flex items-center">
              <Typography
                variant="small"
                className="mr-3 py-0.5 px-3 font-bold text-dark uppercase border-r border-dark"
              >
                New
              </Typography>
              <Typography
                color="black"
                variant="small"
                className="flex items-center font-bold uppercase"
              >
                Astro Starter Template
              </Typography>
            </div>
            <Typography
              variant="h1"
              color="blue-gray"
              className="mb-8 lg:mr-32 leading-tight font-black"
            >
              The perfect foundation for your <span className="text-blue">Astro Project</span>
            </Typography>
            <Typography variant="lead" color="blue-gray" className="lg:pr-32">
              AstroLaunch UI is a free template designed to be both lightweight and feature-rich. It comes packed with everything you need to get your Online Store ready in no time.
            </Typography>
            <div className="mt-12 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="#pricing">
                <Button color="black" className="flex items-center">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex">
          <img src="header.png" alt="components" className="absolute -top-10 right-0 w-1/2" />
        </div>
      </header>
    </ThemeProvider>
  );
}

export default HeroPresentation;
