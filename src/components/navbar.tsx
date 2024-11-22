"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logout, Login, Menu } from "@mui/icons-material";
import { useTheme, useMediaQuery, IconButton, Drawer } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import AdminNav from "./navigation/adminNav";
import UserNav from "./navigation/userNav";
import RootNav from "./navigation/rootNav";
import CardManager from "./finance/financeDrawer";
import { useFinanceDrawer } from "@/context/cardManager";

function Navbar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Detectar si la pantalla es de tamaño mediano o menor
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  // Estado para manejar los valores de localStorage
  const [role, setRole] = useState<string | null>(null);
  const [searchToken, setSearchToken] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setSearchToken(localStorage.getItem("token"));
  }, [pathname]);

  const { isOpen, toggleDrawer } = useFinanceDrawer();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = (open: boolean) => () => {
    setMenuOpen(open);
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/;"; // Eliminar token de las cookies
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.refresh();
    router.push("/"); // Redirigir a la página de inicio
    if (pathname === "/") {
      window.location.reload();
    }
  };

  return (
    <>
      <nav
        className="py-2 shadow-md w-full flex items-center justify-between"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <div className="flex items-center ml-4 md:w-[25%]" id="logo_image">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} />
            <span
              className="font-bold text-xl"
              style={{ color: theme.palette.background.paper }}
            >
              SkyWings
            </span>
          </Link>
        </div>

        <div
          className="flex items-center justify-end md:w-[75%]"
          id="navbar_options"
        >
          {!searchToken && !isAuthPage && (
            <Link href="/auth/login">
              <button
                className="font-bold py-[20px] mr-6 border-b-2 border-transparent hover:border-gray-50"
                style={{ color: theme.palette.background.paper }}
              >
                Iniciar sesión <Login />
              </button>
            </Link>
          )}

          {searchToken && !isAuthPage && (
            <>
              {/* Mostrar Drawer sólo en pantallas pequeñas */}
              {isSmallScreen ? (
                <>
                  <IconButton
                    onClick={toggleMenu(true)}
                    className="mr-6"
                    style={{ color: theme.palette.background.paper }}
                  >
                    <Menu style={{ fontSize: "2rem" }} />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={menuOpen}
                    onClose={toggleMenu(false)}
                  >
                    <div
                      className="p-4 w-64 h-full"
                      style={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <ul className="flex flex-col space-y-2" id="drawer_menu">
                        {role === "USER" && <UserNav />}
                        {role === "ROOT" && <RootNav />}
                        {role === "ADMIN" && <AdminNav />}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="font-bold py-[18px] text-white border-b-2 border-transparent hover:border-gray-50"
                          >
                            Cerrar sesión <Logout />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </Drawer>
                </>
              ) : (
                // Menú horizontal para pantallas grandes
                <ul
                  className="w-full flex items-center justify-between space-x-4 mr-6"
                  id="nav_menu"
                >
                  {role === "USER" && <UserNav />}
                  {role === "ROOT" && <RootNav />}
                  {role === "ADMIN" && <AdminNav />}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="font-bold py-[20px] w-12 border-b-2 border-transparent hover:border-gray-50"
                      style={{ color: theme.palette.background.paper }}
                    >
                      <Logout />
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </nav>
      <CardManager drawerOpen={isOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}

export default Navbar;
