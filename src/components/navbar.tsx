import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";

// --- Opciones del menú de perfil
const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Inbox", icon: InboxArrowDownIcon },
  { label: "Help", icon: LifebuoyIcon },
  { label: "Sign Out", icon: PowerIcon },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async (e) => {
    e.stopPropagation();
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
      // 🔹 Limpieza local
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 🔹 Indicador visual
      setTimeout(() => {
        window.location.href = "/astro-launch-ui/login";
      }, 800);
    }
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <UserCircleIcon className="h-6 w-6 text-gray-700" />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          const isLogout = label === "Sign Out";

          return (
            <MenuItem
              key={label}
              disabled={loadingLogout && isLogout}
              onClick={(e) => {
                closeMenu();
                if (label === "Sign Out") handleLogout(e);
                if (label === "My Profile") window.location.href = "/profile";
              }}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal flex items-center gap-2"
                color={isLastItem ? "red" : "inherit"}
              >
                {isLogout && loadingLogout ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Cerrando sesión...
                  </>
                ) : (
                  label
                )}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}


// --- Menú de navegación (Pages)
const navListMenuItems = [
  { title: "Usuarios", href: "/users" },
  { title: "Gestion de Citas", href: "/citas" },
  { title: "404", href: "/astro-launch-ui/404" },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };

  const renderItems = navListMenuItems.map(({ title, href }) => (
    <a href={href} key={title}>
      <MenuItem>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 font-normal"
        >
          {title}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-normal outline-none focus:outline-none"
          >
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>

        <MenuList
          {...triggers}
          className="hidden grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          <ul className="col-span-12 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </>
  );
}

// --- Navegación principal ---
const navListItems = [
  { label: "Docs", icon: CodeBracketSquareIcon },
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      <ProfileMenu />
      {navListItems.map(({ label, icon }) => (
        <Typography
          key={label}
          as="a"
          href="https://www.creative-tim.com/learning-lab/astro/quick-start/astro-launch-ui/"
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [shouldShowBorder, setShouldShowBorder] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    const handleScroll = () => {
      setShouldShowBorder(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    });
  }, []);

  return (
    <Navbar
      className={`sticky inset-0 z-10 mx-auto max-w-screen-2xl p-2 lg:pl-6 mt-4 transition-shadow ${
        shouldShowBorder ? "border-b border-gray-300 shadow-none" : ""
      }`}
    >
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography
          as="a"
          href="/"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          AstroLaunch UI
        </Typography>
        <div className="hidden lg:flex ml-auto">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse>
    </Navbar>
  );
}
